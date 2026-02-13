import { useState, useEffect, useCallback } from "react";
import { Study, StudyListParams } from "@/types/study";
import { studyApi } from "@/api";

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
      const data = await studyApi.getStudies(fetchParams);
      setStudies(data);
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
