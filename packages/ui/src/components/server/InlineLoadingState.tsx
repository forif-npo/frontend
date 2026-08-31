import type { ReactNode } from "react";

export interface InlineLoadingStateProps {
  message: ReactNode;
  className?: string;
  textClassName?: string;
  textToneClassName?: string;
}

/** 목록·상세 영역에서 데이터를 불러오는 동안 보여주는 공통 인라인 상태다. */
export function InlineLoadingState({
  message,
  className = "py-12",
  textClassName = "text-sm",
  textToneClassName = "text-text-subtle",
}: InlineLoadingStateProps) {
  return (
    <div
      role="status"
      className={`${textToneClassName} text-center ${textClassName} ${className}`}
    >
      {message}
    </div>
  );
}
