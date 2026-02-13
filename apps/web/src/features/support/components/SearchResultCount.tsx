"use client";

type SearchResultCountProps = {
  count: number;
};

export function SearchResultCount({ count }: SearchResultCountProps) {
  return <div className="mt-5 text-sm text-gray-600">검색 결과 {count}개</div>;
}
