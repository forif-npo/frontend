"use client";

import { Modal } from "@ui/components/client";

interface SubmitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function SubmitConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: SubmitConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="스터디 개설 신청서 제출"
      confirmLabel="확인"
      cancelLabel="취소"
      showCloseIcon={false}
      width="m"
    >
      <p className="text-text-basic pb-4 text-[17px] leading-[1.5]">
        스터디 개설 신청서를 제출하시겠습니까?
      </p>
    </Modal>
  );
}
