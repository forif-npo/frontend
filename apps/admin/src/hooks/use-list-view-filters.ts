"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { parseSortingParams } from "@/lib/list-sorting";
import {
  buildListViewParams,
  type BuildListViewParamsOptions,
} from "@/lib/list-view-params";

interface UseListViewFiltersOptions {
  route: string;
  currentSemester: string;
  initialSearch?: string;
  initialSorting?: SortingState;
  /** 목록 이동 중에도 유지해야 하는 화면별 쿼리 파라미터 */
  preservedParams?: Record<string, string | undefined>;
}

export function useListViewFilters({
  route,
  currentSemester,
  initialSearch = "",
  initialSorting = [],
  preservedParams,
}: UseListViewFiltersOptions) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
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

  const buildParams = (overrides: BuildListViewParamsOptions["overrides"]) =>
    buildListViewParams({
      currentSemester,
      searchQuery,
      sorting,
      preservedParams,
      overrides,
    });

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
    setSorting(nextSorting);
    router.push(
      `${route}?${buildParams({ sorting: nextSorting, page: 0 }).toString()}`,
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
