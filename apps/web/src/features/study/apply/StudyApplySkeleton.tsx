function Bone({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />;
}

export function StudyApplySkeleton() {
  return (
    <div className="flex justify-center px-4 sm:px-6">
      <div className="mb-16 flex w-full max-w-[792px] flex-col">
        <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:gap-6">
          <div className="flex flex-col gap-2">
            <Bone className="h-9 w-3/4 sm:h-12" />
            <Bone className="h-9 w-40 sm:h-12" />
          </div>
          <div className="flex gap-1">
            <Bone className="h-7 w-16 rounded-full" />
            <Bone className="h-7 w-20 rounded-full" />
            <Bone className="h-7 w-24 rounded-full" />
          </div>
        </div>

        <div className="flex flex-col gap-6 sm:gap-10">
          <div className="flex flex-col gap-6 rounded-[12px] border border-[#d6e0eb] bg-[#eef2f7] p-5 sm:p-10">
            <div className="flex flex-col gap-6 border-b border-dashed border-[#b1b8be] pb-6">
              <Bone className="h-8 w-40" />
              <div className="space-y-2">
                <Bone className="h-5 w-full" />
                <Bone className="h-5 w-3/4" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Bone className="h-6 w-28" />
              <Bone className="h-6 w-24" />
            </div>
          </div>

          <div className="flex flex-col gap-6 rounded-[12px] border border-[#b1b8be] bg-white p-5 sm:p-10">
            <Bone className="h-8 w-72" />
            <div className="flex flex-col gap-10">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col gap-6">
                  <Bone className="h-6 w-20" />
                  <Bone className="h-14 w-full rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="flex flex-1 gap-3 sm:gap-4">
              <Bone className="h-14 min-w-0 flex-1 rounded-lg sm:min-w-[90px] sm:flex-none" />
              <Bone className="h-14 min-w-0 flex-1 rounded-lg sm:min-w-[90px] sm:flex-none" />
            </div>
            <Bone className="h-14 w-full rounded-lg sm:w-auto sm:min-w-[90px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
