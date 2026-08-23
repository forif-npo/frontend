"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { appendSortingParams, parseSortingParams } from "@/lib/list-sorting";

interface UseListViewFiltersOptions {
  route: string;
  currentSemester: string;
  initialSearch?: string;
  initialSorting?: SortingState;
}

export function useListViewFilters({
  route,
  currentSemester,
  initialSearch = "",
  initialSorting = [],
}: UseListViewFiltersOptions) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sorting, setSorting] = useState<SortingState>(() =>
    initialSorting.slice(0, 1),
  );
  const initialSortingKey = useMemo(
    () => initialSorting.map(({ id, desc }) => `${id}:${desc}`).join(","),
    [initialSorting],
  );

  // 서버 정렬 결과가 새 URL의 search params를 기준으로 다시 렌더링되면
  // 그 값을 반영한다. 그 전까지는 로컬 상태를 사용해 연속 클릭도 잃지 않는다.
  useEffect(() => {
    setSorting(
      parseSortingParams(
        initialSortingKey === "" ? [] : initialSortingKey.split(","),
      ),
    );
  }, [initialSortingKey]);

  const buildParams = (overrides: {
    semester?: string;
    search?: string;
    page?: number;
    sorting?: SortingState;
  }) => {
    const params = new URLSearchParams();
    const semester = overrides.semester ?? currentSemester;
    const search = overrides.search ?? searchQuery.trim();

    if (semester) params.set("semester", semester);
    if (search) params.set("search", search);
    appendSortingParams(params, overrides.sorting ?? sorting);
    params.set("page", String(overrides.page ?? 0));

    return params;
  };

  const handleSemesterChange = (semester: string) => {
    setSorting([]);
    router.push(
      `${route}?${buildParams({ semester, sorting: [], page: 0 }).toString()}`,
    );
  };

  const handleSearch = () => {
    router.push(`${route}?${buildParams({ page: 0 }).toString()}`);
  };

  const handlePageChange = (page: number) => {
    router.push(`${route}?${buildParams({ page }).toString()}`);
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const nextSorting =
      typeof updater === "function" ? updater(sorting) : updater;
    const singleSorting = nextSorting.slice(0, 1);
    setSorting(singleSorting);
    router.push(
      `${route}?${buildParams({ sorting: singleSorting, page: 0 }).toString()}`,
    );
  };

  return {
    searchQuery,
    setSearchQuery,
    sorting,
    handleSemesterChange,
    handleSearch,
    handlePageChange,
    handleSortingChange,
  };
}
