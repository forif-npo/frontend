"use client";

import { Button } from "@ui/components/client";

interface StepNavigationProps {
  onSaveDraft?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  isSubmitting?: boolean;
}

export function StepNavigation({
  onSaveDraft,
  onPrevious,
  onNext,
  isSubmitting = false,
}: StepNavigationProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
      <div className="flex flex-1 gap-3 sm:gap-4">
        {onSaveDraft && (
          <Button
            variant="tertiary"
            size="large"
            onClick={onSaveDraft}
            className="h-14 min-w-0 flex-1 sm:min-w-[90px] sm:flex-none"
            type="button"
          >
            임시저장
          </Button>
        )}
      </div>
      <div className="flex w-full gap-3 sm:w-auto sm:gap-4">
        {onPrevious && (
          <Button
            variant="secondary"
            size="large"
            onClick={onPrevious}
            className="h-14 min-w-0 flex-1 sm:min-w-[90px] sm:flex-none"
            type="button"
          >
            이전
          </Button>
        )}
        {onNext && (
          <Button
            variant="primary"
            size="large"
            onClick={onNext}
            disabled={isSubmitting}
            className="h-14 min-w-0 flex-1 sm:min-w-[90px] sm:flex-none"
            type="button"
          >
            다음
          </Button>
        )}
      </div>
    </div>
  );
}
