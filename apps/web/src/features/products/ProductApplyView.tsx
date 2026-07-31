"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge, Body, Heading, InfoBox } from "@ui/components/server";
import { Button, CriticalAlert, TextInput } from "@ui/components/client";
import { handleApiError } from "@core/utils/api-client";
import {
  applyProduct,
  getMyProductApplications,
  type ProductApplication,
  type ProductApplicationStatus,
  type ProductSourceType,
} from "./api";

const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,18})[a-z0-9]$/;
const RESERVED_SLUGS = new Set([
  "www",
  "dev",
  "api",
  "admin",
  "mail",
  "apply",
  "applications",
  "products",
  "forif",
]);

const STATUS_LABELS: Record<ProductApplicationStatus, string> = {
  PENDING: "검토 대기중",
  APPROVED: "승인",
  REJECTED: "반려",
};

const STATUS_BADGE_VARIANTS: Record<
  ProductApplicationStatus,
  "warning" | "success" | "danger"
> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};

const INPUT_CLASS =
  "rounded-2 border-input-border bg-input-surface text-gray-70 h-14 w-full border px-4 transition duration-150 ease-in-out focus:border-border-primary focus:outline-none focus:ring-1 focus:ring-primary-50";

type FieldErrors = Partial<Record<keyof FormState, string>>;

interface FormState {
  name: string;
  slug: string;
  oneLiner: string;
  description: string;
  sourceType: ProductSourceType;
  serviceUrl: string;
  githubUrl: string;
  techStack: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  slug: "",
  oneLiner: "",
  description: "",
  sourceType: "STUDY",
  serviceUrl: "",
  githubUrl: "",
  techStack: "",
};

/** 라벨 + 필수 표시 (TextInput의 title과 동일한 형태를 커스텀 레이아웃 필드에 재현) */
function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-text-basic text-[17px] font-bold leading-[1.5]"
    >
      {children}
      <span className="text-text-danger ml-0.5" aria-hidden="true">
        *
      </span>
    </label>
  );
}

export function ProductApplyView() {
  const [applications, setApplications] = useState<ProductApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fetchApplications = useCallback(async () => {
    try {
      setApplications(await getMyProductApplications());
    } catch {
      // 세션 만료 등 — apiClient 공통 처리(onUnauthorized)에 위임
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const update = (patch: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    // 수정한 필드의 오류만 지운다
    setFieldErrors((prev) => {
      const next = { ...prev };
      (Object.keys(patch) as (keyof FormState)[]).forEach((key) => {
        delete next[key];
      });
      return next;
    });
    setErrorMessage(null);
  };

  /** 필드별 검증 — 오류가 있는 필드만 담아 반환 */
  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};

    if (!form.name.trim()) {
      errors.name = "서비스 이름을 입력해주세요.";
    }

    const slug = form.slug.trim().toLowerCase();
    if (!slug) {
      errors.slug = "희망 서브도메인을 입력해주세요.";
    } else if (!SLUG_PATTERN.test(slug)) {
      errors.slug =
        "영소문자·숫자·하이픈 3~20자로, 하이픈으로 시작하거나 끝날 수 없습니다.";
    } else if (RESERVED_SLUGS.has(slug)) {
      errors.slug = `"${slug}"는 사용할 수 없는 예약된 주소입니다.`;
    }

    if (!form.oneLiner.trim()) {
      errors.oneLiner = "한 줄 소개를 입력해주세요.";
    }
    if (!form.description.trim()) {
      errors.description = "상세 소개를 입력해주세요.";
    }

    if (
      form.serviceUrl.trim() &&
      !/^https?:\/\//i.test(form.serviceUrl.trim())
    ) {
      errors.serviceUrl =
        "http:// 또는 https:// 로 시작하는 주소를 입력해주세요.";
    }
    if (form.githubUrl.trim() && !/^https?:\/\//i.test(form.githubUrl.trim())) {
      errors.githubUrl =
        "http:// 또는 https:// 로 시작하는 주소를 입력해주세요.";
    }

    return errors;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage(null);
      // 첫 오류 필드로 이동
      document.getElementById(Object.keys(errors)[0]!)?.focus();
      return;
    }

    const slug = form.slug.trim().toLowerCase();
    setFieldErrors({});
    setIsSubmitting(true);
    try {
      await applyProduct({
        name: form.name.trim(),
        slug,
        one_liner: form.oneLiner.trim(),
        description: form.description.trim(),
        source_type: form.sourceType,
        service_url: form.serviceUrl.trim() || null,
        github_url: form.githubUrl.trim() || null,
        tech_stack: form.techStack
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean),
      });

      setForm(EMPTY_FORM);
      setIsSubmitted(true);
      await fetchApplications();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      const message = await handleApiError(error);
      // 서브도메인 관련 오류는 해당 입력창 아래에 표시한다
      if (message.includes("서브도메인")) {
        setFieldErrors({ slug: message });
      } else {
        setErrorMessage(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {isSubmitted && (
        <div className="mb-8">
          <InfoBox
            variant="success"
            title="신청이 접수되었습니다"
            content={
              <Body size="s" className="text-text-basic">
                운영진 검토 후 결과를 알려드릴게요. 진행 상황은 아래 &lsquo;내
                신청 현황&rsquo;에서 확인할 수 있습니다.
              </Body>
            }
          />
        </div>
      )}

      {/* 내 신청 현황 */}
      <section className="mb-12">
        <Heading size="xs" className="text-text-bolder mb-4">
          내 신청 현황
        </Heading>
        {isLoading ? (
          <p className="text-text-subtle py-6 text-center text-[15px]">
            불러오는 중...
          </p>
        ) : applications.length === 0 ? (
          <p className="text-text-subtle py-6 text-center text-[15px]">
            아직 신청한 서비스가 없습니다.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {applications.map((application) => (
              <li
                key={application.application_id}
                className="rounded-3 border-border-gray-light bg-surface-white flex flex-col gap-2 border p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    label={STATUS_LABELS[application.status]}
                    variant={STATUS_BADGE_VARIANTS[application.status]}
                    appearance="solid-pastel"
                    size="small"
                  />
                  <span className="text-text-bolder text-[17px] font-bold">
                    {application.name}
                  </span>
                  <span className="text-text-subtle text-[14px]">
                    {application.slug}.forif.org · {application.applied_at} 신청
                  </span>
                </div>
                <p className="text-text-basic text-[15px]">
                  {application.one_liner}
                </p>
                {application.status === "REJECTED" &&
                  application.reject_reason && (
                    <div className="bg-surface-danger-subtler text-text-danger rounded-2 mt-1 p-3 text-[14px] leading-[1.6]">
                      <span className="font-bold">반려 사유</span> ·{" "}
                      {application.reject_reason}
                    </div>
                  )}
                {application.status === "APPROVED" && (
                  <p className="text-text-success text-[14px]">
                    서비스 목록에 게시되었습니다.
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 신청 폼 */}
      <section className="border-gray-30 bg-surface-white rounded-3 flex flex-col gap-6 border p-5 sm:p-10">
        <Heading size="xs" className="text-text-bolder">
          새 서비스 신청
        </Heading>

        <TextInput
          id="name"
          title="서비스 이름"
          required
          length="full"
          value={form.name}
          error={fieldErrors.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="예: Attendly"
        />

        {/* 서브도메인은 접미사가 붙는 커스텀 레이아웃이라 오류를 직접 렌더한다 */}
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="slug">희망 서브도메인</FieldLabel>
          <div className="flex items-center gap-2">
            <input
              id="slug"
              className={`${INPUT_CLASS} ${fieldErrors.slug ? "border-input-border-error" : ""}`}
              value={form.slug}
              aria-invalid={fieldErrors.slug ? "true" : undefined}
              aria-describedby={fieldErrors.slug ? "slug-error" : undefined}
              onChange={(e) => update({ slug: e.target.value })}
              placeholder="attendly"
            />
            <span className="text-text-subtle shrink-0 text-[17px]">
              .forif.org
            </span>
          </div>
          {fieldErrors.slug ? (
            <p id="slug-error" className="text-text-danger text-[14px]">
              {fieldErrors.slug}
            </p>
          ) : (
            <p className="text-text-subtle text-[14px]">
              영소문자·숫자·하이픈 3~20자. 승인되면 이 주소로 공개됩니다.
            </p>
          )}
        </div>

        <TextInput
          id="oneLiner"
          title="한 줄 소개"
          required
          length="full"
          value={form.oneLiner}
          error={fieldErrors.oneLiner}
          onChange={(e) => update({ oneLiner: e.target.value })}
          placeholder="서비스를 한 문장으로 소개해주세요"
        />

        {/* TextArea에는 error prop이 없어 저장소 인라인 패턴으로 표시한다 */}
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="description">상세 소개</FieldLabel>
          <textarea
            id="description"
            className={`${INPUT_CLASS} h-40 resize-none py-4 ${fieldErrors.description ? "border-input-border-error" : ""}`}
            value={form.description}
            aria-invalid={fieldErrors.description ? "true" : undefined}
            aria-describedby={
              fieldErrors.description ? "description-error" : undefined
            }
            onChange={(e) => update({ description: e.target.value })}
            placeholder="서비스 배경, 주요 기능, 앞으로의 계획 등"
          />
          {fieldErrors.description ? (
            <p id="description-error" className="text-text-danger text-[14px]">
              {fieldErrors.description}
            </p>
          ) : (
            <p className="text-text-subtle text-[14px]">
              어떤 문제를 풀고, 누구를 위한 서비스인지 적어주세요.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="sourceType">출처</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { value: "STUDY", label: "스터디" },
                { value: "HACKATHON", label: "해커톤" },
                { value: "SIDE", label: "자율 프로젝트" },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                id={option.value === "STUDY" ? "sourceType" : undefined}
                type="button"
                onClick={() => update({ sourceType: option.value })}
                className={`h-11 rounded-[8px] border px-4 text-[15px] font-bold transition-colors ${
                  form.sourceType === option.value
                    ? "border-border-primary bg-surface-primary-subtler text-text-primary"
                    : "border-gray-20 text-gray-70 hover:bg-gray-5"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <TextInput
          id="serviceUrl"
          title="배포된 서비스 URL"
          length="full"
          value={form.serviceUrl}
          error={fieldErrors.serviceUrl}
          helpText="현재 배포 중인 주소가 있으면 검토가 빨라집니다."
          onChange={(e) => update({ serviceUrl: e.target.value })}
          placeholder="https://..."
        />

        <TextInput
          id="githubUrl"
          title="GitHub 저장소"
          length="full"
          value={form.githubUrl}
          error={fieldErrors.githubUrl}
          onChange={(e) => update({ githubUrl: e.target.value })}
          placeholder="https://github.com/..."
        />

        <TextInput
          id="techStack"
          title="기술 스택"
          length="full"
          value={form.techStack}
          helpText="쉼표로 구분해 입력해주세요."
          onChange={(e) => update({ techStack: e.target.value })}
          placeholder="Next.js, Spring Boot, MySQL"
        />

        {errorMessage && <CriticalAlert text={errorMessage} variant="danger" />}

        <div className="flex justify-end">
          <Button
            variant="primary"
            size="large"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-14 min-w-[140px]"
          >
            {isSubmitting ? "신청 중..." : "신청하기"}
          </Button>
        </div>
      </section>
    </div>
  );
}
