import type { ApiResponse, User } from "@core/types/api";
import { apiClient } from "@core/utils/api-client";

/**
 * User profile type (same as User from api.d.ts)
 */
export type UserProfile = User;

export interface UpdateUserProfileRequest {
  department: string;
  profile_image?: File | null;
}
export interface UpdateUserPhoneNumberRequest {
  phone_num: string;
}

/**
 * Study detail within a semester
 */
export interface StudyDetail {
  study_id: number;
  study_name: string;
  primary_mentor_name: string;
  secondary_mentor_name: string | null;
  tags: string[];
  one_liner: string;
  start_time: string;
  end_time: string;
  week_day: number;
  location: string;
  difficulty: number;
  img_url: string;
  thumbnail_image: string | null;
  thumbnail_url?: string | null;
  /** 수료증 발급 여부 (다운로드 버튼 활성화 판단) */
  certificate_issued: boolean;
}

/**
 * Semester with studies
 */
export interface StudyBySemester {
  year: number;
  semester: number;
  semester_label: string;
  is_current: boolean;
  studies: StudyDetail[];
}

/**
 * User studies response (array of semesters)
 */
export type UserStudiesResponse = StudyBySemester[];

/**
 * Raw backend response for GET /api/v1/users/me/studies.
 * The backend wraps semesters in an object and returns a single
 * study per semester (current policy: one study per semester).
 */
interface RawUserStudiesData {
  semesters: {
    year: number;
    semester: number;
    semester_label: string;
    is_current: boolean;
    study: StudyDetail | null;
  }[];
}

/**
 * Get user profile
 */
export async function getUserProfile(token?: string): Promise<UserProfile> {
  const options = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
  const response = await apiClient
    .get("api/v1/users/me/profile", options)
    .json<ApiResponse<UserProfile>>();
  console.log("User profile response:", response.data);
  return response.data!;
}

/**
 * Update user's profile information and optional profile image.
 */
export async function updateUserProfile(
  { department, profile_image }: UpdateUserProfileRequest,
  token?: string,
): Promise<UserProfile> {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify({ department })], {
      type: "application/json",
    }),
  );
  if (profile_image) {
    formData.append("profileImage", profile_image);
  }

  const options = token
    ? { body: formData, headers: { Authorization: `Bearer ${token}` } }
    : { body: formData };
  const response = await apiClient
    .patch("api/v1/users/me/profile", options)
    .json<ApiResponse<UserProfile>>();

  return response.data!;
}

/**
 * Update user's phone number.
 */
export async function updateUserPhoneNumber(
  { phone_num }: UpdateUserPhoneNumberRequest,
  token?: string,
): Promise<UserProfile> {
  const options = token
    ? {
        json: { phone_num },
        headers: { Authorization: `Bearer ${token}` },
      }
    : { json: { phone_num } };
  const response = await apiClient
    .patch("api/v1/users/me/phone-number", options)
    .json<ApiResponse<UserProfile>>();

  return response.data!;
}

/**
 * Get user's enrolled studies by semester
 */
export async function getUserStudies(
  token?: string,
): Promise<UserStudiesResponse> {
  const options = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
  const response = await apiClient
    .get("api/v1/users/me/studies", options)
    .json<ApiResponse<RawUserStudiesData>>();
  const semesters = response.data?.semesters ?? [];
  return semesters.map(({ study, ...semester }) => ({
    ...semester,
    studies: study ? [study] : [],
  }));
}

/**
 * Get certificate URL for a study
 */
export async function getCertificate(
  studyId: number,
  token?: string,
): Promise<string> {
  const options = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
  const response = await apiClient
    .get("api/v1/users/me/certificates", {
      ...options,
      searchParams: { studyId },
    })
    .json<ApiResponse<{ certificate_url: string }>>();

  return response.data!.certificate_url;
}

/**
 * Study info within an application
 */
export interface StudyInfo {
  study_id: number;
  study_name: string;
  primary_mentor_name: string;
  secondary_mentor_name: string | null;
  tags: string[];
  one_liner: string;
  week_day: number;
  start_time: string;
  end_time: string;
  location: string;
  difficulty: number;
  img_url: string;
  thumbnail_image: string | null;
  thumbnail_url?: string | null;
  autonomous_study: boolean;
}

/**
 * Application detail (primary or secondary)
 */
export interface ApplicationDetail {
  priority: string; // "PRIMARY" or "SECONDARY"
  study: StudyInfo;
  status: number;
  intro: string | null;
}

/**
 * Study application item
 */
export interface StudyApplication {
  user_apply_id: number;
  apply_year: number;
  apply_semester: number;
  apply_date: string;
  apply_path: string;
  pay_status: number;
  primary_application: ApplicationDetail;
  secondary_application: ApplicationDetail | null;
}

/**
 * Study applications response
 */
export interface StudyApplicationsResponse {
  applications: StudyApplication[];
}

export interface UpdateStudyApplicationRequest {
  study_id: number;
  apply_reason: string;
  priority: 1 | 2;
}

/**
 * Update one of the logged-in user's pending study applications.
 */
export async function updateStudyApplication(
  applyId: number,
  request: UpdateStudyApplicationRequest,
): Promise<void> {
  await apiClient.patch(`api/v1/users/apply/${applyId}`, { json: request });
}

/**
 * Cancel one priority of the logged-in user's pending study application.
 */
export async function cancelStudyApplication(
  applyId: number,
  priority: 1 | 2,
): Promise<void> {
  await apiClient.delete(`api/v1/users/apply/${applyId}`, {
    searchParams: { priority },
  });
}

/**
 * Get user's study applications
 */
export async function getStudyApplications(
  token?: string,
): Promise<StudyApplicationsResponse> {
  console.log(
    "[getStudyApplications] called, token:",
    token ? "exists" : "missing",
  );
  const options = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
  try {
    const response = await apiClient
      .get("api/v1/users/me/study-applications", options)
      .json<ApiResponse<StudyApplicationsResponse>>();
    console.log("[getStudyApplications] status:", response);
    return response.data ?? { applications: [] };
  } catch (err) {
    console.error("[getStudyApplications] error:", err);
    throw err;
  }
}
