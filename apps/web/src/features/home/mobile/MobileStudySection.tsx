"use client";

import { useEffect } from "react";
import { CalendarDays, ChevronRight } from "@repo/assets/icons/lucide";
import Link from "next/link";
import { useStudyData } from "@/hooks/study/useStudyData";

export function MobileStudySection() {
  const { studies, loading, refetch } = useStudyData();

  useEffect(() => {
    refetch({ size: 3 });
  }, [refetch]);

  const items = studies.slice(0, 3).map((study) => ({
    id: study.id,
    title: study.study_name,
    href: `/studies/${study.id}`,
  }));

  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-[#cdd1d5] p-6 shadow-[0px_0px_2px_0px_rgba(0,0,0,0.05),0px_4px_8px_0px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <CalendarDays
            size={24}
            strokeWidth={1.5}
            className="text-text-basic"
          />
          <span className="text-[19px] font-bold leading-[1.5] text-black">
            스터디 소개
          </span>
        </div>
        <Link
          href="/studies/list"
          className="flex h-8 items-center gap-1 px-0.5 text-[17px] leading-[1.5] text-[#1e2124]"
        >
          더보기
          <ChevronRight size={20} className="text-[#1e2124]" />
        </Link>
      </div>

      {/* List Items */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-7 animate-pulse rounded bg-gray-100" />
            ))}
          </>
        ) : (
          items.map((item) => (
            <p
              key={item.id}
              className="truncate text-[17px] leading-[1.5] text-black"
            >
              {item.title}
            </p>
          ))
        )}
      </div>

      {/* Study Guide Box */}
      <div className="flex flex-col gap-2.5 rounded-xl bg-[#f4f5f6] p-4">
        <Link href="/guide" className="flex items-center gap-2">
          <span className="text-[15px] font-bold leading-[1.5] text-black">
            스터디 가이드
          </span>
          <ChevronRight size={20} className="text-black" />
        </Link>
        <p className="text-[15px] leading-[1.5] text-black">
          어떤 스터디를 들어야할까요?
        </p>
      </div>
    </div>
  );
}
