function Bone({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />;
}

function OverviewTableSkeleton() {
  const rows = [
    { labelWidth: "w-10", valueWidth: "w-48" },
    { labelWidth: "w-10", valueWidth: "w-56" },
    { labelWidth: "w-8", valueWidth: "w-32" },
    { labelWidth: "w-14", valueWidth: "w-40" },
    { labelWidth: "w-12", valueWidth: "w-44" },
    { labelWidth: "w-8", valueWidth: "w-36" },
    { labelWidth: "w-8", valueWidth: "w-24" },
    { labelWidth: "w-16", valueWidth: "w-28" },
  ];

  return (
    <div className="flex flex-col">
      <Bone className="mb-4 h-7 w-28 md:mb-6" />
      <div className="divide-y divide-[#e5e8eb]">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center py-3 md:py-4">
            <Bone className={`mr-3 h-5 shrink-0 md:mr-4 ${row.labelWidth}`} />
            <Bone className={`h-5 ${row.valueWidth}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function IntroSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Bone className="h-7 w-36" />
      <div className="flex flex-col gap-4 rounded-[12px] bg-[#f4f5f6] p-4 md:gap-6 md:p-8">
        <div className="space-y-2">
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-3/4" />
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-2/3" />
        </div>
        <div className="h-px w-full bg-[#cdd1d5]" />
        <Bone className="mx-auto h-5 w-40" />
      </div>
    </div>
  );
}

function CurriculumSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Bone className="h-7 w-24" />
      <div className="overflow-hidden rounded-[8px] border border-[#e5e8eb]">
        <div className="flex bg-[#eef2f7]">
          <div className="w-[80px] shrink-0 px-3 py-2 md:w-[120px] md:px-4">
            <Bone className="h-4 w-8" />
          </div>
          <div className="w-[200px] shrink-0 px-3 py-2 md:w-[320px] md:px-4">
            <Bone className="h-4 w-12" />
          </div>
          <div className="flex-1 px-3 py-2 md:px-4">
            <Bone className="h-4 w-12" />
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex border-t border-[#e5e8eb]">
            <div className="w-[80px] shrink-0 px-3 py-2 md:w-[120px] md:px-4 md:py-3">
              {i % 2 === 0 && <Bone className="h-4 w-6" />}
            </div>
            <div className="w-[200px] shrink-0 px-3 py-2 md:w-[320px] md:px-4 md:py-3">
              {i % 2 === 0 && <Bone className="h-4 w-3/4" />}
            </div>
            <div className="flex-1 px-3 py-2 md:px-4 md:py-3">
              <Bone className="h-4 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProcessSkeleton() {
  return (
    <div className="flex flex-col gap-6 md:gap-10">
      <Bone className="h-8 w-48 md:w-64" />
      <div className="flex flex-col gap-10 md:gap-16">
        <div className="flex flex-col gap-4">
          <Bone className="h-6 w-20" />
          <Bone className="h-5 w-56" />
        </div>
        <div className="flex flex-col gap-4">
          <Bone className="h-6 w-32" />
          <div className="rounded-[12px] border border-[#b1b8be] bg-white p-4 md:p-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex gap-4 py-3">
                <Bone className="h-6 w-6 shrink-0 rounded-[4px]" />
                <div className="flex flex-1 flex-col gap-1">
                  <Bone className="h-5 w-48" />
                  <Bone className="h-4 w-64" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NavigationSkeleton() {
  return (
    <div className="sticky top-[120px] hidden h-fit w-[160px] shrink-0 gap-4 md:flex md:flex-col">
      <div className="flex flex-col gap-1">
        <Bone className="h-4 w-16" />
        <Bone className="h-6 w-28" />
      </div>
      <div className="flex flex-col gap-1">
        {[...Array(7)].map((_, i) => (
          <Bone key={i} className="h-8 w-full rounded-[4px]" />
        ))}
      </div>
      <Bone className="h-10 w-full rounded-lg" />
    </div>
  );
}

export function StudyDetailSkeleton() {
  return (
    <div className="px-4 md:px-6">
      <div className="mb-6 flex flex-col gap-2 md:mb-10 md:gap-4">
        <Bone className="h-8 w-3/4 md:h-12" />
        <Bone className="h-5 w-full md:h-6 md:w-2/3" />
      </div>

      <div className="flex gap-10 pb-28 md:pb-20">
        <div className="flex min-w-0 flex-1 flex-col gap-10 md:gap-16">
          <OverviewTableSkeleton />
          <IntroSkeleton />
          <CurriculumSkeleton />
          <ProcessSkeleton />
          <div className="flex flex-col gap-4 md:gap-6">
            <Bone className="h-7 w-24" />
            <Bone className="h-5 w-48" />
            <Bone className="h-[200px] w-full rounded-[8px] md:h-[300px]" />
          </div>
          <div className="flex flex-col gap-6">
            <Bone className="h-7 w-24" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Bone key={i} className="h-12 w-full rounded-[8px]" />
              ))}
            </div>
          </div>
        </div>
        <NavigationSkeleton />
      </div>
    </div>
  );
}
