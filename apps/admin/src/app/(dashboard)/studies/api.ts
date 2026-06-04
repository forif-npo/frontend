import { apiClient } from "@core/utils/api-client";
import type {
  AdminStudyListResponse,
  ApiResponse,
  StudyRejectRequest,
  StudyUpdateRequest,
} from "@core/types/api";
import type { SemesterInfo } from "./types";

export interface AdminStudyDetail {
  id: number;
  study_name: string;
  sub_title?: string | null;
  one_liner: string;
  tags?: string[] | null;
  explanation?: string | null;
  goal?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  week_day?: number | null;
  location?: string | null;
  location_detail?: string | null;
  recruit_status?: "APPLICABLE" | "CLOSED" | null;
  difficulty?: string | null;
  capacity?: number | null;
}

/**
 * Calculate current academic semester based on date
 * January-June (months 1-6) → semester 1
 * July-December (months 7-12) → semester 2
 */
export async function getCurrentSemester(): Promise<SemesterInfo> {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() is 0-indexed

  return {
    year,
    semester: month <= 6 ? 1 : 2,
  };
}

/**
 * Parameters for fetching studies
 */
export type StudyApprovalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "RE_APPLIED";

interface FetchStudiesParams {
  size: number;
  page?: number;
  year?: number;
  semester?: number;
  search?: string;
  studyStatuses?: StudyApprovalStatus[];
}

/**
 * Fetch studies from backend API
 * Throws error if API call fails
 */
export async function fetchStudiesWithFallback(
  params: FetchStudiesParams,
  token: string,
): Promise<AdminStudyListResponse> {
  console.log("[Studies API] Fetching from API:", {
    endpoint: "/api/v1/admin/studies",
    params,
  });

  const searchParams = new URLSearchParams();
  searchParams.set("page", (params.page ?? 0).toString());
  searchParams.set("size", params.size.toString());

  if (params.year !== undefined) {
    searchParams.set("year", params.year.toString());
  }
  if (params.semester !== undefined) {
    searchParams.set("semester", params.semester.toString());
  }
  if (params.search) {
    searchParams.set("search", params.search);
  }
  params.studyStatuses?.forEach((status) => {
    searchParams.append("study_status", status);
  });

  const response = await apiClient
    .get("api/v1/admin/studies", {
      searchParams,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json<ApiResponse<AdminStudyListResponse>>();

  // Validate response structure
  if (!response.data || !response.data.content) {
    throw new Error("Invalid API response structure");
  }

  console.log("[Studies API] Success:", {
    count: response.data.content.length,
    total: response.data.total_elements,
    page: response.data.current_page,
    totalPages: response.data.total_pages,
  });

  return response.data;
}

export async function approveStudy(studyId: number): Promise<void> {
  await apiClient
    .patch(`api/v1/admin/studies/${studyId}/approve`)
    .json<ApiResponse<null>>();
}

export async function fetchStudyDetail(
  studyId: number,
): Promise<AdminStudyDetail> {
  const response = await apiClient
    .get(`api/v1/studies/${studyId}`)
    .json<ApiResponse<AdminStudyDetail>>();

  if (!response.data) {
    throw new Error("스터디 상세 정보를 불러올 수 없습니다.");
  }

  return response.data;
}

export async function updateStudy(
  studyId: number,
  body: StudyUpdateRequest,
): Promise<void> {
  await apiClient
    .patch(`api/v1/admin/studies/${studyId}`, {
      json: body,
    })
    .json<ApiResponse<null>>();
}

export async function deleteStudy(studyId: number): Promise<void> {
  await apiClient
    .delete(`api/v1/admin/studies/${studyId}`)
    .json<ApiResponse<null>>();
}

export async function rejectStudy(
  studyId: number,
  reason: string,
): Promise<void> {
  const body: StudyRejectRequest = { reason };

  await apiClient
    .patch(`api/v1/admin/studies/${studyId}/reject`, {
      json: body,
    })
    .json<ApiResponse<null>>();
}
