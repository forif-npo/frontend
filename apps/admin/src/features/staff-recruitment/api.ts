import type { ApiResponse, CursorPageResponse } from "@core/types/api";
import type {
  AdminStaffRecruitmentRound,
  StaffRecruitmentCreateRequest,
  StaffRecruitmentUpdateRequest,
} from "@core/types/staff-recruitment";
import { apiClient } from "@core/utils/api-client";

export async function getStaffRecruitments(): Promise<
  AdminStaffRecruitmentRound[]
> {
  const response = await apiClient
    .get("api/v1/admin/staff-recruitments", {
      searchParams: { page: 0, size: 100 },
    })
    .json<ApiResponse<CursorPageResponse<AdminStaffRecruitmentRound>>>();
  return response.data?.content ?? [];
}

export async function createStaffRecruitment(
  body: StaffRecruitmentCreateRequest,
): Promise<AdminStaffRecruitmentRound> {
  const response = await apiClient
    .post("api/v1/admin/staff-recruitments", { json: body })
    .json<ApiResponse<AdminStaffRecruitmentRound>>();
  return response.data!;
}

export async function updateStaffRecruitment(
  recruitmentId: number,
  body: StaffRecruitmentUpdateRequest,
): Promise<AdminStaffRecruitmentRound> {
  const response = await apiClient
    .patch(`api/v1/admin/staff-recruitments/${recruitmentId}`, { json: body })
    .json<ApiResponse<AdminStaffRecruitmentRound>>();
  return response.data!;
}

export async function changeStaffRecruitmentStatus(
  recruitmentId: number,
  action: "publish" | "close" | "cancel",
  version: number,
  reason?: string,
): Promise<AdminStaffRecruitmentRound> {
  const response = await apiClient
    .post(`api/v1/admin/staff-recruitments/${recruitmentId}/${action}`, {
      json: { version, reason: reason || undefined },
    })
    .json<ApiResponse<AdminStaffRecruitmentRound>>();
  return response.data!;
}
