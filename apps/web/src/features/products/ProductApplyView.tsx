"use client";
import { useState } from "react";
import { HintText, Label } from "@ui/components/server";
import { AlertModal, Button, CriticalAlert, FileUpload, SelectBox, TextArea, TextInput } from "@ui/components/client";
import { handleApiError } from "@core/utils/api-client";
import { useRouter } from "next/navigation";
import { ActionConfirmModal } from "@/components/ActionConfirmModal";
import { getThumbnailValidationMessage } from "@/utils/thumbnail-validation";
import { applyProduct, deleteProductApplication, updateProductApplication, type ProductApplication, type ProductSourceType } from "./api";
import { PRODUCT_SOURCE_OPTIONS } from "./constants";
import { EMPTY_PRODUCT_APPLICATION_FORM, toProductApplicationFormState, toProductApplicationRequest, validateProductApplicationForm, type ProductApplicationFieldErrors, type ProductApplicationFormState } from "./product-application-form";

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
  const [form, setForm] = useState<ProductApplicationFormState>(() =>
    application
      ? toProductApplicationFormState(application)
      : EMPTY_PRODUCT_APPLICATION_FORM,
  );
  const [fieldErrors, setFieldErrors] = useState<ProductApplicationFieldErrors>(
    {},
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isExistingThumbnailRemoved, setIsExistingThumbnailRemoved] =
    useState(false);
  const [thumbnailAlertMessage, setThumbnailAlertMessage] = useState<
    string | null
  >(null);

  const update = (patch: Partial<ProductApplicationFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    // 수정한 필드의 오류만 지운다
    setFieldErrors((prev) => {
      const next = { ...prev };
      (Object.keys(patch) as (keyof ProductApplicationFormState)[]).forEach(
        (key) => {
          delete next[key];
        },
      );
      return next;
    });
    setErrorMessage(null);
  };

  const handleThumbnailUpload = async (file: File) => {
    const validationMessage = getThumbnailValidationMessage(file);
    if (validationMessage) {
      setThumbnailAlertMessage(validationMessage);
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

    const errors = validateProductApplicationForm({
      form,
      thumbnail,
      existingThumbnailUrl: application?.thumbnail_url,
      isExistingThumbnailRemoved,
    });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage(null);
      // 첫 오류 필드로 이동
      document.getElementById(Object.keys(errors)[0]!)?.focus();
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    try {
      const request = toProductApplicationRequest(form);

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
              options={PRODUCT_SOURCE_OPTIONS}
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
