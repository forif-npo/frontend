"use client";

import { FaqIcon } from "@repo/assets/icons/krds";
import {
  BookMarked,
  BookOpen,
  CalendarDays,
  Code2,
  FileCheck,
  FolderPlus,
  List,
  MapPin,
  MessageCircle,
  NotebookText,
  Package,
  PenLine,
  UserRound,
} from "@repo/assets/icons/lucide";
import { CarouselArrow, CarouselIndicators } from "@ui/components/client";
import { Label } from "@ui/components/server";
import { FORIF_EXTERNAL_LINKS } from "@/constants/external-links";
import { useHorizontalSwipe } from "@/hooks/useHorizontalSwipe";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { useEffect, useState } from "react";

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
  external?: boolean;
}

const QUICK_MENU_ITEMS: QuickMenuItem[] = [
  { icon: CalendarDays, label: "스터디 신청", href: "/studies/list" },
  { icon: List, label: "스터디 목록", href: "/studies/list" },
  { icon: BookOpen, label: "스터디 개설", href: "/studies/create" },
  { icon: BookMarked, label: "스터디 가이드", href: "/studies/guide" },
  { icon: Code2, label: "해커톤", href: "/hackathon" },
  { icon: Package, label: "서비스", href: "/products" },
  { icon: UserRound, label: "마이페이지", href: "/my" },
  {
    icon: PenLine,
    label: "기술 블로그",
    href: FORIF_EXTERNAL_LINKS.medium,
    external: true,
  },
  {
    icon: MessageCircle,
    label: "문의",
    href: FORIF_EXTERNAL_LINKS.channelTalk,
    external: true,
  },
  { icon: FaqIconAdapter, label: "자주 묻는 질문", href: "/support/faqs" },
  { icon: FileCheck, label: "증명서 발급", href: "/my" },
  {
    icon: FolderPlus,
    label: "운영진 지원",
    href: "/club/recruit",
  },
  { icon: MapPin, label: "지도 보기", href: "/directions" },
  { icon: NotebookText, label: "공지사항", href: "/support/announcements" },
];

const ITEMS_PER_PAGE = 8;

function shuffleItems<T>(items: T[]): T[] {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledItems[index], shuffledItems[randomIndex]] = [
      shuffledItems[randomIndex],
      shuffledItems[index],
    ];
  }

  return shuffledItems;
}

export function QuickMenu() {
  const [quickMenuItems, setQuickMenuItems] = useState(QUICK_MENU_ITEMS);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(quickMenuItems.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setQuickMenuItems(shuffleItems(QUICK_MENU_ITEMS));
  }, []);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const swipeHandlers = useHorizontalSwipe({
    onSwipeLeft: handleNext,
    onSwipeRight: handlePrev,
  });

  const visibleItems = quickMenuItems.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE,
  );

  return (
    <div className="flex w-full flex-col gap-4 md:gap-6">
      <div className="flex items-center gap-4">
        <h2 className="text-heading-l-mobile tracking-1 text-text-basic sm:text-heading-l font-bold">
          자주찾는 메뉴
        </h2>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="flex w-full items-center gap-4">
          <CarouselArrow
            onClick={handlePrev}
            title="이전"
            disabled={currentPage === 0}
            isHidden={currentPage === 0}
            className="hidden md:flex"
          />

          <div
            className="flex min-w-0 flex-1 touch-pan-y flex-wrap justify-center gap-3"
            {...swipeHandlers}
          >
            {visibleItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="rounded-3 border-border-gray bg-surface-white-subtle hover:bg-surface-gray-subtler flex min-h-[108px] w-[calc((100%_-_12px)_/_2)] flex-col items-center justify-center gap-3 border px-3 py-5 text-center shadow-[0_8px_24px_rgba(30,33,36,0.04)] transition-colors sm:min-h-[120px] sm:w-[calc((100%_-_36px)_/_4)] md:min-h-0 md:w-[calc((100%_-_84px)_/_8)] md:py-6 md:shadow-none"
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

          <CarouselArrow
            onClick={handleNext}
            title="다음"
            disabled={currentPage === totalPages - 1}
            isHidden={currentPage === totalPages - 1}
            align="right"
            className="hidden md:flex"
          />
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
