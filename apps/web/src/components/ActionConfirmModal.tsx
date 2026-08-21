"use client";

import { AlertModal } from "@ui/components/client";

interface ActionConfirmModalProps {
  isOpen: boolean;
  target: string;
  action: string;
  onClose: () => void;
  onConfirm: () => void;
}

/** 서버 상태를 변경하는 수정·취소 계열 동작의 공통 확인 모달입니다. */
export function ActionConfirmModal({
  isOpen,
  target,
  action,
  onClose,
  onConfirm,
}: ActionConfirmModalProps) {
  return (
    <AlertModal
      isOpen={isOpen}
      description={`${target}를 ${action}하시겠습니까?`}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmLabel={action}
      cancelLabel="취소"
    />
  );
}
