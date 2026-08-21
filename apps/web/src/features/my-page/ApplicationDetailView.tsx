"use client";

import { useState } from "react";
import { Button } from "@ui/components/client";
import { Badge, CharacterCount } from "@ui/components/server";
import {
  cancelStudyApplication,
  type ApplicationDetail,
  updateStudyApplication,
} from "@core/my-page/api";
import { handleApiError } from "@core/utils/api-client";
import {
  getNumericDifficultyBadgeVariant,
  NUMERIC_DIFFICULTY_LABELS,
  APPLICATION_STATUS_LABELS,
} from "@/constants/study";
import { getStudyTagLabel } from "@/constants/study-tags";
import { ActionConfirmModal } from "@/components/ActionConfirmModal";

interface ApplicationDetailViewProps {
  application: ApplicationDetail & {
    apply_date: string;
    apply_year: number;
    apply_semester: number;
    user_apply_id: number;
  };
  canCancel: boolean;
  cancelDisabledMessage: string;
  onCancelled: () => void;
}

export function ApplicationDetailView({
  application,
  canCancel,
  cancelDisabledMessage,
  onCancelled,
}: ApplicationDetailViewProps) {
  const { study, priority, intro, status } = application;
  const isAutonomousStudy = study.autonomous_study === true || intro === null;
  const priorityLabel = priority === "PRIMARY" ? "1순위" : "2순위";
  const difficultyLabel = NUMERIC_DIFFICULTY_LABELS[study.difficulty] ?? "보통";
  const statusLabel = APPLICATION_STATUS_LABELS[status] ?? "지원중";
  const initialIntro = intro ?? "";
  const [savedIntro, setSavedIntro] = useState(initialIntro);
  const [draftIntro, setDraftIntro] = useState(initialIntro);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<
    "modify" | "cancel" | null
  >(null);
  const isPending = status === 0;
  const hasChanged = draftIntro !== savedIntro;

  const handleSubmit = async () => {
    if (isAutonomousStudy) return;

    if (draftIntro.length < 50 || draftIntro.length > 500) {
      setSubmitError("지원 사유는 50자 이상 500자 이내로 작성해주세요.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await updateStudyApplication(application.user_apply_id, {
        study_id: study.study_id,
        apply_reason: draftIntro,
        priority: priority === "PRIMARY" ? 1 : 2,
      });
      setSavedIntro(draftIntro);
      setSubmitSuccess("지원서가 수정되었습니다.");
    } catch (error) {
      setSubmitError(await handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await cancelStudyApplication(application.user_apply_id);
      onCancelled();
    } catch (error) {
      setSubmitError(await handleApiError(error));
    } finally {
      setIsCancelling(false);
    }
  };

  const requestModify = () => {
    if (isAutonomousStudy) return;

    if (draftIntro.length < 50 || draftIntro.length > 500) {
      setSubmitError("지원 사유는 50자 이상 500자 이내로 작성해주세요.");
      return;
    }
    setConfirmAction("modify");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Study title */}
      <p className="text-text-bolder text-[40px] font-bold leading-[1.5] tracking-[1px]">
        {study.study_name}
      </p>

      {/* Badges: status | tags | difficulty | priority */}
      <div className="flex flex-wrap items-center gap-2">
        {/* status */}
        <Badge
          label={statusLabel}
          variant="info"
          appearance="solid-pastel"
          size="large"
        />
        {/* tags */}
        {study.tags.map((tag) => (
          <Badge
            key={tag}
            label={getStudyTagLabel(tag)}
            variant="info"
            appearance="solid-pastel"
            size="large"
          />
        ))}
        {/* difficulty */}
        <Badge
          label={difficultyLabel}
          variant={getNumericDifficultyBadgeVariant(study.difficulty)}
          appearance="solid-pastel"
          size="large"
        />
        {/* priority */}
        <Badge
          label={priorityLabel}
          variant="info"
          appearance="solid-pastel"
          size="large"
        />
      </div>

      {/* Form area: pt-[50px] */}
      <div className="flex flex-col gap-10 pt-[50px]">
        {/* Card */}
        <div className="border-border-gray bg-surface-white flex flex-col gap-6 rounded-xl border p-10">
          {/* Card title */}
          <p className="text-text-bolder text-[24px] font-bold leading-[1.5]">
            스터디 지원서
          </p>

          {/* 지원 순위 */}
          <div className="flex flex-col gap-6">
            <p className="text-text-basic text-[19px] font-bold leading-[1.5]">
              지원 순위 <span className="text-text-danger font-normal">*</span>
            </p>
            <div className="border-border-gray bg-surface-disabled flex h-14 items-center rounded-lg border px-4">
              <p className="text-text-subtle flex-1 text-[19px] leading-[1.5]">
                {priorityLabel}
              </p>
            </div>
          </div>

          {/* 지원 사유 */}
          <div className="flex flex-col gap-6">
            <p className="text-text-basic text-[19px] font-bold leading-[1.5]">
              지원 사유 <span className="text-text-danger font-normal">*</span>
            </p>
            <div className="flex flex-col gap-2">
              <p className="text-text-subtle text-[13px] leading-[1.5]">
                해당 스터디를 수강하고 싶은 사유를 작성해주세요. 최소 50자 이상,
                최대 500자 이내로 작성해주세요.
              </p>
              <textarea
                id={`application-intro-${application.user_apply_id}-${priority}`}
                value={draftIntro}
                onChange={(event) => {
                  setDraftIntro(event.target.value);
                  setSubmitError(null);
                  setSubmitSuccess(null);
                }}
                disabled={isAutonomousStudy}
                readOnly={!isPending || isSubmitting || isCancelling}
                maxLength={500}
                aria-describedby={
                  submitError ? "application-intro-error" : undefined
                }
                className="border-border-gray-dark bg-surface-white text-text-basic focus:border-border-primary focus:ring-border-primary disabled:bg-surface-disabled disabled:text-text-subtle h-[300px] resize-none rounded-md border px-4 py-2 text-[17px] leading-[1.5] read-only:cursor-default focus:outline-none focus:ring-1"
              />
              <CharacterCount count={draftIntro.length} max={500} />
              {!isPending && (
                <p className="text-text-subtle text-[13px] leading-[1.5]">
                  대기 중인 신청서만 수정할 수 있습니다.
                </p>
              )}
              {isPending && !canCancel && (
                <p className="text-text-subtle text-[13px] leading-[1.5]">
                  {cancelDisabledMessage}
                </p>
              )}
              {submitError && (
                <p
                  id="application-intro-error"
                  className="text-text-danger text-[13px] leading-[1.5]"
                >
                  {submitError}
                </p>
              )}
              {submitSuccess && (
                <p className="text-text-success text-[13px] leading-[1.5]">
                  {submitSuccess}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="tertiary"
            onClick={() => setConfirmAction("cancel")}
            size="large"
            disabled={!canCancel || isSubmitting || isCancelling}
          >
            {isCancelling ? "취소 중..." : "신청 취소"}
          </Button>
          <Button
            variant="primary"
            size="large"
            disabled={
              isAutonomousStudy ||
              !isPending ||
              !hasChanged ||
              isSubmitting ||
              isCancelling
            }
            onClick={requestModify}
          >
            {isSubmitting ? "수정 중..." : "수정"}
          </Button>
        </div>
      </div>
      <ActionConfirmModal
        isOpen={confirmAction !== null}
        target="스터디 신청서"
        action={confirmAction === "modify" ? "수정" : "취소"}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (confirmAction === "modify") {
            void handleSubmit();
          } else {
            void handleCancel();
          }
        }}
      />
    </div>
  );
}
