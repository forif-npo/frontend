import type { ApiResponse } from "../types/api";
import { apiClient } from "../utils/api-client";

export type StudyApplicationStatus = "PENDING" | "RE_APPLIED" | "REJECTED";

export interface StudyApplicationSummary {
  id: number;
  study_name: string;
  one_liner: string | null;
  tags: string[];
  study_status: StudyApplicationStatus;
  reject_reason: string | null;
  created_at: string;
  can_modify: boolean;
}

export interface StudyApplicationDetail {
  study: {
    id: number;
    study_name: string;
    one_liner: string | null;
    primary_mentor_name: string | null;
    secondary_mentor_name: string | null;
    tags: string[];
    explanation: string | null;
    goal: string | null;
    start_time: string | null;
    end_time: string | null;
    week_day: number | null;
    location: string | null;
    location_detail: string | null;
    difficulty: string | null;
    is_online: boolean | null;
    capacity: number | null;
    requires_interview: boolean | null;
    interview_date?: string | null;
    mentors?: Array<{
      mentor_id: number;
      mentor_num: number;
    }>;
    plans: Array<{
      id: number;
      week_num: number;
      date: string | null;
      section: string | null;
      content: string | null;
    }>;
    references: Array<{
      id: string;
      reference_type: "FILE" | "URL";
      content: string | null;
    }>;
  };
  study_status: StudyApplicationStatus;
  reject_reason: string | null;
  can_modify: boolean;
}

export async function getMyStudyApplications(
  token?: string,
): Promise<StudyApplicationSummary[]> {
  const response = await apiClient
    .get("api/v1/study-apply/me", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
    .json<ApiResponse<StudyApplicationSummary[]>>();

  return response.data ?? [];
}

export async function getMyStudyApplication(
  studyId: number,
  token?: string,
): Promise<StudyApplicationDetail> {
  const response = await apiClient
    .get(`api/v1/study-apply/${studyId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
    .json<ApiResponse<StudyApplicationDetail>>();

  if (!response.data) {
    throw new Error("스터디 개설 신청서를 불러오지 못했습니다.");
  }

  return response.data;
}

export async function cancelStudyCreationApplication(
  studyId: number,
): Promise<void> {
  await apiClient.delete(`api/v1/study-apply/${studyId}`);
}
