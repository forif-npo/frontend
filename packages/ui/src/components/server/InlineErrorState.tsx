import type { ReactNode } from "react";

export interface InlineErrorStateProps {
  message: ReactNode;
  className?: string;
}

/** 목록·상세 영역에서 조회 실패를 알리는 공통 인라인 상태다. */
export function InlineErrorState({
  message,
  className = "",
}: InlineErrorStateProps) {
  return (
    <div
      role="alert"
      className={`text-text-danger py-12 text-center text-sm ${className}`}
    >
      {message}
    </div>
  );
}
