"use client";

import { Modal } from "@ui/components/client";

interface SubmitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isEditing?: boolean;
}

export function SubmitConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isEditing = false,
}: SubmitConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={isEditing ? "스터디 개설 신청서 수정" : "스터디 개설 신청서 제출"}
      confirmLabel="확인"
      cancelLabel="취소"
      width="m"
    >
      <div className="flex flex-col gap-4 pb-4">
        <p className="text-text-basic text-[17px] leading-[1.5]">
          {isEditing
            ? "수정한 스터디 개설 신청서를 저장하시겠습니까?"
            : "스터디 개설 신청서를 제출하시겠습니까?"}
        </p>
        <p className="text-text-subtle text-[15px] leading-[1.5]">
          {isEditing
            ? "개설 신청 기간이 끝나면 더 이상 수정할 수 없습니다."
            : "제출 후에는 수정이 어려울 수 있습니다. 입력 내용을 다시 한 번 확인해주세요."}
        </p>
      </div>
    </Modal>
  );
}
