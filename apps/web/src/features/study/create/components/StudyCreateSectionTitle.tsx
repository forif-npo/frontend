import type { ReactNode } from "react";

interface StudyCreateSectionTitleProps {
  children: ReactNode;
  icon?: ReactNode;
  required?: boolean;
}

export function StudyCreateSectionTitle({
  children,
  icon,
  required = false,
}: StudyCreateSectionTitleProps) {
  return (
    <div className="flex items-center gap-2">
      <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
        {children}
        {required && (
          <span className="text-text-danger ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </h3>
      {icon}
    </div>
  );
}
