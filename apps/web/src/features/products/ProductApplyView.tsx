"use client";

import { useState } from "react";
import { HintText, Label } from "@ui/components/server";
import {
  AlertModal,
  Button,
  CriticalAlert,
  FileUpload,
  SelectBox,
  TextArea,
  TextInput,
} from "@ui/components/client";
import { handleApiError } from "@core/utils/api-client";
import { useRouter } from "next/navigation";
import { ActionConfirmModal } from "@/components/ActionConfirmModal";
import {
  applyProduct,
  deleteProductApplication,
  updateProductApplication,
  type ProductApplication,
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

type FieldErrors = Partial<Record<keyof FormState | "thumbnail", string>>;

interface FormState {
  name: string;
  slug: string;
  oneLiner: string;
  description: string;
  sourceType: ProductSourceType;
  serviceUrl: string;
  githubUrl: string;
  tags: string;
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
  tags: "",
  techStack: "",
};

const SOURCE_TYPE_OPTIONS = [
  { value: "STUDY", label: "스터디" },
  { value: "HACKATHON", label: "해커톤" },
  { value: "SIDE", label: "자율 프로젝트" },
];

function toFormState(application: ProductApplication): FormState {
  return {
    name: application.name,
    slug: application.slug,
    oneLiner: application.one_liner,
    description: application.description,
    sourceType: application.source_type,
    serviceUrl: application.service_url ?? "",
    githubUrl: application.github_url ?? "",
    tags: application.tags.join(", "),
    techStack: application.tech_stack.join(", "),
  };
}

interface ProductApplyViewProps {
  application?: ProductApplication;
}

export function ProductApplyView({ application }: ProductApplyViewProps) {
  const router = useRouter();
  const isEditMode = application !== undefined;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "modify" | "delete" | null
  >(null);
  const [form, setForm] = useState<FormState>(() =>
    application ? toFormState(application) : EMPTY_FORM,
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isExistingThumbnailRemoved, setIsExistingThumbnailRemoved] =
    useState(false);
  const [thumbnailAlertMessage, setThumbnailAlertMessage] = useState<
    string | null
  >(null);

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
      !thumbnail &&
      (!application?.thumbnail_url || isExistingThumbnailRemoved)
    ) {
      errors.thumbnail = "썸네일을 등록해주세요.";
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

  const handleThumbnailUpload = async (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      setThumbnailAlertMessage(
        "jpg, jpeg, png 형식의 이미지만 업로드할 수 있습니다.",
      );
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      setThumbnailAlertMessage(
        "이미지 파일은 최대 5MB까지 업로드할 수 있습니다.",
      );
      return false;
    }

    setThumbnail(file);
    setIsExistingThumbnailRemoved(false);
    setFieldErrors((prev) => {
      if (!prev.thumbnail) return prev;
      const next = { ...prev };
      delete next.thumbnail;
      return next;
    });
    return true;
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
      const request = {
        name: form.name.trim(),
        slug,
        one_liner: form.oneLiner.trim(),
        description: form.description.trim(),
        source_type: form.sourceType,
        service_url: form.serviceUrl.trim() || null,
        github_url: form.githubUrl.trim() || null,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        tech_stack: form.techStack
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean),
      };

      if (application) {
        await updateProductApplication(
          application.application_id,
          { ...request, remove_thumbnail: isExistingThumbnailRemoved },
          thumbnail,
        );
        router.push("/my?section=service-manage");
      } else {
        await applyProduct(request, thumbnail);
        router.push("/products/apply/complete");
      }
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

  const handleDelete = async () => {
    if (!application || isDeleting) return;

    setIsDeleting(true);
    setErrorMessage(null);
    try {
      await deleteProductApplication(application.application_id);
      router.push("/my?section=service-manage");
    } catch (error) {
      setErrorMessage(await handleApiError(error));
    } finally {
      setIsDeleting(false);
      setConfirmAction(null);
    }
  };

  return (
    <div className="mx-auto max-w-[792px]">
      <section>
        <div className="flex flex-col gap-10">
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

          <div className="flex flex-col gap-1">
            <Label htmlFor="slug">
              희망 서브도메인
              <span className="text-text-danger ml-0.5" aria-hidden="true">
                *
              </span>
            </Label>
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <TextInput
                  id="slug"
                  length="full"
                  value={form.slug}
                  aria-invalid={fieldErrors.slug ? "true" : undefined}
                  aria-describedby={
                    fieldErrors.slug ? "slug-error" : "slug-help"
                  }
                  className={
                    fieldErrors.slug ? "border-input-border-error" : ""
                  }
                  onChange={(e) => update({ slug: e.target.value })}
                  placeholder="attendly"
                />
              </div>
              <span className="text-text-subtle shrink-0 text-[17px]">
                .forif.org
              </span>
            </div>
            {fieldErrors.slug ? (
              <Label id="slug-error" size="s" className="text-text-danger mt-1">
                {fieldErrors.slug}
              </Label>
            ) : (
              <HintText id="slug-help" className="mt-1">
                영소문자, 숫자, 하이픈 3~20자만 가능합니다. 승인되면 이 주소로
                공개됩니다.
              </HintText>
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

          <div id="thumbnail" tabIndex={-1} className="flex flex-col gap-2">
            <Label>
              썸네일
              <span className="text-text-danger ml-0.5" aria-hidden="true">
                *
              </span>
            </Label>
            <FileUpload
              title="이미지 파일 업로드 (jpg, jpeg, png)"
              description="권장 크기 1080px * 720px, 최대 5MB"
              accept="image/jpeg,image/png"
              multiple={false}
              maxFiles={1}
              files={thumbnail ? [thumbnail] : []}
              existingFile={
                application?.thumbnail_url &&
                !thumbnail &&
                !isExistingThumbnailRemoved
                  ? { name: "기존 대표 이미지", url: application.thumbnail_url }
                  : null
              }
              onUpload={handleThumbnailUpload}
              onRemove={() => {
                if (thumbnail) {
                  setThumbnail(null);
                } else {
                  setIsExistingThumbnailRemoved(true);
                }
              }}
            />
            {fieldErrors.thumbnail && (
              <Label id="thumbnail-error" size="s" className="text-text-danger">
                {fieldErrors.thumbnail}
              </Label>
            )}
          </div>

          <TextArea
            id="description"
            title="상세 소개"
            required
            size="large"
            value={form.description}
            error={fieldErrors.description}
            helpText="어떤 문제를 풀고, 누구를 위한 서비스인지 적어주세요."
            onChange={(e) => update({ description: e.target.value })}
            placeholder="서비스 배경, 주요 기능, 앞으로의 계획 등"
          />

          <div className="flex flex-col gap-1">
            <Label htmlFor="sourceType">출처</Label>
            <SelectBox
              id="sourceType"
              value={form.sourceType}
              options={SOURCE_TYPE_OPTIONS}
              placeholder="출처를 선택해주세요"
              onChange={(value) =>
                update({ sourceType: value as ProductSourceType })
              }
            />
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
            id="tags"
            title="태그"
            length="full"
            value={form.tags}
            helpText="쉼표로 구분해 입력해주세요."
            onChange={(e) => update({ tags: e.target.value })}
            placeholder="웹, 교육, 생산성"
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

          {errorMessage && (
            <CriticalAlert text={errorMessage} variant="danger" />
          )}

          <div
            className={
              isEditMode
                ? "flex items-center justify-between gap-4"
                : "flex justify-end"
            }
          >
            {isEditMode && (
              <Button
                variant="tertiary"
                size="large"
                type="button"
                onClick={() => setConfirmAction("delete")}
                disabled={isSubmitting || isDeleting}
              >
                {isDeleting ? "취소 중..." : "신청 취소"}
              </Button>
            )}
            <Button
              variant="primary"
              size="large"
              onClick={() => {
                if (isEditMode) {
                  setConfirmAction("modify");
                } else {
                  void handleSubmit();
                }
              }}
              disabled={isSubmitting || isDeleting}
            >
              {isSubmitting
                ? isEditMode
                  ? "수정 중..."
                  : "신청 중..."
                : isEditMode
                  ? "수정"
                  : "신청하기"}
            </Button>
          </div>
        </div>
      </section>

      <AlertModal
        isOpen={thumbnailAlertMessage !== null}
        description={thumbnailAlertMessage ?? ""}
        descriptionClassName="w-full text-center"
        onClose={() => setThumbnailAlertMessage(null)}
      />
      <ActionConfirmModal
        isOpen={confirmAction !== null}
        target="서비스 등록 신청"
        action={confirmAction === "modify" ? "수정" : "취소"}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (confirmAction === "modify") {
            void handleSubmit();
          } else {
            void handleDelete();
          }
          setConfirmAction(null);
        }}
      />
    </div>
  );
}
