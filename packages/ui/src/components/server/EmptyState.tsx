import type { ReactNode } from "react";

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  textClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  actionsClassName?: string;
}

/** 목록·그리드 안에서 결과가 없을 때 사용하는 공통 상태다. */
export function EmptyState({
  title,
  description,
  actions,
  className = "py-12",
  textClassName = "text-text-subtle",
  titleClassName = "text-sm",
  descriptionClassName = "mt-2 text-sm",
  actionsClassName = "mt-4",
}: EmptyStateProps) {
  return (
    <div
      className={`${textClassName} flex flex-col items-center justify-center text-center ${className}`}
    >
      <p className={titleClassName}>{title}</p>
      {description && <p className={descriptionClassName}>{description}</p>}
      {actions && <div className={actionsClassName}>{actions}</div>}
    </div>
  );
}
