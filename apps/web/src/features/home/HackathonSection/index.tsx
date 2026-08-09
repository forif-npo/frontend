"use client";

import type { ApiResponse, CursorPageResponse } from "@core/types/api";
import type { Hackathon, Submission } from "@core/types/hackathon";
import { apiClient } from "@core/utils/api-client";
import { CarouselArrow } from "@ui/components/client";
import { useEffect, useState } from "react";
import { useHorizontalSwipe } from "@/hooks/useHorizontalSwipe";
import { HackathonBanner } from "./HackathonBanner";
import { HackathonCard } from "./HackathonCard";

const CARD_COLORS = ["#e5e2ef", "#cee4ee", "#f5f5f5"];

function orderHackathons(hackathons: Hackathon[]) {
  return [...hackathons].sort(
    (a, b) =>
      b.held_year - a.held_year ||
      b.held_semester - a.held_semester ||
      b.event_round - a.event_round,
  );
}

export function HackathonSection() {
  const [selectedHackathonId, setSelectedHackathonId] = useState<number | null>(
    null,
  );
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"forward" | "backward">(
    "forward",
  );

  useEffect(() => {
    let ignore = false;

    const fetchHackathons = async () => {
      setLoading(true);
      try {
        const hackathonsRes = await apiClient
          .get("api/v1/archive/hackathons")
          .json<ApiResponse<CursorPageResponse<Hackathon>>>();
        const list = orderHackathons(hackathonsRes.data?.content ?? []);

        if (!ignore) {
          setSelectedHackathonId(list[0]?.hackathon_id ?? null);
          if (list.length === 0) {
            setSubmissions([]);
            setLoading(false);
          }
        }
      } catch {
        if (!ignore) {
          setSelectedHackathonId(null);
          setSubmissions([]);
          setLoading(false);
        }
      }
    };

    fetchHackathons();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedHackathonId) return;

    let ignore = false;

    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const res = await apiClient
          .get(`api/v1/archive/hackathons/${selectedHackathonId}/submissions`)
          .json<ApiResponse<CursorPageResponse<Submission>>>();

        if (!ignore) {
          setSubmissions(res.data?.content ?? []);
          setCurrentPage(0);
        }
      } catch {
        if (!ignore) {
          setSubmissions([]);
          setCurrentPage(0);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchSubmissions();
    return () => {
      ignore = true;
    };
  }, [selectedHackathonId]);

  // Mobile: 1 card per page / Desktop: 3 cards per page
  const mobileTotal = submissions.length;
  const desktopTotal = Math.ceil(submissions.length / 3);

  const getCurrentPage = (total: number) =>
    Math.min(currentPage, Math.max(total - 1, 0));

  const handlePrev = (total: number) => {
    if (total <= 1) return;
    setSlideDirection("backward");
    setCurrentPage((page) => Math.max(0, Math.min(page, total - 1) - 1));
  };

  const handleNext = (total: number) => {
    if (total <= 1) return;
    setSlideDirection("forward");
    setCurrentPage((page) => Math.min(Math.max(page, 0) + 1, total - 1));
  };

  const handleSelectPage = (page: number, currentPage: number) => {
    setSlideDirection(page < currentPage ? "backward" : "forward");
    setCurrentPage(page);
  };

  const mobileCurrentPage = getCurrentPage(mobileTotal);
  const desktopCurrentPage = getCurrentPage(desktopTotal);
  const mobileItem = submissions[mobileCurrentPage] ?? null;
  const mobileSwipeHandlers = useHorizontalSwipe({
    onSwipeLeft: () => handleNext(mobileTotal),
    onSwipeRight: () => handlePrev(mobileTotal),
  });
  const desktopItems = submissions.slice(
    desktopCurrentPage * 3,
    desktopCurrentPage * 3 + 3,
  );

  const skeletonCard = (
    <div className="rounded-3 border-border-gray-light bg-gray-5 h-[292px] animate-pulse border" />
  );

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 lg:px-0">
      {/* ── Mobile layout ── */}
      <div className="md:hidden">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-l-mobile tracking-1 text-text-basic font-bold">
              해커톤
            </h2>
          </div>
        </div>

        <div className="touch-pan-y" {...mobileSwipeHandlers}>
          <div
            key={mobileCurrentPage}
            className={`animate-banner-slide-${slideDirection}`}
          >
            {loading ? (
              skeletonCard
            ) : submissions.length === 0 ? (
              <div className="rounded-3 border-border-gray-light bg-surface-white flex h-[240px] items-center justify-center border px-6 text-center">
                <p className="text-text-subtle text-body-m">
                  아직 공개된 해커톤 제출물이 없습니다.
                </p>
              </div>
            ) : mobileItem ? (
              <HackathonCard
                submission={mobileItem}
                bgColor={CARD_COLORS[mobileCurrentPage % CARD_COLORS.length]}
              />
            ) : null}
          </div>
        </div>

        {mobileTotal > 1 && (
          <div className="mt-4 flex items-center justify-center gap-1">
            {Array.from({ length: mobileTotal }).map((_, i) => (
              <button
                key={i}
                onClick={() => handleSelectPage(i, mobileCurrentPage)}
                className={`h-2 rounded-full transition-all ${
                  i === mobileCurrentPage
                    ? "bg-primary-50 w-5"
                    : "w-2 bg-gray-200"
                }`}
                aria-label={`${i + 1}번째로 이동`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Desktop layout ── */}
      <div className="hidden md:block">
        <div className="mb-6">
          <h2 className="text-heading-l tracking-1 text-text-basic font-bold">
            해커톤
          </h2>
        </div>
        <div className="flex items-start gap-6">
          <div className="w-[282px] flex-shrink-0 self-stretch">
            <HackathonBanner />
          </div>

          <CarouselArrow
            onClick={() => handlePrev(desktopTotal)}
            title="이전"
            disabled={desktopTotal <= 1 || desktopCurrentPage === 0}
            isHidden={desktopTotal <= 1 || desktopCurrentPage === 0}
            className="mt-[74px] h-12 w-12 p-0"
          />

          <div className="flex flex-1 flex-col gap-6">
            <div
              key={desktopCurrentPage}
              className={`animate-banner-slide-${slideDirection} grid grid-cols-3 gap-6`}
            >
              {loading
                ? [1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-3 border-border-gray-light bg-gray-5 h-[292px] animate-pulse border"
                    />
                  ))
                : desktopItems.map((submission, index) => (
                    <HackathonCard
                      key={submission.submission_id}
                      submission={submission}
                      bgColor={CARD_COLORS[index % CARD_COLORS.length]}
                    />
                  ))}
              {!loading && submissions.length === 0 && (
                <div className="rounded-3 border-border-gray-light bg-surface-white col-span-3 flex h-[292px] items-center justify-center border px-6 text-center">
                  <p className="text-text-subtle text-body-m">
                    아직 공개된 해커톤 제출물이 없습니다.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-1">
              {Array.from({ length: desktopTotal }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectPage(i, desktopCurrentPage)}
                  className={`h-2 rounded-full transition-all ${
                    i === desktopCurrentPage
                      ? "bg-primary-50 w-5"
                      : "w-2 bg-gray-50"
                  }`}
                  aria-label={`페이지 ${i + 1}로 이동`}
                />
              ))}
            </div>
          </div>

          <CarouselArrow
            onClick={() => handleNext(desktopTotal)}
            title="다음"
            disabled={
              desktopTotal <= 1 || desktopCurrentPage === desktopTotal - 1
            }
            isHidden={
              desktopTotal <= 1 || desktopCurrentPage === desktopTotal - 1
            }
            align="right"
            className="mt-[74px] h-12 w-12 p-0"
          />
        </div>
      </div>
    </section>
  );
}
