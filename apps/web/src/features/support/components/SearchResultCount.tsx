"use client";

type SearchResultCountProps = {
  count: number;
};

export function SearchResultCount({ count }: SearchResultCountProps) {
  return (
    <div className="mt-6 text-sm font-semibold">
      검색 결과 <span className="text-text-primary">{count}</span>개
    </div>
  );
}
