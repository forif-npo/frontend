"use client";

import { Modal } from "@ui/components/client";
import type { UseFormReturn } from "react-hook-form";
import type { StudyOpenValues } from "@core/schemas";
import type { UserInfo } from "../types";
import { StudyCreateReviewContent } from "./StudyCreateReviewContent";

interface StudyCreatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: UseFormReturn<StudyOpenValues>;
  userInfo: UserInfo;
  title?: string;
}

export function StudyCreatePreviewModal({
  isOpen,
  onClose,
  form,
  userInfo,
  title = "스터디 개설 미리보기",
}: StudyCreatePreviewModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      width="xl"
      showCancelButton={false}
      showFooterBorder={false}
    >
      <div className="px-4 pb-8 md:px-6">
        <StudyCreateReviewContent
          values={form.getValues()}
          userInfo={userInfo}
        />
      </div>
    </Modal>
  );
}
