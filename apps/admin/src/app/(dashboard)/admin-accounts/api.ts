import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";

/**
 * 운영진 계정 (GET /api/v1/president/admins — 회장단 전용)
 */
export interface AdminAccount {
  user_id: number;
  name: string;
  department: string | null;
  phone_num: string | null;
  affiliation: string;
}

export interface AdminAccountsPage {
  content: AdminAccount[];
  total_elements: number;
  total_pages: number | null;
  current_page: number | null;
}

export async function getAdminAccounts(params: {
  page?: number;
  size?: number;
  search?: string;
}): Promise<AdminAccountsPage> {
  const searchParams: Record<string, string | number> = {
    page: params.page ?? 0,
    size: params.size ?? 20,
  };
  if (params.search) {
    searchParams.search = params.search;
  }

  const response = await apiClient
    .get("api/v1/president/admins", { searchParams })
    .json<ApiResponse<AdminAccountsPage>>();

  return (
    response.data ?? {
      content: [],
      total_elements: 0,
      total_pages: 0,
      current_page: 0,
    }
  );
}

export async function createAdminAccount(body: {
  user_id: number;
  password: string;
  affiliation: string;
}): Promise<void> {
  await apiClient
    .post("api/v1/president/admins", { json: body })
    .json<ApiResponse<AdminAccount>>();
}

export async function updateAdminAccount(
  targetUserId: number,
  body: {
    name?: string;
    password?: string;
    affiliation?: string;
  },
): Promise<void> {
  await apiClient
    .patch(`api/v1/president/admins/${targetUserId}`, { json: body })
    .json<ApiResponse<AdminAccount>>();
}

export async function deleteAdminAccount(targetUserId: number): Promise<void> {
  await apiClient
    .delete(`api/v1/president/admins/${targetUserId}`)
    .json<ApiResponse<null>>();
}

/**
 * 회장/부회장 위임 (회장 전용)
 * @param affiliation "회장" 또는 "부회장"
 */
export async function delegatePresidency(
  targetUserId: number,
  affiliation: "회장" | "부회장",
): Promise<void> {
  await apiClient
    .post("api/v1/president/delegate", {
      json: { user_id: targetUserId, affiliation },
    })
    .json<ApiResponse<null>>();
}
