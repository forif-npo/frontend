import type { ApiResponse } from "../types/api";
import { apiClient } from "../utils/api-client";

/**
 * Study created by the mentor (GET /api/v1/studies/me/created)
 */
export interface CreatedStudy {
  id: number;
  study_name: string;
  primary_mentor_name: string;
  secondary_mentor_name: string | null;
  tags: string[];
  recruit_status: string | null;
  one_liner: string;
  explanation: string;
  start_time: string;
  end_time: string;
  week_day: number;
  location: string;
  difficulty: string | null;
  img_url: string;
  act_year: number;
  act_semester: number;
}

/**
 * Applicant status filter values (backend enum UserApplyStatus)
 */
export type ApplyStatusFilter = "PENDING" | "ACCEPT" | "REJECT";

/**
 * Applicant row (GET /api/v1/users/apply/{studyId})
 * study_status is the Korean label from the backend: 대기중 | 승낙 | 거절
 */
export interface Applicant {
  apply_id: number;
  applier_name: string;
  study_name: string;
  study_comment: string;
  apply_date: string;
  study_status: string;
  priority: number;
}

export interface ApplicantsPage {
  total_pages: number;
  total_elements: number;
  content: Applicant[];
}

export interface GetApplicantsParams {
  page?: number;
  pageSize?: number;
  statusFilter?: ApplyStatusFilter;
  applyDateDirection?: "DESC" | "ASC";
}

/**
 * Get studies the logged-in mentor created (approved only).
 * Non-mentors get an empty list.
 */
export async function getMyCreatedStudies(
  token?: string,
): Promise<CreatedStudy[]> {
  const options = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
  const response = await apiClient
    .get("api/v1/studies/me/created", options)
    .json<ApiResponse<CreatedStudy[]>>();
  return response.data ?? [];
}

/**
 * Get applicants for a study (mentor only).
 */
export async function getApplicants(
  studyId: number,
  params: GetApplicantsParams = {},
): Promise<ApplicantsPage> {
  const searchParams: Record<string, string | number> = {
    page: params.page ?? 0,
    pageSize: params.pageSize ?? 20,
    applyDateDirection: params.applyDateDirection ?? "DESC",
  };
  if (params.statusFilter) {
    searchParams.statusFilter = params.statusFilter;
  }
  const response = await apiClient
    .get(`api/v1/users/apply/${studyId}`, { searchParams })
    .json<ApiResponse<ApplicantsPage>>();
  return response.data ?? { total_pages: 0, total_elements: 0, content: [] };
}

/**
 * Get the full apply reason of one application (mentor only).
 */
export async function getApplicationDetail(
  studyId: number,
  applyId: number,
): Promise<string> {
  const response = await apiClient
    .get(`api/v1/users/apply/${studyId}/${applyId}`)
    .json<ApiResponse<{ apply_reason: string }>>();
  return response.data?.apply_reason ?? "";
}

/**
 * Attendance record for one mentee-week (backend enum: present / absent)
 */
export type AttendanceStatus = "present" | "absent";

export interface AttendanceRecord {
  week_num: number;
  status: AttendanceStatus;
  study_date: string | null;
}

export interface MenteeAttendance {
  user_id: number;
  user_name: string;
  department: string | null;
  records: AttendanceRecord[];
}

export interface StudyAttendanceData {
  study_id: number;
  study_name: string;
  mentees: MenteeAttendance[];
}

export interface AttendanceUpdateItem {
  user_id: number;
  week_num: number;
  status: AttendanceStatus;
  study_date?: string;
}

/**
 * Get attendance matrix for a study (mentor only).
 */
export async function getAttendance(
  studyId: number,
): Promise<StudyAttendanceData> {
  const response = await apiClient
    .get(`api/v1/studies/${studyId}/attendances`)
    .json<ApiResponse<StudyAttendanceData>>();
  return response.data ?? { study_id: studyId, study_name: "", mentees: [] };
}

/**
 * Bulk-upsert attendance records (mentor only).
 */
export async function updateAttendance(
  studyId: number,
  attendances: AttendanceUpdateItem[],
): Promise<void> {
  await apiClient.put(`api/v1/studies/${studyId}/attendances`, {
    json: { attendances },
  });
}

/**
 * Bulk-accept applications (mentor only).
 */
export async function acceptApplications(
  studyId: number,
  applyIds: number[],
): Promise<void> {
  await apiClient.post(`api/v1/users/apply/${studyId}/accept`, {
    json: { apply_ids: applyIds },
  });
}

/**
 * Bulk-reject applications (mentor only).
 */
export async function rejectApplications(
  studyId: number,
  applyIds: number[],
): Promise<void> {
  await apiClient.post(`api/v1/users/apply/${studyId}/reject`, {
    json: { apply_ids: applyIds },
  });
}
