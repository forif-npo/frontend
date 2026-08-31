import type { ReactNode } from "react";

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

/** 목록·그리드 안에서 결과가 없을 때 사용하는 공통 상태다. */
export function EmptyState({
  title,
  description,
  className = "py-12",
  titleClassName = "text-sm",
  descriptionClassName = "mt-2 text-sm",
}: EmptyStateProps) {
  return (
    <div
      className={`text-text-subtle flex flex-col items-center justify-center text-center ${className}`}
    >
      <p className={titleClassName}>{title}</p>
      {description && <p className={descriptionClassName}>{description}</p>}
    </div>
  );
}
