"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useHackathonResults } from "../hooks/use-hackathon-results";
import { generateSlides } from "../slides";
import type { PresentationSlide } from "../slides";
import { TRACK_LABELS, TRACK_ORDER } from "../types";
import type { AwardResult, ResultTrack } from "../types";
import { PresentationControls } from "./presentation-controls";

interface PresentationScreenProps {
  hackathonId: number;
}

/**
 * FORIF / KRDS 브랜드 팔레트.
 * - primary 블루, point 코랄레드, 딥 네이비 배경.
 */
const COLORS = {
  bgFrom: "#041a44",
  bgVia: "#03132f",
  bgTo: "#01081c",
  primary: "#4c87f6",
  primaryBright: "#86aff9",
  point: "#e0858c",
  pointBright: "#f0b0b5",
  textMuted: "#aab4c5",
  textFaint: "#6b7689",
  hairline: "rgba(134, 175, 249, 0.18)",
} as const;

// 부문별 강조색 — 두 부문을 또렷이 구분한다(단일 남색만 쓰지 않는다).
const TRACK_COLOR: Record<ResultTrack, string> = {
  IDEATHON: COLORS.pointBright,
  HACKATHON: COLORS.primaryBright,
};

function rankLabel(result: AwardResult): string {
  return result.rank === null ? "특별상" : `${result.rank}위`;
}

export function PresentationScreen({ hackathonId }: PresentationScreenProps) {
  const { draft, hydrated } = useHackathonResults(hackathonId, "", {
    readOnly: true,
  });

  const slides = useMemo<PresentationSlide[]>(
    () => (draft ? generateSlides(draft) : []),
    [draft],
  );

  const [index, setIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 데이터 변경 시 슬라이드 인덱스를 유효 범위로 보정한다.
  useEffect(() => {
    setIndex((prev) => {
      if (slides.length === 0) return 0;
      return Math.min(Math.max(prev, 0), slides.length - 1);
    });
  }, [slides.length]);

  const goNext = useCallback(() => {
    setIndex((prev) => Math.min(prev + 1, slides.length - 1));
  }, [slides.length]);
  const goPrev = useCallback(() => {
    setIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {
        // 전체화면을 지원하지 않아도 발표는 계속 가능하다.
      });
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowRight":
        case " ":
        case "Enter":
          event.preventDefault();
          goNext();
          break;
        case "ArrowLeft":
          event.preventDefault();
          goPrev();
          break;
        case "Home":
          event.preventDefault();
          setIndex(0);
          break;
        case "End":
          event.preventDefault();
          setIndex(slides.length - 1);
          break;
        case "f":
        case "F":
          event.preventDefault();
          toggleFullscreen();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, slides.length, toggleFullscreen]);

  const background = {
    backgroundImage: `radial-gradient(circle at 50% 0%, ${COLORS.bgFrom} 0%, ${COLORS.bgVia} 45%, ${COLORS.bgTo} 100%)`,
  } as const;

  if (!hydrated) {
    return (
      <main
        className="flex min-h-screen items-center justify-center"
        style={{ ...background, color: COLORS.textMuted }}
      >
        불러오는 중…
      </main>
    );
  }

  const hasResults = slides.length > 1;
  if (!hasResults) {
    return (
      <main
        className="flex min-h-screen flex-col items-center justify-center gap-6 px-8 text-center text-white"
        style={background}
      >
        <p className="text-2xl font-medium">발표할 결과가 없습니다.</p>
        <p style={{ color: COLORS.textMuted }}>
          관리 화면의 결과 발표 탭에서 수상 결과를 먼저 입력하세요.
        </p>
        <a
          href={`/hackathon/${hackathonId}`}
          className="rounded-md px-5 py-2.5 font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: COLORS.primary }}
        >
          결과 입력 화면으로 이동
        </a>
      </main>
    );
  }

  const slide = slides[index];

  return (
    <main
      className="relative flex min-h-screen flex-col overflow-hidden text-white"
      style={background}
    >
      {/* 상단 브랜드 액센트 라인 */}
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{
          backgroundImage: `linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.point} 100%)`,
        }}
      />

      {/* 스크린 리더용 현재 상태 안내 */}
      <p className="sr-only" aria-live="polite">
        {slide.type === "AWARD"
          ? `${TRACK_LABELS[slide.result.track]} ${rankLabel(slide.result)} ${slide.result.teamName}`
          : ""}
      </p>

      <div
        key={index}
        className="result-slide-enter flex flex-1 items-center justify-center px-8 py-16 sm:px-16"
      >
        <SlideBody slide={slide} />
      </div>

      <div className="flex items-center justify-between px-6 pb-6">
        <span className="text-sm" style={{ color: COLORS.textFaint }}>
          {index + 1} / {slides.length}
        </span>
        <PresentationControls
          canPrev={index > 0}
          canNext={index < slides.length - 1}
          isFullscreen={isFullscreen}
          onPrev={goPrev}
          onNext={goNext}
          onToggleFullscreen={toggleFullscreen}
        />
      </div>
    </main>
  );
}

function SlideBody({ slide }: { slide: PresentationSlide }) {
  switch (slide.type) {
    case "COVER":
      return (
        <div className="text-center">
          <p
            className="mb-8 text-2xl font-bold tracking-[0.5em] sm:text-3xl"
            style={{ color: COLORS.primaryBright }}
          >
            FORIF
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl">
            {slide.title || "해커톤 시상식"}
          </h1>
          <div
            className="mx-auto mt-8 h-px w-24"
            style={{ backgroundColor: COLORS.hairline }}
          />
          <p
            className="mt-8 text-xl sm:text-2xl"
            style={{ color: COLORS.textMuted }}
          >
            심사 결과를 발표합니다
          </p>
        </div>
      );

    case "TRACK_INTRO":
      return (
        <div className="text-center">
          <p
            className="text-lg tracking-[0.3em] sm:text-xl"
            style={{ color: COLORS.textFaint }}
          >
            부문 시상
          </p>
          <h2
            className="mt-5 text-5xl font-bold sm:text-7xl lg:text-8xl"
            style={{ color: TRACK_COLOR[slide.track] }}
          >
            {TRACK_LABELS[slide.track]}
          </h2>
        </div>
      );

    case "AWARD": {
      const { result } = slide;
      const accent = TRACK_COLOR[result.track];
      return (
        <div className="w-full max-w-5xl text-center">
          <div
            className="mb-8 inline-flex items-center gap-3 rounded-full px-6 py-2 text-lg font-semibold sm:text-2xl"
            style={{
              color: accent,
              border: `1px solid ${accent}`,
              backgroundColor: "rgba(255,255,255,0.04)",
            }}
          >
            <span>{TRACK_LABELS[result.track]}</span>
            <span style={{ color: COLORS.textFaint }}>·</span>
            <span>{rankLabel(result)}</span>
          </div>
          <h2 className="break-keep text-5xl font-bold leading-tight sm:text-7xl lg:text-8xl">
            {result.teamName}
          </h2>
          {result.members.length > 0 && (
            <p
              className="mt-8 break-keep text-lg sm:text-2xl"
              style={{ color: COLORS.textMuted }}
            >
              {result.members.join("  ·  ")}
            </p>
          )}
        </div>
      );
    }

    case "FINALE": {
      const tracks = TRACK_ORDER.filter((track) =>
        slide.results.some((r) => r.track === track),
      );
      return (
        <div className="w-full max-w-6xl">
          <h2 className="mb-12 text-center text-4xl font-bold sm:text-6xl">
            수상을 축하합니다
          </h2>
          <div
            className={`grid gap-10 md:gap-16 ${tracks.length > 1 ? "md:grid-cols-2" : "mx-auto max-w-2xl"}`}
          >
            {tracks.map((track) => {
              const accent = TRACK_COLOR[track];
              const rows = slide.results.filter((r) => r.track === track);
              return (
                <div key={track}>
                  <h3
                    className="mb-6 text-center text-2xl font-bold sm:text-3xl"
                    style={{ color: accent }}
                  >
                    {TRACK_LABELS[track]}
                  </h3>
                  <ul className="space-y-3.5">
                    {rows.map((result) => (
                      <li
                        key={result.id}
                        className="flex items-baseline justify-between gap-4 pb-2.5"
                        style={{ borderBottom: `1px solid ${COLORS.hairline}` }}
                      >
                        <span
                          className="shrink-0 text-base font-semibold sm:text-xl"
                          style={{ color: accent }}
                        >
                          {rankLabel(result)}
                        </span>
                        <span className="break-keep text-right text-lg font-semibold sm:text-2xl">
                          {result.teamName}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}
