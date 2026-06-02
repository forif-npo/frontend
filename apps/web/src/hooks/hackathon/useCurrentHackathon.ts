import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import type { Hackathon } from "@core/types/hackathon";
import { useCallback, useEffect, useState } from "react";

/**
 * 현재 활성 해커톤을 가져옵니다.
 * 목록에서 ENDED가 아닌 첫 번째 해커톤을 선택합니다.
 */
export const useCurrentHackathon = () => {
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient
        .get("api/v1/hackathons")
        .json<ApiResponse<Hackathon[]>>();
      const list = res.data ?? [];
      const active = list.find((h) => h.status !== "ENDED") ?? list[0] ?? null;
      setHackathon(active);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "해커톤 목록을 불러오지 못했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { hackathon, loading, error, refetch: fetch };
};
