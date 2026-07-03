import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";

/**
 * 수료증 발급 대상 (GET /api/v1/admin/studies/{studyId}/certificates)
 */
export interface CertificateTarget {
  user_id: number;
  user_name: string;
  department: string | null;
  attendance_count: number;
  hackathon_participated: boolean;
  eligible: boolean;
  certificate_status: number;
  certificate_url: string | null;
}

export interface CertificateTargetsData {
  study_id: number;
  study_name: string;
  act_year: number;
  act_semester: number;
  required_attendance: number;
  targets: CertificateTarget[];
}

export interface IssueResultItem {
  user_id: number;
  user_name: string | null;
  success: boolean;
  message: string;
  certificate_url: string | null;
}

export interface IssueCertificatesData {
  success_count: number;
  skipped_count: number;
  results: IssueResultItem[];
}

export async function getCertificateTargets(
  studyId: number,
): Promise<CertificateTargetsData> {
  const response = await apiClient
    .get(`api/v1/admin/studies/${studyId}/certificates`)
    .json<ApiResponse<CertificateTargetsData>>();

  if (!response.data) {
    throw new Error("발급 대상을 불러올 수 없습니다.");
  }
  return response.data;
}

export async function issueCertificates(
  studyId: number,
  userIds: number[],
  activityPeriod: string,
): Promise<IssueCertificatesData> {
  const response = await apiClient
    .post(`api/v1/admin/studies/${studyId}/certificates`, {
      json: { user_ids: userIds, activity_period: activityPeriod },
      timeout: 60000, // 이미지 생성이 포함되므로 여유 있게
    })
    .json<ApiResponse<IssueCertificatesData>>();

  if (!response.data) {
    throw new Error("발급 처리 결과를 받지 못했습니다.");
  }
  return response.data;
}
