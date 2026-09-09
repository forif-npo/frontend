import type { ApiResponse } from "../types/api";
import { apiClient } from "../utils/api-client";

/** 활동 학기 API의 공통 응답 형식 */
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
