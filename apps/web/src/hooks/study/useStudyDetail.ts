import { useState, useEffect } from "react";
import { Study } from "@/types/study";
import { studyApi } from "@/api";

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
      const data = await studyApi.getStudyDetail(studyId);
      setStudy(data);
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
