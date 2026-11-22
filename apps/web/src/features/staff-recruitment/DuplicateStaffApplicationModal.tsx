"use client";
import { AlertModal } from "@ui/components/client";

export function DuplicateStaffApplicationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AlertModal
      isOpen={isOpen}
      description="이미 지원서를 제출했습니다. 마이페이지에서 작성 내역을 확인해 주세요."
      descriptionClassName="w-full text-center"
      onClose={onClose}
      confirmLabel="마이페이지에서 확인"
      showCancelButton={false}
    />
  );
}
