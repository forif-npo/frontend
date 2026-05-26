"use client";
import React from "react";
import { Button } from "@repo/ui/components/client";

interface StudyActionButtonsProps {
  onApplyClick?: () => void;
  onCreateClick?: () => void;
  size?: "small" | "medium" | "large";
  className?: string;
}

export const StudyActionButtons: React.FC<StudyActionButtonsProps> = ({
  onApplyClick,
  onCreateClick,
  size = "large",
  className = "",
}) => {
  return (
    <div className={`flex gap-2 sm:gap-4 ${className}`}>
      <Button
        variant="primary"
        size={size}
        disabled={true}
        className={size === "large" ? "px-8" : "px-4"}
        onClick={onApplyClick}
      >
        스터디 개설하기
      </Button>
      <Button
        variant="primary"
        size={size}
        className={size === "large" ? "px-5" : "px-3"}
        onClick={onCreateClick}
      >
        스터디 가이드
      </Button>
    </div>
  );
};
