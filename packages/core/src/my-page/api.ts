import type { ApiResponse, User } from "../types/api";
import { apiClient } from "../utils/api-client";

/**
 * User profile type (same as User from api.d.ts)
 */
export type UserProfile = User;

/**
 * Study detail within a semester
 */
export interface StudyDetail {
  study_id: number;
  study_name: string;
  primary_mentor_name: string;
  secondary_mentor_name: string | null;
  tag: string;
  one_liner: string;
  start_time: string;
  end_time: string;
  week_day: number;
  location: string;
  difficulty: number;
  img_url: string;
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
 * Get user profile
 */
export async function getUserProfile(token?: string): Promise<UserProfile> {
  const options = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
  const response = await apiClient
    .get("api/v1/users/me", options)
    .json<ApiResponse<UserProfile>>();
  console.log("User profile response:", response.data);
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
    .json<ApiResponse<UserStudiesResponse>>();
  const data = response.data;
  return Array.isArray(data) ? data : [];
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
}

/**
 * Application detail (primary or secondary)
 */
export interface ApplicationDetail {
  priority: string; // "PRIMARY" or "SECONDARY"
  study: StudyInfo;
  status: number;
  intro: string;
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
