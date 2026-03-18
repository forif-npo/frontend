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
  tags: string[];
  one_liner: string;
  start_time: string;
  end_time: string;
  week_day: number;
  location: string;
  difficulty: number;
  img_url: string;
}

/**
 * Semester with a single study
 */
export interface StudyBySemester {
  year: number;
  semester: number;
  semester_label: string;
  is_current: boolean;
  study: StudyDetail;
}

/**
 * User studies response (list of semesters)
 */
export interface UserStudiesResponse {
  semesters: StudyBySemester[];
}

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
  return response.data!;
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
  const searchParams = new URLSearchParams();
  searchParams.append("study_id", studyId.toString());

  const response = await apiClient
    .get(`api/v1/users/me/certificates?${searchParams.toString()}`, options)
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
  status: number; // Application status code
  intro: string; // User's application intro
}

/**
 * Study application item
 */
export interface StudyApplication {
  user_apply_id: number;
  apply_year: number;
  apply_semester: number;
  apply_date: string; // ISO date string
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
  const options = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
  const response = await apiClient
    .get("api/v1/users/me/study-applications", options)
    .json<ApiResponse<StudyApplicationsResponse>>();
  return response.data!;
}
