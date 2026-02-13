import { useState, useEffect } from "react";
import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import { Study } from "@/types/study";

interface UseStudyDetailReturn {
  study: Study | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useStudyDetail = (studyId: number): UseStudyDetailReturn => {
  const [study, setStudy] = useState<Study | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudyDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient
        .get(`api/v1/studies/${studyId}`)
        .json<ApiResponse<Study>>();

      if (response.data) {
        setStudy(response.data);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch study detail",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studyId) {
      fetchStudyDetail();
    }
  }, [studyId]);

  return {
    study,
    loading,
    error,
    refetch: fetchStudyDetail,
  };
};
