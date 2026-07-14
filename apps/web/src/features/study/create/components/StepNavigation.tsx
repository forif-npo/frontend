"use client";

import type { ReactNode } from "react";
import { Button } from "@ui/components/client";

type StepNavigationButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "text"
  | "icon";

interface StepNavigationAction {
  label: ReactNode;
  onClick: () => void;
  variant?: StepNavigationButtonVariant;
  disabled?: boolean;
}

interface StepNavigationProps {
  onSaveDraft?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  previousVariant?: StepNavigationButtonVariant;
  previousLabel?: string;
  nextLabel?: string;
  isSubmitting?: boolean;
  leadingActions?: StepNavigationAction[];
}

const navigationButtonClass =
  "h-14 min-w-0 flex-1 sm:min-w-[90px] sm:flex-none";

export function StepNavigation({
  onSaveDraft,
  onPrevious,
  onNext,
  previousVariant = "tertiary",
  previousLabel = "이전",
  nextLabel = "다음",
  isSubmitting = false,
  leadingActions = [],
}: StepNavigationProps) {
  const renderButton = (action: StepNavigationAction, key?: string) => (
    <Button
      key={key}
      variant={action.variant ?? "secondary"}
      size="large"
      onClick={action.onClick}
      disabled={action.disabled}
      className={navigationButtonClass}
      type="button"
    >
      {action.label}
    </Button>
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
      <div className="flex flex-1 gap-3 sm:gap-4">
        {onSaveDraft &&
          renderButton({
            label: "임시저장",
            onClick: onSaveDraft,
            variant: "secondary",
          })}
        {leadingActions.map((action) =>
          renderButton(action, String(action.label)),
        )}
      </div>
      <div className="flex w-full gap-3 sm:w-auto sm:gap-4">
        {onPrevious && (
          <Button
            variant={previousVariant}
            size="large"
            onClick={onPrevious}
            className={navigationButtonClass}
            type="button"
          >
            {previousLabel}
          </Button>
        )}
        {onNext && (
          <Button
            variant="primary"
            size="large"
            onClick={onNext}
            disabled={isSubmitting}
            className={navigationButtonClass}
            type="button"
          >
            {nextLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
