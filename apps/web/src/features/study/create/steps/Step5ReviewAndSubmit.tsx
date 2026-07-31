"use client";

import { useState } from "react";
import { Button } from "@ui/components/client";
import { UseFormReturn } from "react-hook-form";
import type { StudyOpenValues } from "@core/schemas";
import { SubmitConfirmModal } from "../components/SubmitConfirmModal";
import { StudyCreateReviewContent } from "../components/StudyCreateReviewContent";
import type { UserInfo } from "../types";

interface Step5ReviewAndSubmitProps {
  form: UseFormReturn<StudyOpenValues>;
  userInfo: UserInfo;
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function Step5ReviewAndSubmit({
  form,
  userInfo,
  onPrevious,
  onSubmit,
  isSubmitting = false,
}: Step5ReviewAndSubmitProps) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const values = form.getValues();

  const handleSubmitClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsConfirmModalOpen(false);
    onSubmit();
  };

  return (
    <div className="flex w-full flex-col gap-12">
      <p className="text-text-basic text-[24px] font-bold leading-[1.5]">
        입력 정보 확인
      </p>

      <StudyCreateReviewContent values={values} userInfo={userInfo} />

      {/* Bottom Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex flex-1 gap-3 sm:gap-4">
          <Button
            variant="secondary"
            size="large"
            onClick={onPrevious}
            className="h-14 min-w-0 flex-1 sm:min-w-[90px] sm:flex-none"
            type="button"
          >
            이전
          </Button>
        </div>
        <Button
          variant="primary"
          size="large"
          onClick={handleSubmitClick}
          disabled={isSubmitting}
          className="h-14 w-full shrink-0 sm:w-auto sm:min-w-[90px]"
          type="button"
        >
          제출
        </Button>
      </div>

      <SubmitConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  );
}
