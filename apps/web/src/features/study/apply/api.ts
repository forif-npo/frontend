import type { ApiResponse } from "@core/types/api";
import { apiClient } from "@core/utils/api-client";

/** 이번 학기 스터디 신청 가능 여부를 판단하는 백엔드 기준 상태다. */
export interface StudyApplicationStatusResponse {
  can_apply_primary: boolean;
  can_apply_secondary: boolean;
  can_apply_autonomous_study: boolean;
  has_autonomous_study_application: boolean;
  primary_study: { id: number } | null;
  secondary_study: { id: number } | null;
}

export async function getStudyApplicationStatus(): Promise<StudyApplicationStatusResponse> {
  const response = await apiClient
    .get("api/v1/users/apply/status")
    .json<ApiResponse<StudyApplicationStatusResponse>>();

  return response.data!;
}
