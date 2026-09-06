"use client";
import React from "react";
import { Button } from "@repo/ui/components/client";

interface StudyActionButtonsProps {
  onCreateClick?: () => void;
  size?: "small" | "medium" | "large";
  className?: string;
}

export const StudyActionButtons: React.FC<StudyActionButtonsProps> = ({
  onCreateClick,
  size = "large",
  className = "",
}) => {
  return (
    <div className={`flex gap-2 sm:gap-4 ${className}`}>
      <Button
        variant="primary"
        size={size}
        disabled={false}
        onClick={onCreateClick}
      >
        스터디 개설하기
      </Button>
    </div>
  );
};
