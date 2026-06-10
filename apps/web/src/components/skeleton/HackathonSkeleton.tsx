import { Bone } from "./Bone";

/**
 * 해커톤 메인 페이지 스켈레톤
 */
export function HackathonPageSkeleton() {
  return (
    <div>
      {/* Timer hero skeleton - TimerHero 레이아웃과 동일하게 정렬 */}
      <div className="bg-surface-gray-subtler flex min-h-[calc(var(--vh)-80px)] items-center justify-center px-6 py-20">
        <div className="flex w-full max-w-5xl flex-col items-center gap-8">
          {/* Badge */}
          <Bone className="h-7 w-20 rounded-full" />
          {/* Title */}
          <Bone className="h-9 w-72 sm:h-12 sm:w-96" />
          {/* Countdown blocks */}
          <div className="flex items-start justify-center gap-4 sm:gap-8 lg:gap-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Bone className="h-24 w-20 sm:h-40 sm:w-32 lg:h-52 lg:w-44" />
                <Bone className="h-3 w-10 sm:h-4 sm:w-12" />
              </div>
            ))}
          </div>
          {/* Date */}
          <Bone className="h-4 w-40" />
          {/* Scroll hint */}
          <Bone className="mt-8 h-9 w-16" />
        </div>
      </div>
    </div>
  );
}

/**
 * 해커톤 상세 페이지 스켈레톤 (타이머 히어로 없음)
 */
export function HackathonDetailSkeleton() {
  return (
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      {/* 헤더: 브레드크럼 + 제목 + 상태 */}
      <div className="mb-6 flex flex-col gap-3">
        <Bone className="h-4 w-48" />
        <div className="flex flex-wrap items-center gap-3">
          <Bone className="h-8 w-64" />
          <Bone className="h-6 w-16 rounded-full" />
        </div>
      </div>

      {/* EventFacts */}
      <div className="bg-surface-white border-border-gray-light rounded-3 mb-6 grid grid-cols-2 gap-3 border p-4 shadow-sm sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface-gray-subtler border-border-gray-light rounded-2 flex flex-col gap-1.5 border p-4"
          >
            <Bone className="h-3 w-10" />
            <Bone className="h-5 w-24" />
          </div>
        ))}
      </div>

      {/* 본문 */}
      <div className="rounded-3 border-border-gray-light bg-surface-white border p-8">
        <Bone className="mb-4 h-7 w-48" />
        <Bone className="mb-2 h-4 w-full" />
        <Bone className="mb-2 h-4 w-full" />
        <Bone className="h-4 w-2/3" />
      </div>
    </main>
  );
}

/**
 * 해커톤 아카이브 스켈레톤
 */
export function HackathonArchiveSkeleton() {
  return (
    <div className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      {/* Header */}
      <div className="rounded-3 border-border-gray-light bg-surface-white mb-8 border p-8">
        <Bone className="mb-3 h-4 w-16" />
        <Bone className="mb-3 h-9 w-56" />
        <Bone className="h-4 w-80" />
      </div>

      {/* Filter */}
      <div className="rounded-3 border-border-gray-light bg-surface-white mb-6 flex gap-4 border p-5">
        <Bone className="rounded-2 h-12 flex-1" />
        <Bone className="rounded-2 h-12 w-44" />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3 border-border-gray-light bg-surface-white border p-6"
          >
            <div className="mb-3 flex justify-between">
              <Bone className="h-4 w-20" />
              <Bone className="h-5 w-12 rounded-full" />
            </div>
            <Bone className="mb-2 h-5 w-3/4" />
            <Bone className="mb-1 h-4 w-full" />
            <Bone className="mb-4 h-4 w-2/3" />
            <div className="mb-4 flex gap-1.5">
              <Bone className="h-6 w-16 rounded-full" />
              <Bone className="h-6 w-20 rounded-full" />
            </div>
            <div className="border-divider-gray-light flex gap-2 border-t pt-3">
              <Bone className="rounded-2 h-8 w-16" />
              <Bone className="rounded-2 h-8 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 해커톤 제출물 상세 스켈레톤
 */
export function HackathonSubmissionDetailSkeleton() {
  return (
    <div className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      <Bone className="mb-6 h-4 w-72" />

      {/* Hero */}
      <div className="rounded-3 border-border-gray-light bg-surface-white mb-8 border p-8">
        <div className="mb-4 flex items-center gap-2">
          <Bone className="h-5 w-20 rounded-full" />
          <Bone className="h-5 w-16 rounded-full" />
        </div>
        <Bone className="mb-3 h-9 w-2/3" />
        <Bone className="mb-2 h-4 w-full" />
        <Bone className="h-4 w-1/2" />
        <div className="mt-6 flex gap-2">
          <Bone className="rounded-2 h-10 w-28" />
          <Bone className="rounded-2 h-10 w-24" />
        </div>
      </div>

      {/* Image */}
      <Bone className="rounded-3 mb-8 h-[360px] w-full" />

      {/* Body */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_300px]">
        <div className="space-y-3">
          <Bone className="h-6 w-32" />
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-3/4" />
        </div>
        <div className="space-y-3">
          <Bone className="h-6 w-24" />
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
