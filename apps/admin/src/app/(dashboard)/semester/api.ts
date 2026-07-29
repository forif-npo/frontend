import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";

export interface AdminCandidate {
  user_id: number;
  name: string;
  department: string;
  phone_num: string;
  affiliation: string;
}

interface CursorPage<T> {
  content: T[];
  next_cursor: number | null;
  has_next: boolean;
  total_elements: number;
}

/**
 * 차기 회장 후보 = 운영진(ADMIN) 계정 전체.
 * 회장 인수인계 대상은 이미 계정이 있는 사람만 가능하므로 이 목록에서 고른다.
 */
export async function getAdminCandidates(): Promise<AdminCandidate[]> {
  const response = await apiClient
    .get("api/v1/president/admins", { searchParams: { size: 100 } })
    .json<ApiResponse<CursorPage<AdminCandidate>>>();
  return response.data?.content ?? [];
}
