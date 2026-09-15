"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface UseStudySearchInputOptions {
  /** URL에 반영돼 있는 검색어 */
  urlSearch: string | undefined;
  /** 검색어를 URL에 반영한다. 빈 검색어는 undefined로 넘긴다. */
  onApply: (search: string | undefined) => void;
  delay?: number;
}

/**
 * 스터디 목록 검색 입력칸과 URL의 search 파라미터를 양방향으로 맞춘다.
 *
 * 마지막으로 URL과 맞춘 값을 기억해 두고 그와 다른 변화만 반대편에 반영한다.
 * 그래야 메뉴 재진입·뒤로가기처럼 URL이 외부에서 바뀌었을 때
 * 이전 입력값이 URL에 다시 써지지 않는다.
 */
export function useStudySearchInput({
  urlSearch,
  onApply,
  delay = 500,
}: UseStudySearchInputOptions) {
  const [searchInput, setSearchInput] = useState(urlSearch ?? "");
  const debouncedSearch = useDebounce(searchInput, delay);
  const syncedSearchRef = useRef(urlSearch ?? "");

  // onApply가 렌더마다 바뀌어도 디바운스 이펙트가 다시 돌지 않도록 ref로 들고 있는다.
  const onApplyRef = useRef(onApply);
  useEffect(() => {
    onApplyRef.current = onApply;
  }, [onApply]);

  const apply = useCallback((search: string) => {
    if (search === syncedSearchRef.current) return;
    syncedSearchRef.current = search;
    onApplyRef.current(search || undefined);
  }, []);

  useEffect(() => {
    const nextSearch = urlSearch ?? "";
    if (nextSearch === syncedSearchRef.current) return;
    syncedSearchRef.current = nextSearch;
    setSearchInput(nextSearch);
  }, [urlSearch]);

  useEffect(() => {
    apply(debouncedSearch);
  }, [apply, debouncedSearch]);

  const submitSearch = useCallback(() => {
    apply(searchInput);
  }, [apply, searchInput]);

  return { searchInput, setSearchInput, submitSearch };
}
