import type { ApiResponse } from "@core/types/api";
import { apiClient } from "@core/utils/api-client";

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

/** 서버 조회 실패 시에만 사용하는 날짜 기반 폴백값이다. */
export function fallbackSemester(): Semester {
  const now = new Date();
  const year = now.getFullYear();
  const semester = now.getMonth() + 1 <= 7 ? 1 : 2;
  return {
    act_year: year,
    act_semester: semester,
    label: toSemesterLabel(year, semester),
  };
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
