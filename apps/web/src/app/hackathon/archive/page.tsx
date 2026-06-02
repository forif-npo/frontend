"use client";

import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@core/utils/api-client";
import type { ApiResponse, CursorPageResponse } from "@core/types/api";
import type { Hackathon } from "@core/types/hackathon";
import { HackathonArchiveSkeleton } from "@/components/skeleton/HackathonSkeleton";
import { ArchiveMain } from "@/features/hackathon";

export default function HackathonArchivePage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient
        .get("api/v1/archive/hackathons")
        .json<ApiResponse<CursorPageResponse<Hackathon>>>();
      setHackathons(res.data?.content ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  if (loading) {
    return <HackathonArchiveSkeleton />;
  }

  if (hackathons.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-[var(--krds-color-gray-50)]">
          아카이브할 해커톤이 없습니다.
        </p>
      </div>
    );
  }

  return <ArchiveMain hackathons={hackathons} />;
}
