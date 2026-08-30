"use client";

type SearchResultCountProps = {
  count: number;
  className?: string;
};

export function SearchResultCount({
  count,
  className = "mt-6",
}: SearchResultCountProps) {
  return (
    <div className={`${className} text-sm font-semibold`}>
      검색 결과 <span className="text-text-primary">{count}</span>개
    </div>
  );
}
