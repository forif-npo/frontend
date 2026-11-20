import type { ApiResponse } from "@core/types/api";
import type { MyStaffApplicationSummary, StaffApplicationDetail, StaffApplicationSubmitRequest, StaffApplicationSubmitResponse, StaffApplicationUpdateRequest, StaffRecruitmentRound } from "@core/types/staff-recruitment";
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
  files: Record<number, File | null> = {},
): Promise<StaffApplicationSubmitResponse> {
  const attachments = Object.entries(files).filter(
    (entry): entry is [string, File] => entry[1] !== null,
  );
  let payload: FormData | undefined;
  if (attachments.length > 0) {
    payload = new FormData();
    payload.append(
      "request",
      new Blob([JSON.stringify(body)], { type: "application/json" }),
    );
    for (const [questionId, file] of attachments)
      payload.append(`file_${questionId}`, file);
  }
  const response = await apiClient
    .post(`api/v1/staff-recruitments/${recruitmentId}/applications`, {
      ...(payload ? { body: payload } : { json: body }),
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

export async function updateStaffApplication(
  recruitmentId: number,
  body: StaffApplicationUpdateRequest,
  files: Record<number, File | null>,
): Promise<StaffApplicationDetail> {
  const attachments = Object.entries(files).filter(
    (entry): entry is [string, File] => entry[1] !== null,
  );
  let payload: FormData | undefined;
  if (attachments.length > 0) {
    payload = new FormData();
    payload.append(
      "request",
      new Blob([JSON.stringify(body)], { type: "application/json" }),
    );
    for (const [questionId, file] of attachments) {
      payload.append(`file_${questionId}`, file);
    }
  }
  const response = await apiClient
    .patch(`api/v1/staff-recruitments/${recruitmentId}/applications/me`, {
      ...(payload ? { body: payload } : { json: body }),
    })
    .json<ApiResponse<StaffApplicationDetail>>();
  if (!response.data) throw new Error(response.message);
  return response.data;
}

export async function cancelStaffApplication(
  recruitmentId: number,
): Promise<void> {
  await apiClient.delete(
    `api/v1/staff-recruitments/${recruitmentId}/applications/me`,
  );
}

export async function getMyStaffApplications(
  token: string,
): Promise<MyStaffApplicationSummary[]> {
  const response = await apiClient
    .get("api/v1/staff-applications/me", {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    })
    .json<ApiResponse<MyStaffApplicationSummary[]>>();
  return response.data ?? [];
}
