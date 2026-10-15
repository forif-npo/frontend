import type { ApiResponse, CursorPageResponse } from "@core/types/api";
import type {
  AdminHallOfFameEntry,
  HallOfFameEntryCreateRequest,
  HallOfFameEntryUpdateRequest,
  HallOfFameMemberCandidate,
} from "@core/types/hall-of-fame";
import { apiClient } from "@core/utils/api-client";

export async function getHallOfFameEntries(): Promise<AdminHallOfFameEntry[]> {
  const response = await apiClient
    .get("api/v1/admin/hall-of-fame", {
      searchParams: { page: 0, size: 100 },
      cache: "no-store",
    })
    .json<ApiResponse<CursorPageResponse<AdminHallOfFameEntry>>>();
  return response.data?.content ?? [];
}

export async function createHallOfFameEntry(
  body: HallOfFameEntryCreateRequest,
): Promise<AdminHallOfFameEntry> {
  const response = await apiClient
    .post("api/v1/admin/hall-of-fame", { json: body })
    .json<ApiResponse<AdminHallOfFameEntry>>();
  if (!response.data) throw new Error(response.message);
  return response.data;
}

export async function updateHallOfFameEntry(
  entryId: number,
  body: HallOfFameEntryUpdateRequest,
): Promise<AdminHallOfFameEntry> {
  const response = await apiClient
    .patch(`api/v1/admin/hall-of-fame/${entryId}`, { json: body })
    .json<ApiResponse<AdminHallOfFameEntry>>();
  if (!response.data) throw new Error(response.message);
  return response.data;
}

export async function changeHallOfFamePublication(
  entryId: number,
  action: "publish" | "unpublish",
  version: number,
): Promise<AdminHallOfFameEntry> {
  const response = await apiClient
    .post(`api/v1/admin/hall-of-fame/${entryId}/${action}`, {
      json: { version },
    })
    .json<ApiResponse<AdminHallOfFameEntry>>();
  if (!response.data) throw new Error(response.message);
  return response.data;
}

export async function uploadHallOfFameImage(
  entryId: number,
  file: File,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient
    .post(`api/v1/admin/hall-of-fame/${entryId}/image`, { body: formData })
    .json<ApiResponse<{ image_url: string }>>();
  if (!response.data?.image_url) throw new Error(response.message);
  return response.data.image_url;
}

interface MemberPageItem {
  user_id?: number;
  userId?: number;
  user_name?: string;
  userName?: string;
  department?: string | null;
}

export async function searchHallOfFameMembers(
  search: string,
): Promise<HallOfFameMemberCandidate[]> {
  const response = await apiClient
    .get("api/v1/admin/users", {
      searchParams: { page: 0, size: 10, search: search.trim() },
      cache: "no-store",
    })
    .json<ApiResponse<CursorPageResponse<MemberPageItem>>>();
  return (response.data?.content ?? [])
    .map((member) => ({
      user_id: member.user_id ?? member.userId ?? 0,
      user_name: member.user_name ?? member.userName ?? "",
      department: member.department ?? null,
    }))
    .filter((member) => member.user_id > 0 && member.user_name);
}
