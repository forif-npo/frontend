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

/**
 * 로그인한 운영진 본인의 등록된 서명 URL 조회 (미등록 시 null)
 */
export async function getMySignature(): Promise<string | null> {
  const response = await apiClient
    .get("api/v1/admin/certificates/signature")
    .json<ApiResponse<{ signature_url: string | null }>>();
  return response.data?.signature_url ?? null;
}

/**
 * 로그인한 운영진 본인의 서명 이미지 업로드 (투명 배경 PNG 권장)
 */
export async function uploadMySignature(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient
    .post("api/v1/admin/certificates/signature", {
      body: formData,
      timeout: 30000,
    })
    .json<ApiResponse<{ signature_url: string }>>();

  if (!response.data?.signature_url) {
    throw new Error("서명 업로드 결과를 받지 못했습니다.");
  }
  return response.data.signature_url;
}

export interface ManualCertificateBody {
  user_name: string;
  student_number: string;
  department: string;
  study_name: string;
  activity_period: string;
  issue_date?: string;
  /** 미입력 시 현재 회장 이름으로 표기 */
  president_name?: string;
}

/**
 * 수료증 수동 발급 — 모든 표기 정보를 직접 입력해 생성.
 * 자격 검증/DB 기록 없이 생성된 이미지 URL만 반환한다.
 */
export async function issueManualCertificate(
  body: ManualCertificateBody,
): Promise<string> {
  const response = await apiClient
    .post("api/v1/admin/certificates/manual", {
      json: body,
      timeout: 60000,
    })
    .json<ApiResponse<{ certificate_url: string }>>();

  if (!response.data?.certificate_url) {
    throw new Error("수료증 생성 결과를 받지 못했습니다.");
  }
  return response.data.certificate_url;
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
