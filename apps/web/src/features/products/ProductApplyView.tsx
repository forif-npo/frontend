"use client";

import { useEffect, useState } from "react";
import { Badge, Body, Heading } from "@ui/components/server";
import { Button, CriticalAlert } from "@ui/components/client";
import type {
  ProductApplication,
  ProductApplicationStatus,
  ProductSourceType,
} from "./types";
import { MOCK_MY_APPLICATIONS } from "./mock";
import {
  loadLocalApplications,
  saveLocalApplication,
} from "./application-storage";

const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,18})[a-z0-9]$/;
const RESERVED_SLUGS = new Set([
  "www",
  "dev",
  "api",
  "admin",
  "mail",
  "apply",
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
  "rounded-2 border-input-border bg-input-surface text-gray-70 h-14 w-full border px-4 transition duration-150 ease-in-out focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

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

function FormField({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-text-basic text-[17px] font-bold leading-[1.5]">
        {label}
        {required && <span className="ml-1 text-[#d3302f]">*</span>}
      </label>
      {children}
      {hint && <p className="text-text-subtle text-[14px]">{hint}</p>}
    </div>
  );
}

export function ProductApplyView() {
  const [applications, setApplications] = useState<ProductApplication[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // 목업: 로컬 신청 + 평가 결과 예시(승인/반려)를 함께 보여준다
    setApplications([...loadLocalApplications(), ...MOCK_MY_APPLICATIONS]);
  }, []);

  const update = (patch: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setErrorMessage(null);
  };

  const handleSubmit = () => {
    if (
      !form.name.trim() ||
      !form.oneLiner.trim() ||
      !form.description.trim()
    ) {
      setErrorMessage("프로덕트 이름, 한 줄 소개, 상세 소개는 필수입니다.");
      return;
    }

    const slug = form.slug.trim().toLowerCase();
    if (!SLUG_PATTERN.test(slug)) {
      setErrorMessage(
        "서브도메인은 영소문자·숫자·하이픈으로 3~20자여야 하며, 하이픈으로 시작하거나 끝날 수 없습니다.",
      );
      return;
    }
    if (RESERVED_SLUGS.has(slug)) {
      setErrorMessage(`"${slug}"는 사용할 수 없는 예약된 이름입니다.`);
      return;
    }
    if (applications.some((app) => app.slug === slug)) {
      setErrorMessage(
        `"${slug}"는 이미 신청했거나 사용 중인 서브도메인입니다.`,
      );
      return;
    }

    const application: ProductApplication = {
      application_id: `local-${slug}-${Date.now()}`,
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
      status: "PENDING",
      reject_reason: null,
      applied_at: new Date().toISOString().slice(0, 10),
    };

    // TODO(FOR-105): POST /api/v1/products/applications 로 교체
    saveLocalApplication(application);
    setApplications((prev) => [application, ...prev]);
    setForm(EMPTY_FORM);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-[900px] px-4 py-10 sm:px-6 md:py-16">
      {/* 헤더 */}
      <div className="mb-10 flex flex-col gap-3">
        <Heading size="l" className="text-text-bolder">
          프로덕트 등록 신청
        </Heading>
        <Body size="l" className="text-text-basic">
          직접 만든 서비스를 신청하면 운영진 검토 후{" "}
          <span className="font-bold">서브도메인(이름.forif.org)</span>과 함께
          프로덕트 목록에 소개됩니다.
        </Body>
      </div>

      {isSubmitted && (
        <div className="mb-8">
          <CriticalAlert
            text="신청이 접수되었습니다. 운영진 검토 후 결과를 알려드릴게요!"
            variant="success"
          />
        </div>
      )}

      {/* 내 신청 현황 */}
      <section className="mb-12">
        <Heading size="xs" className="text-text-bolder mb-4">
          내 신청 현황
        </Heading>
        {applications.length === 0 ? (
          <p className="text-text-subtle py-6 text-center text-[15px]">
            아직 신청한 프로덕트가 없습니다.
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
                    <div className="rounded-2 mt-1 bg-[#fdefec] p-3 text-[14px] leading-[1.6] text-[#8a1f1c]">
                      <span className="font-bold">반려 사유</span> ·{" "}
                      {application.reject_reason}
                    </div>
                  )}
                {application.status === "APPROVED" && (
                  <p className="text-[14px] text-[#1e7b47]">
                    프로덕트 목록에 게시되었습니다.
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 신청 폼 */}
      <section className="rounded-3 flex flex-col gap-6 border border-[#b1b8be] bg-white p-5 sm:p-10">
        <Heading size="xs" className="text-text-bolder">
          새 프로덕트 신청
        </Heading>

        <FormField label="프로덕트 이름" required>
          <input
            className={INPUT_CLASS}
            value={form.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="예: Attendly"
          />
        </FormField>

        <FormField
          label="희망 서브도메인"
          required
          hint="영소문자·숫자·하이픈 3~20자. 승인되면 이 주소로 서비스됩니다."
        >
          <div className="flex items-center gap-2">
            <input
              className={INPUT_CLASS}
              value={form.slug}
              onChange={(e) => update({ slug: e.target.value })}
              placeholder="attendly"
            />
            <span className="text-text-subtle shrink-0 text-[17px]">
              .forif.org
            </span>
          </div>
        </FormField>

        <FormField label="한 줄 소개" required>
          <input
            className={INPUT_CLASS}
            value={form.oneLiner}
            onChange={(e) => update({ oneLiner: e.target.value })}
            placeholder="서비스를 한 문장으로 소개해주세요"
          />
        </FormField>

        <FormField
          label="상세 소개"
          required
          hint="어떤 문제를 풀고, 누구를 위한 서비스인지 적어주세요."
        >
          <textarea
            className={`${INPUT_CLASS} h-40 resize-none py-4`}
            value={form.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="서비스 배경, 주요 기능, 앞으로의 계획 등"
          />
        </FormField>

        <FormField label="출처" required>
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
                type="button"
                onClick={() => update({ sourceType: option.value })}
                className={`h-11 rounded-[8px] border px-4 text-[15px] font-bold transition-colors ${
                  form.sourceType === option.value
                    ? "border-[#0b50d0] bg-[#ecf2fe] text-[#0b50d0]"
                    : "border-[#cdd1d5] text-[#464c53] hover:bg-[#f4f5f6]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </FormField>

        <FormField
          label="배포된 서비스 URL"
          hint="현재 배포 중인 주소가 있으면 검토가 빨라집니다."
        >
          <input
            className={INPUT_CLASS}
            value={form.serviceUrl}
            onChange={(e) => update({ serviceUrl: e.target.value })}
            placeholder="https://..."
          />
        </FormField>

        <FormField label="GitHub 저장소">
          <input
            className={INPUT_CLASS}
            value={form.githubUrl}
            onChange={(e) => update({ githubUrl: e.target.value })}
            placeholder="https://github.com/..."
          />
        </FormField>

        <FormField label="기술 스택" hint="쉼표로 구분해 입력해주세요.">
          <input
            className={INPUT_CLASS}
            value={form.techStack}
            onChange={(e) => update({ techStack: e.target.value })}
            placeholder="Next.js, Spring Boot, MySQL"
          />
        </FormField>

        {errorMessage && <CriticalAlert text={errorMessage} variant="danger" />}

        <div className="flex justify-end">
          <Button
            variant="primary"
            size="large"
            onClick={handleSubmit}
            className="h-14 min-w-[140px]"
          >
            신청하기
          </Button>
        </div>
      </section>
    </div>
  );
}
