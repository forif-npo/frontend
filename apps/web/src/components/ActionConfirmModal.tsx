"use client";

import { AlertModal } from "@ui/components/client";

interface ActionConfirmModalProps {
  isOpen: boolean;
  target: string;
  action: string;
  onClose: () => void;
  onConfirm: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
}

/** 서버 상태를 변경하는 수정·취소 계열 동작의 공통 확인 모달입니다. */
export function ActionConfirmModal({
  isOpen,
  target,
  action,
  onClose,
  onConfirm,
  cancelLabel = "취소",
  confirmLabel = action,
}: ActionConfirmModalProps) {
  const objectParticle =
    (target.charCodeAt(target.length - 1) - 0xac00) % 28 === 0 ? "를" : "을";

  return (
    <AlertModal
      isOpen={isOpen}
      description={`${target}${objectParticle} ${action}하시겠습니까?`}
      descriptionClassName="w-full text-center"
      onClose={onClose}
      onConfirm={onConfirm}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
    />
  );
}
