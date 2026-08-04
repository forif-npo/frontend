"use client";

import { CircleAlert, X } from "@repo/assets/icons/lucide";
import { SuccessFillIcon } from "@repo/assets/icons/krds";
import { Modal } from "@ui/components/client";

export type ApplicantAction = "accept" | "reject";

export interface ApplicantActionResult {
  type: "success" | "error";
  message: string;
  action?: ApplicantAction;
}

interface ApplicantActionConfirmModalProps {
  isOpen: boolean;
  action: ApplicantAction;
  target: string;
  onClose: () => void;
  onConfirm: () => void;
}

interface ApplicantActionResultModalProps {
  isOpen: boolean;
  result: ApplicantActionResult;
  onClose: () => void;
}

export const applicantActionLabel: Record<ApplicantAction, string> = {
  accept: "승낙",
  reject: "거절",
};

export function ApplicantActionConfirmModal({
  isOpen,
  action,
  target,
  onClose,
  onConfirm,
}: ApplicantActionConfirmModalProps) {
  const label = applicantActionLabel[action];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`신청 ${label}`}
      confirmLabel="확인"
      cancelLabel="취소"
      showHeaderBorder={false}
      showFooterBorder={false}
    >
      <p className="text-text-basic text-body-m pb-4">
        {target}을 {label} 처리할까요?
      </p>
    </Modal>
  );
}

export function ApplicantActionResultModal({
  isOpen,
  result,
  onClose,
}: ApplicantActionResultModalProps) {
  const isRejected = result.type === "success" && result.action === "reject";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onClose}
      title=""
      confirmLabel="확인"
      showCancelButton={false}
      showHeaderBorder={false}
      showFooterBorder={false}
    >
      <div className="flex flex-col items-center gap-6 pb-4 text-center">
        {result.type === "success" && !isRejected ? (
          <SuccessFillIcon
            width={64}
            height={64}
            backgroundColor="var(--color-primary-50)"
          />
        ) : (
          <div className="bg-button-primary-fill flex h-16 w-16 items-center justify-center rounded-full">
            {isRejected ? (
              <X
                size={40}
                strokeWidth={3}
                className="text-text-inverse-static"
                aria-hidden="true"
              />
            ) : (
              <CircleAlert
                size={40}
                strokeWidth={2.5}
                className="text-text-inverse-static"
                aria-hidden="true"
              />
            )}
          </div>
        )}
        <p className="text-text-basic text-body-m">{result.message}</p>
      </div>
    </Modal>
  );
}
