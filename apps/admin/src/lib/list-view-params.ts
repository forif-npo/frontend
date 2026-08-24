import type { SortingState } from "@tanstack/react-table";

import { appendSortingParams } from "./list-sorting";

export interface BuildListViewParamsOptions {
  currentSemester: string;
  searchQuery: string;
  sorting: SortingState;
  preservedParams?: Record<string, string | undefined>;
  overrides: {
    semester?: string;
    search?: string;
    page?: number;
    sorting?: SortingState;
  };
}

export function buildListViewParams({
  currentSemester,
  searchQuery,
  sorting,
  preservedParams = {},
  overrides,
}: BuildListViewParamsOptions) {
  const params = new URLSearchParams();

  Object.entries(preservedParams).forEach(([key, value]) => {
    if (value !== undefined) params.set(key, value);
  });

  const semester = overrides.semester ?? currentSemester;
  const search = overrides.search ?? searchQuery.trim();

  if (semester) params.set("semester", semester);
  if (search) params.set("search", search);
  appendSortingParams(params, overrides.sorting ?? sorting);
  params.set("page", String(overrides.page ?? 0));

  return params;
}
