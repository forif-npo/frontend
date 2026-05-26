import type { ApiResponse } from "@core/types/api";
import { apiClient } from "@core/utils/api-client";
import { Study, StudyListParams } from "@/types/study";
import { useCallback, useState } from "react";

interface PaginatedData<T> {
  content: T[];
  next_cursor: number | null;
  has_next: boolean;
  total_elements: number;
}

interface UseStudyDataReturn {
  studies: Study[];
  loading: boolean;
  error: string | null;
  totalElements: number;
  refetch: (params?: StudyListParams) => Promise<void>;
}

export const useStudyData = (
  initialParams?: StudyListParams,
): UseStudyDataReturn => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState(0);

  const fetchStudies = useCallback(async (fetchParams?: StudyListParams) => {
    setError(null);
    setLoading(true);
    try {
      const searchParams = new URLSearchParams();

      const params = { page: 0, size: 12, ...fetchParams };

      searchParams.append("page", params.page.toString());
      searchParams.append("size", params.size.toString());
      if (params.year !== undefined)
        searchParams.append("year", params.year.toString());
      if (params.semester !== undefined)
        searchParams.append("semester", params.semester.toString());
      if (params.difficulties) {
        params.difficulties.forEach((d) =>
          searchParams.append("difficulties", d),
        );
      }
      if (params.tags) {
        params.tags.forEach((t) => searchParams.append("tags", t));
      }
      if (params.recruit_status)
        searchParams.append("recruit_status", params.recruit_status);
      if (params.search) searchParams.append("search", params.search);
      if (params.sort_order)
        searchParams.append("sort_order", params.sort_order);

      const response = await apiClient
        .get("api/v1/studies", { searchParams })
        .json<ApiResponse<PaginatedData<Study>>>();

      const paginated = response.data;
      setStudies(paginated?.content ?? []);
      setTotalElements(paginated?.total_elements ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch studies");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    studies,
    loading,
    error,
    totalElements,
    refetch: fetchStudies,
  };
};
