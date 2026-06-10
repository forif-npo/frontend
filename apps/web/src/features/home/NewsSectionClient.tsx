"use client";

import { useState } from "react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import type { NewsItem } from "./NewsSection";

type Tab = "all" | "announcement" | "medium";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "announcement", label: "공지사항" },
  { id: "medium", label: "기술 블로그" },
];

const MORE_HREF: Record<Tab, string> = {
  all: "/support/announcements",
  announcement: "/support/announcements",
  medium: "https://medium.com/forif",
};

interface Props {
  announcements: NewsItem[];
  mediumPosts: NewsItem[];
}

export function NewsSectionClient({ announcements, mediumPosts }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const allItems = [...announcements.slice(0, 6), ...mediumPosts.slice(0, 6)]
    .sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    })
    .slice(0, 4);

  const itemsMap: Record<Tab, NewsItem[]> = {
    all: allItems,
    announcement: announcements.slice(0, 4),
    medium: mediumPosts.slice(0, 4),
  };

  const visibleItems = itemsMap[activeTab];
  const moreHref = MORE_HREF[activeTab];
  const isExternal = moreHref.startsWith("http");

  return (
    <div className="max-w-main mx-auto w-full px-4 lg:px-0">
      <div className="mb-4 md:mb-6">
        <h2 className="text-heading-l-mobile tracking-1 text-text-basic sm:text-heading-l font-bold">
          뉴스
        </h2>
      </div>

      {/* Tabs + 더보기 */}
      <div className="mb-6 flex items-center justify-between border-b border-[#e5e8eb]">
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer px-3 pb-3 pt-1 text-[15px] leading-[1.5] transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-[#052b57] font-bold text-[#052b57]"
                  : "text-text-subtle hover:text-text-basic"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Link
          href={moreHref}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-text-subtle hover:text-text-basic mb-2 flex items-center gap-1 text-[15px] leading-[1.5]"
        >
          더보기
          <span className="text-[18px] font-light">+</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
        {visibleItems.length === 0 && (
          <div className="col-span-2 py-12 text-center text-[15px] text-[#8b95a1]">
            항목이 없습니다.
          </div>
        )}
        {visibleItems.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  const isExternal = item.href.startsWith("http");

  return (
    <Link
      href={item.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group flex h-[180px] flex-col overflow-hidden rounded-[12px] border border-[#e5e8eb] bg-white transition-shadow hover:shadow-md"
    >
      {/* content row */}
      <div className="flex flex-1 gap-0">
        {/* 썸네일 (로드 실패/부재 시 기본 이미지로 폴백) */}
        <div className="relative w-[180px] shrink-0 overflow-hidden bg-[#dfe8f4]">
          <ImageWithFallback
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between p-5 md:p-6">
          <div className="flex flex-col gap-2">
            <p className="text-text-bolder truncate text-[17px] font-bold leading-[1.5]">
              {item.title}
            </p>
            <p className="text-text-subtle line-clamp-2 text-[15px] leading-[1.6]">
              {item.excerpt}
            </p>
          </div>
          <div>
            <span className="text-[15px] font-medium leading-[1.5] text-[#052b57] group-hover:underline">
              {item.linkLabel}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
