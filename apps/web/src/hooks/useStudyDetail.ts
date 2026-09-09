import { useState, useEffect } from "react";
import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import type { Study } from "@core/types/study";

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
    let isCurrentRequest = true;

    const fetchStudy = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient
          .get(`api/v1/studies/${studyId}`)
          .json<ApiResponse<Study>>();

        if (response.data) {
          if (isCurrentRequest) {
            setStudy(response.data);
          }
        } else {
          throw new Error("스터디 정보를 불러올 수 없습니다.");
        }
      } catch (err) {
        if (!isCurrentRequest) return;

        const error =
          err instanceof Error ? err : new Error("Failed to fetch study");
        setError(error);
        console.error("Failed to fetch study:", error);
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    };

    if (studyId) {
      fetchStudy();
    }

    return () => {
      isCurrentRequest = false;
    };
  }, [studyId]);

  return {
    study,
    isLoading,
    error,
  };
}
