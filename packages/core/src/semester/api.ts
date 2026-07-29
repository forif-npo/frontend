import type { ApiResponse } from "../types/api";
import { apiClient } from "../utils/api-client";

/**
 * 활동 학기 API (FOR-108)
 *
 * 학기는 클라이언트에서 날짜로 계산하지 않는다.
 * 운영진이 지정한 값을 서버에서 받아 쓰는 것이 유일한 기준이다.
 */

export interface Semester {
  act_year: number;
  act_semester: number;
  /** "26-1" 형태 표기 */
  label: string;
}

export interface SemesterChangePreview {
  current: Semester;
  target: Semester;
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

/** 날짜 계산 폴백 — 서버 조회 실패 시에만 쓴다 (백엔드 DateUtils와 동일 기준: 7월까지 1학기) */
export function fallbackSemester(): Semester {
  const now = new Date();
  const year = now.getFullYear();
  const semester = now.getMonth() + 1 <= 7 ? 1 : 2;
  return { act_year: year, act_semester: semester, label: toSemesterLabel(year, semester) };
}

export function toSemesterLabel(year: number, semester: number): string {
  return `${String(year % 100).padStart(2, "0")}-${semester}`;
}

// ── 공개 ────────────────────────────────────────────────────────────

export async function getCurrentSemester(): Promise<Semester> {
  try {
    const response = await apiClient
      .get("api/v1/semesters/current")
      .json<ApiResponse<Semester>>();
    return response.data ?? fallbackSemester();
  } catch {
    return fallbackSemester();
  }
}

export async function getSemesters(): Promise<Semester[]> {
  try {
    const response = await apiClient
      .get("api/v1/semesters")
      .json<ApiResponse<Semester[]>>();
    return response.data ?? [];
  } catch {
    return [];
  }
}

// ── 회장단 ──────────────────────────────────────────────────────────

export async function getSemesterChangePreview(
  actYear: number,
  actSemester: number,
): Promise<SemesterChangePreview> {
  const response = await apiClient
    .get("api/v1/admin/semesters/preview", {
      searchParams: { actYear, actSemester },
    })
    .json<ApiResponse<SemesterChangePreview>>();
  return response.data!;
}

export async function changeCurrentSemester(body: {
  act_year: number;
  act_semester: number;
  /** 다음 학기를 이끌 회장. 운영진(ADMIN) 계정이어야 하며, 연임이면 본인 학번을 넣는다. */
  next_president_user_id: number;
}): Promise<Semester> {
  const response = await apiClient
    .patch("api/v1/admin/semesters/current", { json: body })
    .json<ApiResponse<Semester>>();
  return response.data!;
}
