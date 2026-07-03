"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface UseListViewFiltersOptions {
  route: string;
  currentSemester: string;
  initialSearch?: string;
}

export function useListViewFilters({
  route,
  currentSemester,
  initialSearch = "",
}: UseListViewFiltersOptions) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const buildParams = (overrides: {
    semester?: string;
    search?: string;
    page?: number;
  }) => {
    const params = new URLSearchParams();
    const semester = overrides.semester ?? currentSemester;
    const search = overrides.search ?? searchQuery.trim();

    if (semester) params.set("semester", semester);
    if (search) params.set("search", search);
    params.set("page", String(overrides.page ?? 0));

    return params;
  };

  const handleSemesterChange = (semester: string) => {
    router.push(`${route}?${buildParams({ semester, page: 0 }).toString()}`);
  };

  const handleSearch = () => {
    router.push(`${route}?${buildParams({ page: 0 }).toString()}`);
  };

  const handlePageChange = (page: number) => {
    router.push(`${route}?${buildParams({ page }).toString()}`);
  };

  return {
    searchQuery,
    setSearchQuery,
    handleSemesterChange,
    handleSearch,
    handlePageChange,
  };
}
