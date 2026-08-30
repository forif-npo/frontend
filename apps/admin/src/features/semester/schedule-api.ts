import type { ApiResponse } from "@core/types/api";
import { apiClient } from "@core/utils/api-client";

/**
 * 학기 모집 일정 API (FOR-115)
 *
 * 4개 모집 단계와 스터디 시작 시각을 회장단이 설정하고 서버가 강제한다.
 * 설정되지 않은 멘티 모집·승낙/거절 단계는 닫히며, 그 외 단계는 상시 개방이다.
 */

export const SEMESTER_PHASES = [
  "MENTOR_RECRUIT",
  "MENTOR_REVIEW",
  "MENTEE_RECRUIT",
  "MENTEE_REVIEW",
  "STUDY_START",
] as const;

export type SemesterPhase = (typeof SEMESTER_PHASES)[number];

export const SEMESTER_PHASE_LABELS: Record<SemesterPhase, string> = {
  MENTOR_RECRUIT: "멘토 모집",
  MENTOR_REVIEW: "멘토 승낙/거절",
  MENTEE_RECRUIT: "멘티 모집",
  MENTEE_REVIEW: "멘티 승낙/거절",
  STUDY_START: "스터디 시작",
};

/** 각 단계가 실제로 무엇을 여닫는지 — 화면 안내용 */
export const SEMESTER_PHASE_DESCRIPTIONS: Record<SemesterPhase, string> = {
  MENTOR_RECRUIT: "부원이 스터디 개설을 신청할 수 있는 기간",
  MENTOR_REVIEW: "운영진이 개설 신청을 승인·반려하는 기간",
  MENTEE_RECRUIT: "부원이 수강 신청을 할 수 있는 기간",
  MENTEE_REVIEW: "멘토가 신청자를 승낙·거절 처리하는 기간",
  STUDY_START: "설정한 시각에 승인된 스터디가 개설 상태로 전환됨",
};

export interface SemesterScheduleItem {
  id: number;
  act_year: number;
  act_semester: number;
  phase: SemesterPhase;
  phase_label: string;
  /** 이 시각부터 포함 */
  starts_at: string;
  /** 이 시각은 포함하지 않음 (반열림) */
  ends_at: string;
  open: boolean;
}

export interface SavePhaseWindow {
  phase: SemesterPhase;
  starts_at: string;
  ends_at: string;
}

export async function getCurrentSemesterSchedules(): Promise<
  SemesterScheduleItem[]
> {
  try {
    const response = await apiClient
      .get("api/v1/semester-schedules/current")
      .json<ApiResponse<SemesterScheduleItem[]>>();
    return response.data ?? [];
  } catch {
    return [];
  }
}

export async function getSemesterSchedules(
  year: number,
  semester: number,
): Promise<SemesterScheduleItem[]> {
  try {
    const response = await apiClient
      .get(`api/v1/semester-schedules/${year}/${semester}`)
      .json<ApiResponse<SemesterScheduleItem[]>>();
    return response.data ?? [];
  } catch {
    return [];
  }
}

/**
 * 한 학기의 모집 일정을 통째로 저장한다.
 * 부분 수정이 아니라 전체 교체다 — 목록에서 빠진 멘티 모집·승낙/거절 단계는 닫히고,
 * 그 외 단계는 상시 개방으로 돌아간다.
 */
export async function saveSemesterSchedules(
  year: number,
  semester: number,
  phases: SavePhaseWindow[],
): Promise<SemesterScheduleItem[]> {
  const response = await apiClient
    .put(`api/v1/admin/semester-schedules/${year}/${semester}`, {
      json: { phases },
    })
    .json<ApiResponse<SemesterScheduleItem[]>>();
  return response.data ?? [];
}
