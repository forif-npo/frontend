"use client";

import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookMarked,
  CalendarDays,
  FileCheck,
  FolderPlus,
  HeartPulse,
  MapPin,
} from "@repo/assets/icons/lucide";
import { FaqIcon } from "@repo/assets/icons/krds";
import { Label } from "@ui/components/server";
import { CarouselIndicators } from "@ui/components/client/Carousel";
import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { useState } from "react";

const FaqIconAdapter = ({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
  strokeWidth?: number;
}) => (
  <FaqIcon
    width={size}
    height={size}
    className={className}
    color="currentColor"
  />
);

interface QuickMenuItem {
  icon: ComponentType<
    SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }
  >;
  label: string;
  href: string;
}

const QUICK_MENU_ITEMS: QuickMenuItem[] = [
  { icon: CalendarDays, label: "스터디 신청", href: "/studies" },
  { icon: FaqIconAdapter, label: "자주 묻는 질문", href: "/faq" },
  { icon: FileCheck, label: "증명서 발급", href: "/certificate" },
  { icon: FolderPlus, label: "운영진 지원", href: "/apply" },
  { icon: MapPin, label: "동아리방 예약", href: "/reservation" },
  { icon: HeartPulse, label: "스터디 개설", href: "/studies/create" },
  { icon: BookMarked, label: "스터디 가이드", href: "/guide" },
  { icon: BarChart3, label: "공지사항", href: "/notice" },
];

const ITEMS_PER_PAGE = 8;

export function QuickMenu() {
  const totalPages = Math.ceil(QUICK_MENU_ITEMS.length / ITEMS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(0);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const visibleItems = QUICK_MENU_ITEMS.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE,
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-4">
        <h2 className="text-heading-l-mobile tracking-1 text-text-basic sm:text-heading-l font-bold">
          자주찾는 메뉴
        </h2>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="flex w-full items-center gap-4">
          <button
            onClick={handlePrev}
            className="border-border-gray-light bg-surface-white hover:bg-surface-white-subtler hidden shrink-0 cursor-pointer items-center justify-center rounded-full border p-2 md:flex"
            aria-label="이전"
          >
            <ArrowLeft className="text-text-basic" size={24} />
          </button>

          <div className="grid min-w-0 flex-1 grid-cols-4 gap-3 sm:grid-cols-8">
            {visibleItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-3 border-border-gray bg-surface-white-subtle hover:bg-surface-gray-subtler flex flex-col items-center justify-center gap-3 border px-3 py-6 transition-colors"
              >
                <item.icon
                  className="text-text-basic"
                  size={32}
                  strokeWidth={1.5}
                />
                <Label
                  size="xs"
                  weight="bold"
                  className="text-text-basic w-full truncate text-center"
                >
                  {item.label}
                </Label>
              </Link>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="border-border-gray-light bg-surface-white hover:bg-surface-white-subtler hidden shrink-0 cursor-pointer items-center justify-center rounded-full border p-2 md:flex"
            aria-label="다음"
          >
            <ArrowRight className="text-text-basic" size={24} />
          </button>
        </div>

        <CarouselIndicators
          total={totalPages}
          current={currentPage}
          onSelect={setCurrentPage}
        />
      </div>
    </div>
  );
}
