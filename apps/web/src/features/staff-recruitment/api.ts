import type { ApiResponse } from "@core/types/api";
import type { StaffRecruitmentRound } from "@core/types/staff-recruitment";
import { apiClient } from "@core/utils/api-client";

export async function getCurrentStaffRecruitment(): Promise<StaffRecruitmentRound | null> {
  const response = await apiClient
    .get("api/v1/staff-recruitments/current", { cache: "no-cache" })
    .json<ApiResponse<StaffRecruitmentRound>>();

  return response.data;
}
