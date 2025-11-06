import type { DifficultyLevel, RecruitStatus } from "@/types/study";
import type { BadgeProps } from "@ui/components/server";
import { DIFFICULTY_OPTIONS, RECRUIT_STATUS_OPTIONS } from "./options";

/**
 * 요일 변환 함수
 */
export function getWeekDayLabel(weekDay: number): string {
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  return weekDays[weekDay] || "";
}

/**
 * 난이도 라벨 가져오기
 */
export function getDifficultyLabel(
  difficulty: DifficultyLevel | string,
): string {
  const option = DIFFICULTY_OPTIONS.find((opt) => opt.value === difficulty);
  return option?.label || difficulty;
}

/**
 * 난이도 Badge variant 가져오기
 */
export function getDifficultyBadgeVariant(
  difficulty: DifficultyLevel,
): BadgeProps["variant"] {
  const option = DIFFICULTY_OPTIONS.find((opt) => opt.value === difficulty);
  return option?.variant || "primary";
}

/**
 * 난이도 색상 가져오기 (레거시 호환용)
 * @deprecated getDifficultyBadgeVariant 사용을 권장합니다
 */
export function getDifficultyColor(
  difficulty: DifficultyLevel | string,
): string {
  const option = DIFFICULTY_OPTIONS.find((opt) => opt.value === difficulty);
  return option?.variant || "primary";
}

/**
 * 모집 상태 라벨 가져오기
 */
export function getRecruitStatusLabel(status: RecruitStatus): string {
  const option = RECRUIT_STATUS_OPTIONS.find((opt) => opt.value === status);
  return option?.label || status;
}

/**
 * 모집 상태 Badge variant 가져오기
 */
export function getRecruitStatusBadgeVariant(
  status: RecruitStatus,
): BadgeProps["variant"] {
  const option = RECRUIT_STATUS_OPTIONS.find((opt) => opt.value === status);
  return option?.variant || "primary";
}

/**
 * 현재 학기 가져오기
 */
export function getCurrentSemester(): { year: number; semester: number } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  // 2월-7월: 1학기, 8월-1월: 2학기
  const semester = month >= 2 && month <= 7 ? 1 : 2;

  return { year, semester };
}

/**
 * 학기 라벨 가져오기
 */
export function getSemesterLabel(year: number, semester: number): string {
  return `${year}년 ${semester}학기`;
}

/**
 * 학기 옵션 생성 (최근 N개 학기)
 */
export function getRecentSemesters(count: number = 5): Array<{
  value: { year: number; semester: number };
  label: string;
}> {
  const semesters: Array<{
    value: { year: number; semester: number };
    label: string;
  }> = [];
  const current = getCurrentSemester();
  let year = current.year;
  let sem = current.semester;

  for (let i = 0; i < count; i++) {
    semesters.push({
      value: { year, semester: sem },
      label: getSemesterLabel(year, sem),
    });

    // Move to previous semester
    if (sem === 1) {
      sem = 2;
      year--;
    } else {
      sem = 1;
    }
  }

  return semesters;
}
