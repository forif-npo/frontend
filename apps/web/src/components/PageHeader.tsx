import { Breadcrumb } from "@ui/components/server";
import type { ReactNode } from "react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface PageHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description?: ReactNode;
  titleAddon?: ReactNode;
  action?: ReactNode;
}

/**
 * 일반 정보 페이지의 표준 헤더.
 * Breadcrumb → 제목 → 한 줄 설명 순서를 유지한다.
 */
export function PageHeader({
  breadcrumbs,
  title,
  description,
  titleAddon,
  action,
}: PageHeaderProps) {
  return (
    <header>
      <div className="mb-6">
        <Breadcrumb items={breadcrumbs} />
      </div>
      <div
        className={
          action
            ? "mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
            : "mb-8"
        }
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
            {titleAddon}
          </div>
          {description && (
            <p className="text-text-basic mt-2 text-sm">{description}</p>
          )}
        </div>
        {action}
      </div>
    </header>
  );
}
