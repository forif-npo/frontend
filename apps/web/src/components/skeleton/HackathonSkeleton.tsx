import { Bone } from "./Bone";

/**
 * 해커톤 메인 페이지 스켈레톤
 */
export function HackathonPageSkeleton() {
  return (
    <div>
      {/* Timer hero skeleton */}
      <div className="bg-surface-gray-subtler flex min-h-[calc(var(--vh)-80px)] items-center justify-center px-6 py-20">
        <div className="flex w-full max-w-3xl flex-col items-center gap-6">
          <Bone className="h-7 w-20 rounded-full" />
          <Bone className="h-8 w-64" />
          <Bone className="h-4 w-32" />
          <div className="my-4 flex gap-4">
            <Bone className="rounded-3 h-[104px] w-[88px]" />
            <Bone className="rounded-3 h-[104px] w-[88px]" />
            <Bone className="rounded-3 h-[104px] w-[88px]" />
            <Bone className="rounded-3 h-[104px] w-[88px]" />
          </div>
          <Bone className="h-4 w-40" />
        </div>
      </div>
    </div>
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
