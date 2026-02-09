import { useState, useEffect } from "react";
import { Study } from "@/types/study";
import { kvInstance } from "@/api/client";

type UseStudyDetailReturn = {
  study: Study | null;
  isLoading: boolean;
  error: Error | null;
};

export function useStudyDetail(studyId: string): UseStudyDetailReturn {
  const [study, setStudy] = useState<Study | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStudy = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await kvInstance
          .get(`api/v2/studies/${studyId}`)
          .json<{ success: boolean; data: Study; error: string | null }>();

        if (response.success && response.data) {
          setStudy(response.data);
        } else {
          throw new Error(
            response.error || "스터디 정보를 불러올 수 없습니다.",
          );
        }
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to fetch study");
        setError(error);
        console.error("Failed to fetch study:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (studyId) {
      fetchStudy();
    }
  }, [studyId]);

  return {
    study,
    isLoading,
    error,
  };
}
