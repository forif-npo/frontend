import { useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { StudyFilters, RecruitStatus } from "@/types/study";

interface UseStudyFiltersReturn {
  filters: StudyFilters;
  updateFilter: <K extends keyof StudyFilters>(
    key: K,
    value: StudyFilters[K],
  ) => void;
  updateMultipleFilters: (updates: Partial<StudyFilters>) => void;
  clearAllFilters: () => void;
}

export const useStudyFilters = (): UseStudyFiltersReturn => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse filters from URL query parameters
  const filters: StudyFilters = useMemo(() => {
    const parseParam = (key: string): string | undefined => {
      const value = searchParams.get(key);
      return value || undefined;
    };

    const parseNumberParam = (key: string): number | undefined => {
      const value = searchParams.get(key);
      return value ? parseInt(value, 10) : undefined;
    };

    return {
      year: parseNumberParam("year"),
      semester: parseNumberParam("semester"),
      difficulty: parseParam("difficulty"),
      tag: parseParam("tag"),
      recruitStatus: parseParam("recruitStatus") as RecruitStatus | undefined,
      search: parseParam("search"),
    };
  }, [searchParams]);

  // Build new URL with updated query parameters
  const buildUrl = useCallback(
    (params: URLSearchParams): string => {
      const queryString = params.toString();
      return queryString ? `${pathname}?${queryString}` : pathname;
    },
    [pathname],
  );

  // Navigate to new URL without scrolling
  const navigateToUrl = useCallback(
    (url: string) => {
      router.push(url, { scroll: false });
    },
    [router],
  );

  // Update multiple filters atomically
  const updateMultipleFilters = useCallback(
    (updates: Partial<StudyFilters>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });

      navigateToUrl(buildUrl(params));
    },
    [searchParams, buildUrl, navigateToUrl],
  );

  // Update single filter
  const updateFilter = useCallback(
    <K extends keyof StudyFilters>(key: K, value: StudyFilters[K]) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      } else {
        params.delete(key);
        // Special case: clear both year and semester together
        if (key === "year" || key === "semester") {
          params.delete("year");
          params.delete("semester");
        }
      }

      navigateToUrl(buildUrl(params));
    },
    [searchParams, buildUrl, navigateToUrl],
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    navigateToUrl(pathname);
  }, [pathname, navigateToUrl]);

  return {
    filters,
    updateFilter,
    updateMultipleFilters,
    clearAllFilters,
  };
};
