import { apiClient } from "@core/utils/api-client";
import type {
  AdminStudyListResponse,
  ApiResponse,
  StudyRejectRequest,
} from "@core/types/api";
import type { SemesterInfo } from "./types";
import { getCurrentSemester as fetchActiveSemester } from "@/features/semester/api";
import type { SortingState } from "@tanstack/react-table";
import { appendSortingParams } from "@/lib/list-sorting";

export interface AdminStudyDetail {
  id: number;
  study_name: string;
  one_liner: string;
  primary_mentor_name?: string | null;
  secondary_mentor_name?: string | null;
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
  thumbnail_image?: string | null;
  img_url?: string | null;
  is_online?: boolean | null;
  requires_interview?: boolean | null;
  interview_date?: string | null;
  plans?: Array<{
    id: number;
    week_num: number;
    date: string | null;
    section: string | null;
    content: string | null;
  }>;
  references?: Array<{
    id: string;
    reference_type: "FILE" | "URL";
    content: string | null;
    file_name?: string | null;
  }>;
  mentors?: Array<{
    mentor_id: number;
    mentor_name: string;
    mentor_num: number;
  }>;
}

/**
 * 현재 활동 학기.
 * 날짜로 계산하지 않고 운영진이 지정한 값을 서버에서 받는다.
 */
export async function getCurrentSemester(): Promise<SemesterInfo> {
  const semester = await fetchActiveSemester();
  return { year: semester.act_year, semester: semester.act_semester };
}

/**
 * Parameters for fetching studies
 */
export type StudyApprovalStatus =
  | "PENDING"
  | "APPROVED"
  | "STARTED"
  | "REJECTED"
  | "RE_APPLIED";

interface FetchStudiesParams {
  size: number;
  page?: number;
  year?: number;
  semester?: number;
  search?: string;
  studyStatuses?: StudyApprovalStatus[];
  sorting?: SortingState;
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
  appendSortingParams(searchParams, params.sorting ?? []);

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

export async function createAutonomousStudy(): Promise<void> {
  await apiClient
    .post("api/v1/admin/studies/autonomous")
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
  body: FormData,
): Promise<void> {
  await apiClient
    .patch(`api/v1/admin/studies/${studyId}`, {
      body,
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
