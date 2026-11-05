import type { ApiResponse } from "@core/types/api";
import type {
  StaffApplicationDetail,
  StaffApplicationSubmitRequest,
  StaffApplicationSubmitResponse,
  StaffRecruitmentRound,
} from "@core/types/staff-recruitment";
import { apiClient } from "@core/utils/api-client";

export async function getCurrentStaffRecruitment(): Promise<StaffRecruitmentRound | null> {
  const response = await apiClient
    .get("api/v1/staff-recruitments/current", { cache: "no-cache" })
    .json<ApiResponse<StaffRecruitmentRound>>();

  return response.data;
}

export async function getStaffRecruitment(
  recruitmentId: number,
): Promise<StaffRecruitmentRound> {
  const response = await apiClient
    .get(`api/v1/staff-recruitments/${recruitmentId}`, { cache: "no-cache" })
    .json<ApiResponse<StaffRecruitmentRound>>();
  if (!response.data) throw new Error(response.message);
  return response.data;
}

export async function submitStaffApplication(
  recruitmentId: number,
  body: StaffApplicationSubmitRequest,
): Promise<StaffApplicationSubmitResponse> {
  const response = await apiClient
    .post(`api/v1/staff-recruitments/${recruitmentId}/applications`, {
      json: body,
    })
    .json<ApiResponse<StaffApplicationSubmitResponse>>();
  if (!response.data) throw new Error(response.message);
  return response.data;
}

export async function getMyStaffApplication(
  recruitmentId: number,
): Promise<StaffApplicationDetail> {
  const response = await apiClient
    .get(`api/v1/staff-recruitments/${recruitmentId}/applications/me`, {
      cache: "no-store",
    })
    .json<ApiResponse<StaffApplicationDetail>>();
  if (!response.data) throw new Error(response.message);
  return response.data;
}
