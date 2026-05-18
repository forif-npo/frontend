import type { ApiResponse } from "@core/types/api";
import { apiClient } from "@core/utils/api-client";
import { Study, StudyListParams } from "@/types/study";
import { useCallback, useState } from "react";

interface PaginatedData<T> {
  content: T[];
  next_cursor: string | null;
  has_next: boolean;
  total_elements: number;
}

interface UseStudyDataReturn {
  studies: Study[];
  loading: boolean;
  error: string | null;
  hasNext: boolean;
  totalElements: number;
  refetch: (params?: StudyListParams) => Promise<void>;
}

export const useStudyData = (
  initialParams?: StudyListParams,
): UseStudyDataReturn => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  const fetchStudies = useCallback(async (fetchParams?: StudyListParams) => {
    setError(null);
    setLoading(true);
    try {
      const searchParams = new URLSearchParams();

      if (fetchParams) {
        if (fetchParams.cursor !== undefined)
          searchParams.append("cursor", fetchParams.cursor.toString());
        if (fetchParams.size !== undefined)
          searchParams.append("size", fetchParams.size.toString());
        if (fetchParams.year !== undefined)
          searchParams.append("year", fetchParams.year.toString());
        if (fetchParams.semester !== undefined)
          searchParams.append("semester", fetchParams.semester.toString());
        if (fetchParams.difficulties) {
          fetchParams.difficulties.forEach((d) =>
            searchParams.append("difficulties", d),
          );
        }
        if (fetchParams.tags) {
          fetchParams.tags.forEach((t) => searchParams.append("tags", t));
        }
        if (fetchParams.recruit_status)
          searchParams.append("recruit_status", fetchParams.recruit_status);
        if (fetchParams.search)
          searchParams.append("search", fetchParams.search);
        if (fetchParams.sort_order)
          searchParams.append("sort_order", fetchParams.sort_order);
      }

      const response = await apiClient
        .get("api/v1/studies", { searchParams })
        .json<ApiResponse<PaginatedData<Study>>>();

      const paginated = response.data;
      setStudies(paginated?.content ?? []);
      setHasNext(paginated?.has_next ?? false);
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
    hasNext,
    totalElements,
    refetch: fetchStudies,
  };
};
