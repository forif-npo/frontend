import { Study, StudyListParams } from "@/types/study";
import type { ApiResponse } from "@core/types/api";
import { apiClient } from "@core/utils/api-client";
import { useCallback, useState } from "react";

interface UseStudyDataReturn {
  studies: Study[];
  loading: boolean;
  error: string | null;
  refetch: (params?: StudyListParams) => Promise<void>;
}

export const useStudyData = (params?: StudyListParams): UseStudyDataReturn => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudies = useCallback(async (fetchParams?: StudyListParams) => {
    setError(null);
    setLoading(true);
    try {
      const searchParams = new URLSearchParams();

      if (fetchParams) {
        if (fetchParams.page !== undefined)
          searchParams.append("page", fetchParams.page.toString());
        if (fetchParams.page_size !== undefined)
          searchParams.append("page_size", fetchParams.page_size.toString());
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
      }

      const studies = await apiClient
        .get("api/v1/studies", { searchParams })
        .json<ApiResponse<Study[]>>();

      console.log("API Response:", studies);

      setStudies(studies.data || []);
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
    refetch: fetchStudies,
  };
};
