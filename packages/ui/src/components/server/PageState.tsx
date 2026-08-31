import type { ReactNode } from "react";

export interface PageStateProps {
  eyebrow?: string;
  title: string;
  description: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/** 페이지 단위의 오류·미존재 상태에 사용하는 공통 레이아웃이다. */
export function PageState({
  eyebrow,
  title,
  description,
  actions,
  className = "",
}: PageStateProps) {
  return (
    <main
      className={`flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-20 text-center ${className}`}
    >
      {eyebrow && (
        <p className="text-primary-50 text-[15px] font-bold leading-[1.5]">
          {eyebrow}
        </p>
      )}
      <h1 className="text-text-basic text-[28px] font-bold leading-[1.4] md:text-[32px]">
        {title}
      </h1>
      <div className="text-text-subtle max-w-[420px] text-[16px] leading-[1.6]">
        {description}
      </div>
      {actions && <div className="mt-2 flex items-center gap-3">{actions}</div>}
    </main>
  );
}
