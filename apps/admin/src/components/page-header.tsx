import type { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  leadingAction?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon,
  leadingAction,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={className}>
      <div className="flex items-start gap-1">
        {leadingAction && <div className="shrink-0">{leadingAction}</div>}
        <div className="space-y-2">
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            {icon}
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
