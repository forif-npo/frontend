import { CalendarDays, ChevronRight } from "@repo/assets/icons/lucide";
import Link from "next/link";
import type { ComponentType, ReactNode, SVGProps } from "react";
import { cn } from "@ui/utils/cn";

export interface MobileContentListItem {
  id: string | number;
  title: string;
  href?: string;
}

interface MobileContentCardProps {
  icon?: ComponentType<
    SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }
  >;
  title?: string;
  moreHref?: string;
  moreText?: string;
  moreTarget?: "_blank";
  moreRel?: string;
  items?: MobileContentListItem[];
  description?: string;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function MobileContentCard({
  icon: Icon = CalendarDays,
  title,
  moreHref,
  moreText = "더보기",
  moreTarget,
  moreRel,
  items,
  description,
  footer,
  children,
  className,
}: MobileContentCardProps) {
  return (
    <section
      className={cn(
        "border-border-gray-light bg-surface-white flex w-full flex-col gap-4 rounded-xl border p-6 shadow-sm",
        className,
      )}
    >
      {title && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Icon size={24} strokeWidth={1.5} className="text-text-basic" />
            <span className="text-heading-s text-text-basic font-bold leading-[1.5]">
              {title}
            </span>
          </div>
          {moreHref && (
            <Link
              href={moreHref}
              target={moreTarget}
              rel={moreRel}
              className="text-text-basic text-body-m flex h-8 items-center gap-1 px-0.5 leading-[1.5]"
            >
              {moreText}
              <ChevronRight size={20} />
            </Link>
          )}
        </div>
      )}

      {items && items.length > 0 && (
        <div className="flex flex-col gap-4">
          {items.slice(0, 3).map((item) => {
            const className =
              "text-text-basic block truncate text-body-m leading-[1.5]";

            return item.href ? (
              <Link key={item.id} href={item.href} className={className}>
                {item.title}
              </Link>
            ) : (
              <p key={item.id} className={className}>
                {item.title}
              </p>
            );
          })}
        </div>
      )}

      {description && (
        <p className="text-text-basic text-body-m leading-[1.5]">
          {description}
        </p>
      )}

      {children}
      {footer}
    </section>
  );
}
