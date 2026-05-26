"use client";

import { useEffect } from "react";
import { Label } from "@ui/components/server";
import Link from "next/link";
import { useStudyData } from "@/hooks/study/useStudyData";
import { getCurrentSemester } from "@/constants/study";
import { StudyCard } from "./StudyCard";

export function StudySection() {
  const { year, semester } = getCurrentSemester();
  const { studies, loading, refetch } = useStudyData();

  useEffect(() => {
    refetch({ size: 3 });
  }, [refetch]);

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 lg:px-0">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-heading-l-mobile tracking-1 text-text-basic sm:text-heading-l font-bold">
          {year}-{semester} 스터디 소개
        </h2>
        <Link href="/studies/list" className="flex items-center gap-1">
          <Label size="m" className="text-text-basic">
            더보기
          </Label>
          <span className="text-text-basic text-[20px] leading-none">+</span>
        </Link>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-3 border-border-gray-light h-[400px] animate-pulse border bg-gray-100"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studies.slice(0, 3).map((study) => (
            <StudyCard key={study.id} study={study} />
          ))}
        </div>
      )}
    </section>
  );
}
