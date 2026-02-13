"use client";
import React from "react";
import { Button } from "@repo/ui/components/client";

interface StudyActionButtonsProps {
  onApplyClick?: () => void;
  onCreateClick?: () => void;
  className?: string;
}

export const StudyActionButtons: React.FC<StudyActionButtonsProps> = ({
  onApplyClick,
  onCreateClick,
  className = "",
}) => {
  return (
    <div className={`flex gap-4 ${className}`}>
      <Button
        variant="primary"
        size="large"
        disabled={true}
        className="px-8"
        onClick={onApplyClick}
      >
        스터디 개설하기
      </Button>
      <Button
        variant="primary"
        size="large"
        className="px-5"
        onClick={onCreateClick}
      >
        스터디 가이드
      </Button>
    </div>
  );
};
