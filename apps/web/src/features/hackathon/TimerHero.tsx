"use client";

import type { Hackathon } from "@core/types/hackathon";
import { Badge } from "@ui/components/server";
import { CountdownBlocks } from "./CountdownBlocks";
import {
  formatDateTime,
  getCountdownTarget,
  statusLabel,
  type MainStage,
} from "./utils";

interface TimerHeroProps {
  hackathon: Hackathon;
  stage: MainStage;
}

function statusVariant(stage: MainStage) {
  switch (stage) {
    case "RECRUITING":
      return "success" as const;
    case "ACTIVE":
      return "danger" as const;
    case "ENDED":
      return "disabled" as const;
    default:
      return "primary" as const;
  }
}

export function TimerHero({ hackathon, stage }: TimerHeroProps) {
  const target = getCountdownTarget(hackathon, stage);
  const isEnded = stage === "ENDED";

  return (
    <section className="relative flex min-h-[calc(var(--vh)-80px)] items-center justify-center overflow-hidden px-6 py-20">
      {/* Background */}
      <div className="from-primary-5 via-gray-5 to-primary-10 absolute inset-0 bg-gradient-to-br" />
      {/* Decorative blobs */}
      <div className="bg-primary-20 absolute -left-32 top-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl" />
      <div className="bg-primary-30 absolute -right-32 bottom-1/4 h-96 w-96 rounded-full opacity-10 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-8 text-center">
        <Badge
          label={statusLabel[hackathon.status]}
          variant={statusVariant(stage)}
          appearance="solid-pastel"
          size="medium"
        />

        <h1 className="text-heading-m-mobile sm:text-heading-l text-text-basic font-bold">
          {hackathon.title}
        </h1>

        {isEnded ? (
          <p className="text-body-m text-text-subtle font-bold">
            해커톤이 종료되었습니다
          </p>
        ) : (
          <>
            <p className="text-label-xs text-text-subtle font-bold uppercase tracking-[0.15em]">
              {target.label}
            </p>
            <CountdownBlocks
              targetDate={target.date}
              serverTime={hackathon.server_time}
            />
            <p className="text-body-s text-text-subtle">
              {formatDateTime(target.date)}
            </p>
          </>
        )}

        <button
          type="button"
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
          className="text-text-disabled text-label-xs mt-8 flex animate-bounce cursor-pointer flex-col items-center gap-1.5 font-semibold uppercase tracking-widest"
        >
          <span>자세히 보기</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3.5 7l5.5 5.5L14.5 7"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
