import { CalendarDays, ChevronRight } from "@repo/assets/icons/lucide";
import Link from "next/link";
import type { ComponentType, SVGProps, ReactNode } from "react";

interface ListItem {
  id: string;
  title: string;
  href?: string;
}

interface MobileContentCardProps {
  icon?: ComponentType<
    SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }
  >;
  title: string;
  moreHref?: string;
  moreText?: string;
  items?: ListItem[];
  description?: string;
  footer?: ReactNode;
}

export function MobileContentCard({
  icon: Icon = CalendarDays,
  title,
  moreHref,
  moreText = "더보기",
  items,
  description,
  footer,
}: MobileContentCardProps) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-[#cdd1d5] p-6 shadow-[0px_0px_2px_0px_rgba(0,0,0,0.05),0px_4px_8px_0px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Icon size={24} strokeWidth={1.5} className="text-text-basic" />
          <span className="text-[19px] font-bold leading-[1.5] text-black">
            {title}
          </span>
        </div>
        {moreHref && (
          <Link
            href={moreHref}
            className="flex h-8 items-center gap-1 px-0.5 text-[17px] leading-[1.5] text-[#1e2124]"
          >
            {moreText}
            <ChevronRight size={20} className="text-[#1e2124]" />
          </Link>
        )}
      </div>

      {/* List Items */}
      {items && items.length > 0 && (
        <div className="flex flex-col gap-4">
          {items.slice(0, 3).map((item) => (
            <p
              key={item.id}
              className="truncate text-[17px] leading-[1.5] text-black"
            >
              {item.title}
            </p>
          ))}
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="text-[17px] leading-[1.5] text-black">{description}</p>
      )}

      {/* Footer */}
      {footer}
    </div>
  );
}
