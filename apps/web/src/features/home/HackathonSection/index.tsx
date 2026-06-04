"use client";

import type { ApiResponse, CursorPageResponse } from "@core/types/api";
import type { Hackathon, Submission } from "@core/types/hackathon";
import { apiClient } from "@core/utils/api-client";
import { ArrowLeft, ArrowRight } from "@repo/assets/icons/lucide";
import { useEffect, useState } from "react";
import { HackathonBanner } from "./HackathonBanner";
import { HackathonCard } from "./HackathonCard";

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
        const hackathonsRes = await apiClient
          .get("api/v1/archive/hackathons")
          .json<ApiResponse<CursorPageResponse<Hackathon>>>();
        const hackathons = hackathonsRes.data?.content ?? [];

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

        if (!ignore) setSubmissions(list);
      } catch {
        if (!ignore) setSubmissions([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchSubmissions();
    return () => {
      ignore = true;
    };
  }, []);

  // Mobile: 1 card per page / Desktop: 3 cards per page
  const mobileTotal = submissions.length;
  const desktopTotal = Math.ceil(submissions.length / 3);

  const handlePrev = (perPage: number) => {
    const total = Math.ceil(submissions.length / perPage);
    setCurrentPage((p) => (p === 0 ? total - 1 : p - 1));
  };

  const handleNext = (perPage: number) => {
    const total = Math.ceil(submissions.length / perPage);
    setCurrentPage((p) => (p === total - 1 ? 0 : p + 1));
  };

  const mobileItem = submissions[currentPage] ?? null;
  const desktopItems = submissions.slice(currentPage * 3, currentPage * 3 + 3);

  const skeletonCard = (
    <div className="rounded-3 border-border-gray-light h-[292px] animate-pulse border bg-gray-100" />
  );

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 lg:px-0">
      {/* ── Mobile layout ── */}
      <div className="md:hidden">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-heading-l-mobile tracking-1 text-text-basic font-bold">
            해커톤
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePrev(1)}
              className="border-border-gray-light bg-surface-white flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border"
              aria-label="이전"
            >
              <ArrowLeft className="text-text-basic" size={18} />
            </button>
            <button
              onClick={() => handleNext(1)}
              className="border-border-gray-light bg-surface-white flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border"
              aria-label="다음"
            >
              <ArrowRight className="text-text-basic" size={18} />
            </button>
          </div>
        </div>

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
            bgColor={CARD_COLORS[currentPage % CARD_COLORS.length]}
          />
        ) : null}

        {mobileTotal > 1 && (
          <div className="mt-4 flex items-center justify-center gap-1">
            {Array.from({ length: mobileTotal }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentPage ? "bg-primary-50 w-5" : "w-2 bg-gray-200"
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

          <button
            onClick={() => handlePrev(3)}
            className="border-border-gray-light bg-surface-white hover:bg-surface-white-subtler mt-[74px] flex h-12 w-12 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border"
            aria-label="이전"
          >
            <ArrowLeft className="text-text-basic" size={24} />
          </button>

          <div className="flex flex-1 flex-col gap-6">
            <div className="grid grid-cols-3 gap-6">
              {loading
                ? [1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-3 border-border-gray-light h-[292px] animate-pulse border bg-gray-100"
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
                  onClick={() => setCurrentPage(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentPage ? "bg-primary-50 w-5" : "w-2 bg-gray-50"
                  }`}
                  aria-label={`페이지 ${i + 1}로 이동`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => handleNext(3)}
            className="border-border-gray-light bg-surface-white hover:bg-surface-white-subtler mt-[74px] flex h-12 w-12 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border"
            aria-label="다음"
          >
            <ArrowRight className="text-text-basic" size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
