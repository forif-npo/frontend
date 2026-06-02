"use client";

import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import type { ArchiveSubmissionDetail } from "@core/types/hackathon";
import { useEffect, useState } from "react";

/**
 * 아카이브 제출물 상세를 가져옵니다.
 * GET /api/v1/archive/submissions/{submissionId} (단건 조회 - data: T)
 */
export const useArchiveSubmissionDetail = (submissionId: number | null) => {
  const [submission, setSubmission] = useState<ArchiveSubmissionDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!submissionId) {
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    apiClient
      .get(`api/v1/archive/submissions/${submissionId}`)
      .json<ApiResponse<ArchiveSubmissionDetail>>()
      .then((res) => {
        if (!mounted) return;
        setSubmission(res.data);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(
          e instanceof Error ? e.message : "제출물 정보를 불러오지 못했습니다.",
        );
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [submissionId]);

  return { submission, loading, error };
};
