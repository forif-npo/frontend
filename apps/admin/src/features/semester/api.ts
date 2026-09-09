import type { ApiResponse } from "@core/types/api";
import { apiClient } from "@core/utils/api-client";
import type { Semester as SharedSemester } from "@core/api/semester";

export {
  fallbackSemester,
  getCurrentSemester,
  getSemesters,
  toSemesterLabel,
  type Semester,
} from "@core/api/semester";

export interface SemesterChangePreview {
  current: SharedSemester;
  target: SharedSemester;
  target_team_member_count: number;
  /** true면 전환 후 새 학기 운영진을 지정해야 소개 페이지가 비지 않는다 */
  needs_team_setup: boolean;
  target_hackathon_exists: boolean;
  /** 현재 학기 수강생 수 */
  current_member_count: number;
  /** 현재 학기 수료증 발급 완료 수 */
  current_certificate_issued_count: number;
  /** true면 전환 전 수료증을 마저 발급하는 편이 좋다 (전환 후에는 신임 회장 서명이 찍힌다) */
  has_pending_certificates: boolean;
}

// ── 회장단 ──────────────────────────────────────────────────────────

export async function getSemesterChangePreview(
  actYear: number,
  actSemester: number,
): Promise<SemesterChangePreview> {
  const response = await apiClient
    .get("api/v1/admin/semesters/preview", {
      searchParams: { act_year: actYear, act_semester: actSemester },
    })
    .json<ApiResponse<SemesterChangePreview>>();
  return response.data!;
}

export async function changeCurrentSemester(body: {
  act_year: number;
  act_semester: number;
  /** 다음 학기를 이끌 회장. 운영진(ADMIN) 계정이어야 하며, 연임이면 본인 학번을 넣는다. */
  next_president_user_id: number;
}): Promise<SharedSemester> {
  const response = await apiClient
    .patch("api/v1/admin/semesters/current", { json: body })
    .json<ApiResponse<SharedSemester>>();
  return response.data!;
}
