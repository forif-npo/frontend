import type { ApiResponse } from "@core/types/api";
import { apiClient } from "@core/utils/api-client";

export interface MentorConfirmationTarget {
  user_id: number;
  user_name: string;
  department: string | null;
  confirmation_status: number;
}

export interface MentorConfirmationTargetsData {
  study_id: number;
  study_name: string;
  act_year: number;
  act_semester: number;
  targets: MentorConfirmationTarget[];
}

export interface IssueMentorConfirmationsData {
  success_count: number;
  skipped_count: number;
  results: Array<{
    user_id: number;
    user_name: string | null;
    success: boolean;
    message: string;
    confirmation_url: string | null;
  }>;
}

export interface MentorConfirmationViewData {
  issued: boolean;
  confirmation_url: string | null;
}

export async function getMentorConfirmationTargets(
  studyId: number,
): Promise<MentorConfirmationTargetsData> {
  const response = await apiClient
    .get(`api/v1/admin/studies/${studyId}/mentor-confirmations`)
    .json<ApiResponse<MentorConfirmationTargetsData>>();
  if (!response.data) throw new Error("발급 대상을 불러올 수 없습니다.");
  return response.data;
}

export async function getMentorConfirmationViewUrl(
  studyId: number,
  userId: number,
): Promise<MentorConfirmationViewData> {
  const response = await apiClient
    .get(`api/v1/admin/studies/${studyId}/mentor-confirmations/${userId}`)
    .json<ApiResponse<MentorConfirmationViewData>>();
  if (!response.data?.confirmation_url) {
    throw new Error("발급된 확인서를 찾을 수 없습니다.");
  }
  return response.data;
}

export async function issueMentorConfirmations(
  studyId: number,
  userIds: number[],
  activityPeriod: string,
): Promise<IssueMentorConfirmationsData> {
  const response = await apiClient
    .post(`api/v1/admin/studies/${studyId}/mentor-confirmations`, {
      json: { user_ids: userIds, activity_period: activityPeriod },
      timeout: 60000,
    })
    .json<ApiResponse<IssueMentorConfirmationsData>>();
  if (!response.data) throw new Error("확인서 발급 결과를 받지 못했습니다.");
  return response.data;
}
