export default function HallOfFameLoading() {
  return (
    <main
      className="max-w-main mx-auto w-full animate-pulse px-4 py-10 lg:px-0"
      aria-label="명예의 전당을 불러오는 중"
      aria-busy="true"
    >
      <div className="bg-surface-gray-subtler mb-3 h-4 w-32 rounded" />
      <div className="bg-surface-gray-subtler h-11 w-52 rounded" />
      <div className="bg-surface-gray-subtler mt-3 h-5 w-full max-w-xl rounded" />
      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="border-border-gray overflow-hidden rounded-2xl border bg-white"
          >
            <div className="bg-surface-gray-subtler aspect-[4/3]" />
            <div className="space-y-3 p-5">
              <div className="bg-surface-gray-subtler h-4 w-20 rounded" />
              <div className="bg-surface-gray-subtler h-7 w-32 rounded" />
              <div className="bg-surface-gray-subtler h-4 w-full rounded" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
