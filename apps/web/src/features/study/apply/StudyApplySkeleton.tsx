export function StudyApplySkeleton() {
  return (
    <div className="mx-auto mb-16 flex max-w-[1200px] flex-col">
      {/* Title Section Skeleton */}
      <div className="mb-12 flex flex-col gap-6">
        <div className="h-[120px] w-full animate-pulse rounded-lg bg-gray-200" />
        <div className="flex gap-1">
          <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      {/* Getting Started Guide Skeleton */}
      <div className="mb-10 flex flex-col gap-6 rounded-[12px] border border-gray-200 bg-gray-200 p-10">
        <div className="flex flex-col gap-6 border-b border-dashed border-gray-300 pb-6">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      {/* Basic Info Form Skeleton */}
      <div className="mb-10 flex flex-col gap-6 rounded-[12px] border border-gray-200 bg-white p-10">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="flex flex-col gap-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-6">
              <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
              <div className="h-14 w-full animate-pulse rounded-lg bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Buttons Skeleton */}
      <div className="flex gap-4">
        <div className="flex flex-1 gap-4">
          <div className="h-14 w-[90px] animate-pulse rounded-lg bg-gray-200" />
          <div className="h-14 w-[90px] animate-pulse rounded-lg bg-gray-200" />
        </div>
        <div className="h-14 w-[90px] animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}
