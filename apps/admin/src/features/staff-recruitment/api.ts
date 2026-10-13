import type { ApiResponse, CursorPageResponse } from "@core/types/api";
import type {
  AdminStaffRecruitmentRound,
  StaffApplicationDetail,
  StaffApplicationSummary,
  StaffRecruitmentReviewer,
  StaffRecruitmentCreateRequest,
  StaffRecruitmentUpdateRequest,
  StaffReviewerCandidate,
  StaffReviewerGrantRequest,
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

export interface StaffApplicationPage {
  content: StaffApplicationSummary[];
  totalElements: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export async function getStaffApplications({
  recruitmentId,
  departmentId,
  search,
  page = 0,
  size = 20,
}: {
  recruitmentId: number;
  departmentId?: number;
  search?: string;
  page?: number;
  size?: number;
}): Promise<StaffApplicationPage> {
  const searchParams = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  // Spring @RequestParam의 실제 파라미터 이름이다.
  if (departmentId) searchParams.set("departmentId", String(departmentId));
  if (search?.trim()) searchParams.set("search", search.trim());

  const response = await apiClient
    .get(`api/v1/admin/staff-recruitments/${recruitmentId}/applications`, {
      searchParams,
      cache: "no-store",
    })
    .json<ApiResponse<CursorPageResponse<StaffApplicationSummary>>>();
  if (!response.data) throw new Error(response.message);
  return {
    content: response.data.content,
    totalElements: response.data.total_elements,
    currentPage: response.data.current_page ?? page,
    totalPages: response.data.total_pages ?? 0,
    pageSize: size,
  };
}

export async function getStaffApplicationDetail(
  recruitmentId: number,
  applicationId: number,
): Promise<StaffApplicationDetail> {
  const response = await apiClient
    .get(
      `api/v1/admin/staff-recruitments/${recruitmentId}/applications/${applicationId}`,
      { cache: "no-store" },
    )
    .json<ApiResponse<StaffApplicationDetail>>();
  if (!response.data) throw new Error(response.message);
  return response.data;
}

export async function getStaffReviewerCandidates(
  recruitmentId: number,
): Promise<StaffReviewerCandidate[]> {
  const response = await apiClient
    .get(
      `api/v1/admin/staff-recruitments/${recruitmentId}/reviewer-candidates`,
      { cache: "no-store" },
    )
    .json<ApiResponse<StaffReviewerCandidate[]>>();
  return response.data ?? [];
}

export async function getStaffReviewers(
  recruitmentId: number,
): Promise<StaffRecruitmentReviewer[]> {
  const response = await apiClient
    .get(`api/v1/admin/staff-recruitments/${recruitmentId}/reviewers`, {
      cache: "no-store",
    })
    .json<ApiResponse<StaffRecruitmentReviewer[]>>();
  return response.data ?? [];
}

export async function grantStaffReviewer(
  recruitmentId: number,
  body: StaffReviewerGrantRequest,
): Promise<StaffRecruitmentReviewer> {
  const response = await apiClient
    .post(`api/v1/admin/staff-recruitments/${recruitmentId}/reviewers`, {
      json: body,
    })
    .json<ApiResponse<StaffRecruitmentReviewer>>();
  if (!response.data) throw new Error(response.message);
  return response.data;
}

export async function revokeStaffReviewer(
  recruitmentId: number,
  userId: number,
): Promise<void> {
  await apiClient.delete(
    `api/v1/admin/staff-recruitments/${recruitmentId}/reviewers/${userId}`,
  );
}
