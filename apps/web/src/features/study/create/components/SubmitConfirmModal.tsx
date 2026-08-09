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
      width="m"
    >
      <div className="flex flex-col gap-4 pb-4">
        <p className="text-text-basic text-[17px] leading-[1.5]">
          스터디 개설 신청서를 제출하시겠습니까?
        </p>
        <p className="text-text-subtle text-[15px] leading-[1.5]">
          제출 후에는 수정이 어려울 수 있습니다. 입력 내용을 다시 한 번
          확인해주세요.
        </p>
      </div>
    </Modal>
  );
}
