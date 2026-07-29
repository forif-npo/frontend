import {
  getCurrentSemester,
  getSemesters,
  type Semester,
} from "@core/semester/api";

/** 탭·필터에 노출할 최근 학기 수 */
const RECENT_COUNT = 7;

export interface SemesterOptions {
  current: Semester;
  /** 현재 활동 학기부터 과거로 최근 N개 (최신순) */
  recentLabels: string[];
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

  // 서버 목록에는 다음 학기까지 포함되므로 현재 활동 학기 이하만 노출한다
  const upToCurrent = all.filter(
    (s) =>
      s.act_year < current.act_year ||
      (s.act_year === current.act_year &&
        s.act_semester <= current.act_semester),
  );

  const source = upToCurrent.length > 0 ? upToCurrent : [current];
  return {
    current,
    recentLabels: source.slice(0, RECENT_COUNT).map((s) => s.label),
  };
}

/** 학기 탭 옵션 문자열 배열 생성 */
export function toTabOptions(
  recentLabels: string[],
  includeEtc: boolean,
): string[] {
  return ["전체", ...recentLabels, ...(includeEtc ? ["그 외"] : [])];
}
