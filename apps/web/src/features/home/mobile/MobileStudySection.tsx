"use client";

import { useEffect } from "react";
import { CalendarDays, ChevronRight } from "@repo/assets/icons/lucide";
import Link from "next/link";
import { useStudyData } from "@/hooks/study/useStudyData";
import { MobileContentCard } from "./MobileContentCard";

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
    <MobileContentCard
      icon={CalendarDays}
      title="스터디 소개"
      moreHref="/studies/list"
      footer={
        <div className="bg-surface-gray-subtler flex flex-col gap-2.5 rounded-xl p-4">
          <Link
            href="/guide"
            className="text-text-basic flex items-center gap-2"
          >
            <span className="text-body-s font-bold leading-[1.5]">
              스터디 가이드
            </span>
            <ChevronRight size={20} />
          </Link>
          <p className="text-text-basic text-body-s leading-[1.5]">
            어떤 스터디를 들어야할까요?
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-5 h-7 animate-pulse rounded" />
            ))}
          </>
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="text-text-basic text-body-m block truncate leading-[1.5]"
            >
              {item.title}
            </Link>
          ))
        )}
      </div>
    </MobileContentCard>
  );
}
