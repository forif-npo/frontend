"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { appendSortingParams } from "@/lib/list-sorting";

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
    appendSortingParams(params, overrides.sorting ?? initialSorting);
    params.set("page", String(overrides.page ?? 0));

    return params;
  };

  const handleSemesterChange = (semester: string) => {
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
    const sorting =
      typeof updater === "function" ? updater(initialSorting) : updater;
    router.push(`${route}?${buildParams({ sorting, page: 0 }).toString()}`);
  };

  return {
    searchQuery,
    setSearchQuery,
    handleSemesterChange,
    handleSearch,
    handlePageChange,
    handleSortingChange,
  };
}
