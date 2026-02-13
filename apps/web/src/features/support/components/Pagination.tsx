"use client";

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const safePage = clamp(page, 1, totalPages);

  const go = (p: number) => onChange(clamp(p, 1, totalPages));

  const windowSize = 8; // 화면 이미지가 1~8까지 보여서 8로
  const half = Math.floor(windowSize / 2);

  let start = Math.max(1, safePage - half);
  const end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const showLeftEllipsis = start > 2;
  const showRightEllipsis = end < totalPages - 1;

  return (
    <div className="flex items-center justify-center gap-2 text-sm">
      <button
        type="button"
        onClick={() => go(safePage - 1)}
        disabled={safePage <= 1}
        className="rounded px-2 py-1 disabled:opacity-40"
      >
        이전
      </button>

      {start > 1 && (
        <button type="button" onClick={() => go(1)} className="h-8 w-8 rounded">
          1
        </button>
      )}

      {showLeftEllipsis && <span className="px-1">…</span>}

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => go(p)}
          className={`h-8 w-8 rounded ${
            p === safePage ? "bg-gray-900 text-white" : "bg-transparent"
          }`}
        >
          {p}
        </button>
      ))}

      {showRightEllipsis && <span className="px-1">…</span>}

      {end < totalPages && (
        <button
          type="button"
          onClick={() => go(totalPages)}
          className="h-8 w-8 rounded"
        >
          {totalPages}
        </button>
      )}

      <button
        type="button"
        onClick={() => go(safePage + 1)}
        disabled={safePage >= totalPages}
        className="rounded px-2 py-1 disabled:opacity-40"
      >
        다음
      </button>
    </div>
  );
}
