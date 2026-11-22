import { getCurrentSemester, getSemesters, type Semester } from "@/features/semester/api";

/** 탭·필터에 노출할 최근 학기 수 */
const RECENT_COUNT = 7;

export interface SemesterOptions {
  current: Semester;
  /** 현재 활동 학기부터 과거로 최근 N개 (최신순) */
  recentLabels: string[];
  /** 현재 활동 학기의 다음 학기. 차기 운영진 명단처럼 미리 채우는 화면에서만 탭으로 보여 준다. */
  nextLabel: string | null;
}

/**
 * 학기 탭/필터에 쓸 목록을 서버 기준으로 만든다.
 * 하드코딩된 학기 배열을 대체하며, 학기가 바뀌면 코드 수정 없이 따라간다.
 */
export async function loadSemesterOptions(): Promise<SemesterOptions> {
  const [current, all] = await Promise.all([
    getCurrentSemester(),
    getSemesters(),
  ]);
  return splitSemesterOptions(current, all);
}

/**
 * 서버 학기 목록을 현재 학기까지의 최근 목록과 다음 학기로 나눈다.
 * 서버 목록에는 다음 학기까지 포함되므로 기본 탭에는 현재 활동 학기 이하만 노출한다.
 */
export function splitSemesterOptions(current: Semester, all: Semester[]): SemesterOptions {
  const isAfterCurrent = (s: Semester) =>
    s.act_year > current.act_year ||
    (s.act_year === current.act_year && s.act_semester > current.act_semester);

  const upToCurrent = all.filter((s) => !isAfterCurrent(s));
  const source = upToCurrent.length > 0 ? upToCurrent : [current];
  const next = all
    .filter(isAfterCurrent)
    .sort((a, b) => a.act_year - b.act_year || a.act_semester - b.act_semester)[0];
  return {
    current,
    recentLabels: source.slice(0, RECENT_COUNT).map((s) => s.label),
    nextLabel: next?.label ?? null,
  };
}

/** 학기 탭 옵션 문자열 배열 생성. 다음 학기를 주면 "전체" 바로 뒤에 둔다. */
export function toTabOptions(
  recentLabels: string[],
  includeEtc: boolean,
  nextLabel: string | null = null,
): string[] {
  return [
    "전체",
    ...(nextLabel ? [nextLabel] : []),
    ...recentLabels,
    ...(includeEtc ? ["그 외"] : []),
  ];
}
