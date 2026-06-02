"use client";

import type { ApiResponse, CursorPageResponse } from "@core/types/api";
import type { Hackathon, Submission } from "@core/types/hackathon";
import { apiClient } from "@core/utils/api-client";
import { ArrowLeft, ArrowRight } from "@repo/assets/icons/lucide";
import { useEffect, useState } from "react";
import { HackathonBanner } from "./HackathonBanner";
import { HackathonCard } from "./HackathonCard";

const ITEMS_PER_PAGE = 3;
const CARD_COLORS = ["#e5e2ef", "#cee4ee", "#f5f5f5"];

export function HackathonSection() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    let ignore = false;

    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        // 1) 아카이브 해커톤 목록 조회
        const hackathonsRes = await apiClient
          .get("api/v1/archive/hackathons")
          .json<ApiResponse<CursorPageResponse<Hackathon>>>();
        const hackathons = hackathonsRes.data?.content ?? [];

        // 최신 해커톤 1개 선택 (연도 > 학기 > 회차 내림차순)
        const latest = [...hackathons].sort(
          (a, b) =>
            b.held_year - a.held_year ||
            b.held_semester - a.held_semester ||
            b.event_round - a.event_round,
        )[0];

        if (!latest) {
          if (!ignore) setSubmissions([]);
          return;
        }

        // 2) 최신 해커톤의 제출물만 조회 (최신순 정렬)
        const res = await apiClient
          .get(`api/v1/archive/hackathons/${latest.hackathon_id}/submissions`)
          .json<ApiResponse<CursorPageResponse<Submission>>>();
        const list = (res.data?.content ?? [])
          .slice()
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          );

        if (!ignore) {
          setSubmissions(list);
        }
      } catch {
        if (!ignore) {
          setSubmissions([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchSubmissions();

    return () => {
      ignore = true;
    };
  }, []);

  const totalPages = Math.ceil(submissions.length / ITEMS_PER_PAGE);
  const visibleItems = submissions.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE,
  );

  const handlePrev = () => {
    if (totalPages <= 1) return;
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    if (totalPages <= 1) return;
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 lg:px-0">
      <div className="mb-6">
        <h2 className="text-heading-l-mobile tracking-1 text-text-basic sm:text-heading-l font-bold">
          해커톤
        </h2>
      </div>
      <div className="flex items-start gap-6">
        {/* Left Banner */}
        <div className="w-[282px] flex-shrink-0 self-stretch">
          <HackathonBanner />
        </div>

        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="border-border-gray-light bg-surface-white hover:bg-surface-white-subtler mt-[74px] flex h-12 w-12 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border"
          aria-label="이전"
        >
          <ArrowLeft className="text-text-basic" size={24} />
        </button>

        {/* Cards + Indicators */}
        <div className="flex flex-1 flex-col gap-6">
          <div className="grid grid-cols-3 gap-6">
            {loading
              ? [1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="rounded-3 border-border-gray-light h-[292px] animate-pulse border bg-gray-100"
                  />
                ))
              : visibleItems.map((submission, index) => (
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

          {/* Carousel Indicators */}
          <div className="flex items-center justify-center gap-1">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentPage ? "bg-primary-50 w-5" : "w-2 bg-gray-50"
                }`}
                aria-label={`페이지 ${index + 1}로 이동`}
                aria-current={index === currentPage ? "true" : "false"}
              />
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="border-border-gray-light bg-surface-white hover:bg-surface-white-subtler mt-[74px] flex h-12 w-12 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border"
          aria-label="다음"
        >
          <ArrowRight className="text-text-basic" size={24} />
        </button>
      </div>
    </section>
  );
}
