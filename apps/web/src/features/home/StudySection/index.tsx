"use client";

import { useEffect, useState } from "react";
import { CarouselArrow, CarouselIndicators } from "@ui/components/client";
import { Label } from "@ui/components/server";
import Link from "next/link";
import { useStudyData } from "@/hooks/study/useStudyData";
import { useHorizontalSwipe } from "@/hooks/useHorizontalSwipe";
import { StudyCard } from "@/components/study/ui/StudyCard";

export function StudySection() {
  const { studies, loading, refetch } = useStudyData();
  const [currentPage, setCurrentPage] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"forward" | "backward">(
    "forward",
  );

  useEffect(() => {
    setCurrentPage(0);
    refetch({ size: 30 });
  }, [refetch]);

  const mobileTotalPages = studies.length;
  const desktopTotalPages = Math.ceil(studies.length / 3);
  const mobileCurrentPage = Math.min(
    currentPage,
    Math.max(mobileTotalPages - 1, 0),
  );
  const desktopCurrentPage = Math.min(
    currentPage,
    Math.max(desktopTotalPages - 1, 0),
  );
  const desktopStudies = studies.slice(
    desktopCurrentPage * 3,
    desktopCurrentPage * 3 + 3,
  );

  const handlePrev = (totalPages: number) => {
    setSlideDirection("backward");
    setCurrentPage((page) => Math.max(0, Math.min(page, totalPages - 1) - 1));
  };

  const handleNext = (totalPages: number) => {
    setSlideDirection("forward");
    setCurrentPage((page) => Math.min(Math.max(page, 0) + 1, totalPages - 1));
  };

  const handleSelectPage = (page: number, currentPage: number) => {
    setSlideDirection(page < currentPage ? "backward" : "forward");
    setCurrentPage(page);
  };

  const mobileSwipeHandlers = useHorizontalSwipe({
    onSwipeLeft: () => handleNext(mobileTotalPages),
    onSwipeRight: () => handlePrev(mobileTotalPages),
  });

  return (
    <section className="mx-auto w-full max-w-[1320px] px-4 lg:px-0">
      <div className="max-w-main mx-auto mb-6 flex items-end justify-between gap-4">
        <h2 className="text-heading-l-mobile tracking-1 text-text-basic sm:text-heading-l font-bold">
          스터디 소개
        </h2>
        <Link href="/studies/list" className="group flex shrink-0">
          <Label size="m" className="text-text-basic group-hover:underline">
            더보기 +
          </Label>
        </Link>
      </div>
      <div className="md:hidden">
        <div className="touch-pan-y" {...mobileSwipeHandlers}>
          <div
            key={mobileCurrentPage}
            className={`animate-banner-slide-${slideDirection}`}
          >
            {loading ? (
              <div className="rounded-3 border-border-gray-light bg-gray-5 h-[176px] animate-pulse border" />
            ) : studies.length > 0 ? (
              <StudyCard variant="home" study={studies[mobileCurrentPage]!} />
            ) : (
              <EmptyStudyMessage />
            )}
          </div>
        </div>

        {mobileTotalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <CarouselIndicators
              total={mobileTotalPages}
              current={mobileCurrentPage}
              onSelect={(page) => handleSelectPage(page, mobileCurrentPage)}
            />
          </div>
        )}
      </div>

      <div className="hidden md:flex md:items-center md:gap-4">
        {desktopTotalPages > 1 && (
          <CarouselArrow
            onClick={() => handlePrev(desktopTotalPages)}
            title="이전 스터디"
            disabled={desktopCurrentPage === 0}
            isHidden={desktopCurrentPage === 0}
            className="h-12 w-12 shrink-0 p-0"
          />
        )}

        <div className="min-w-0 flex-1">
          <div
            key={desktopCurrentPage}
            className={`animate-banner-slide-${slideDirection}`}
          >
            {loading ? (
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-3 border-border-gray-light bg-gray-5 h-[400px] animate-pulse border"
                  />
                ))}
              </div>
            ) : desktopStudies.length > 0 ? (
              <div className="grid grid-cols-3 gap-6">
                {desktopStudies.map((study) => (
                  <StudyCard key={study.id} variant="home" study={study} />
                ))}
              </div>
            ) : (
              <EmptyStudyMessage />
            )}
          </div>

          {desktopTotalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <CarouselIndicators
                total={desktopTotalPages}
                current={desktopCurrentPage}
                onSelect={(page) => handleSelectPage(page, desktopCurrentPage)}
              />
            </div>
          )}
        </div>

        {desktopTotalPages > 1 && (
          <CarouselArrow
            onClick={() => handleNext(desktopTotalPages)}
            title="다음 스터디"
            disabled={desktopCurrentPage === desktopTotalPages - 1}
            isHidden={desktopCurrentPage === desktopTotalPages - 1}
            align="right"
            className="h-12 w-12 shrink-0 p-0"
          />
        )}
      </div>
    </section>
  );
}

function EmptyStudyMessage() {
  return (
    <div className="rounded-3 border-border-gray-light bg-surface-white flex min-h-[176px] items-center justify-center border px-6 text-center md:min-h-[400px]">
      <p className="text-text-subtle text-body-m">
        이번 학기에 공개된 스터디가 없습니다.
      </p>
    </div>
  );
}
