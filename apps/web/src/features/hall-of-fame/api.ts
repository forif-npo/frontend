import type { ApiResponse, CursorPageResponse } from "@core/types/api";
import type { HallOfFameEntry } from "@core/types/hall-of-fame";
import { apiClient } from "@core/utils/api-client";

const PUBLIC_LIST_SIZE = 100;

export async function getHallOfFameEntries(): Promise<HallOfFameEntry[]> {
  const response = await apiClient
    .get("api/v1/hall-of-fame", {
      searchParams: { page: 0, size: PUBLIC_LIST_SIZE },
      cache: "no-cache",
    })
    .json<ApiResponse<CursorPageResponse<HallOfFameEntry>>>();

  return response.data?.content ?? [];
}

export async function getHallOfFameEntry(
  slug: string,
): Promise<HallOfFameEntry | null> {
  try {
    const response = await apiClient
      .get(`api/v1/hall-of-fame/${encodeURIComponent(slug)}`, {
        cache: "no-cache",
      })
      .json<ApiResponse<HallOfFameEntry>>();

    return response.data;
  } catch {
    return null;
  }
}
