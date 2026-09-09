import type { SemesterLabel } from "./types";

const SEMESTER_LABEL_PATTERN = /^(\d{2})-([12])$/;

/**
 * API 목록 조회에 사용할 학기 라벨을 year·semester 필터로 변환한다.
 * "전체", "그 외" 및 형식이 맞지 않는 값은 기존 호출과 같이 빈 필터로 둔다.
 */
export function parseStudySemesterFilter(semester: SemesterLabel) {
  const match = semester.match(SEMESTER_LABEL_PATTERN);

  if (!match) {
    return {};
  }

  return {
    year: Number(`20${match[1]}`),
    semester: Number(match[2]),
  };
}
