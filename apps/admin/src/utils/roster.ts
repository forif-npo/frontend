/**
 * members / mentors 목록 API에서 공통으로 쓰이는 유틸.
 * (학기 라벨 파싱, 주요 학기 판별, 응답 필드 정규화)
 */

/**
 * 주요(정규) 학기 목록. 그 외 학기를 거를 때 사용한다.
 */
export const MAIN_SEMESTERS = new Set([
  "26-1",
  "25-2",
  "25-1",
  "24-2",
  "24-1",
  "23-2",
  "23-1",
]);

/**
 * "25-2" 형태의 학기 라벨을 { year, semester }로 파싱. 형식이 아니면 null.
 */
export function parseSemesterLabel(
  semester?: string,
): { year: number; semester: number } | null {
  if (!semester) return null;

  const match = semester.match(/^(\d+)-(\d+)$/);
  if (!match) return null;

  return {
    year: Number(`20${match[1]}`),
    semester: Number(match[2]),
  };
}

/**
 * 기준 base 경로에 학기 라벨을 붙여 엔드포인트를 만든다.
 * "전체"/"그 외"/형식 불일치인 경우 base 경로를 그대로 반환.
 */
export function buildSemesterEndpoint(base: string, semester?: string): string {
  if (!semester || semester === "전체" || semester === "그 외") {
    return base;
  }

  const parsed = parseSemesterLabel(semester);
  if (!parsed) return base;

  return `${base}/${parsed.year}/${parsed.semester}`;
}

/**
 * act_year / act_semester가 주요 학기에 속하는지 판별.
 */
export function isMainSemester(year?: number, semester?: number): boolean {
  const label = `${String(year ?? 0).slice(2)}-${semester ?? 0}`;
  return MAIN_SEMESTERS.has(label);
}

/**
 * 여러 후보 값 중 첫 유효 문자열을 고른다. (snake/camel case 혼용 대응)
 */
export function pickString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim() !== "") {
      return value;
    }
    if (typeof value === "number") {
      return String(value);
    }
  }
  return "";
}

/**
 * 여러 후보 값 중 첫 유효 숫자를 고른다.
 */
export function pickNumber(...values: unknown[]): number {
  for (const value of values) {
    if (typeof value === "number") {
      return value;
    }
    if (
      typeof value === "string" &&
      value.trim() !== "" &&
      !Number.isNaN(Number(value))
    ) {
      return Number(value);
    }
  }
  return 0;
}

/**
 * 여러 후보 값 중 첫 유효 불리언을 고른다.
 */
export function pickBoolean(...values: unknown[]): boolean {
  for (const value of values) {
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string") {
      if (value.toLowerCase() === "true") return true;
      if (value.toLowerCase() === "false") return false;
    }
    if (typeof value === "number") {
      if (value === 1) return true;
      if (value === 0) return false;
    }
  }
  return false;
}
