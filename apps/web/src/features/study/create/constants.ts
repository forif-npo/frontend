export { TAG_OPTIONS, getStudyTagId } from "@/constants/study-tags";

export const LOCATION_OPTIONS = [
  { value: "장소 미정", label: "장소 미정" },
  { value: "동아리방", label: "동아리방" },
  { value: "IT/BT관", label: "IT/BT관" },
  { value: "FTC", label: "FTC" },
  { value: "신소재공학관", label: "신소재공학관" },
  { value: "제1공학관", label: "제1공학관" },
  { value: "온라인", label: "온라인" },
] as const;

export const WEEKDAY_OPTIONS = [
  { value: "1", label: "월요일" },
  { value: "2", label: "화요일" },
  { value: "3", label: "수요일" },
  { value: "4", label: "목요일" },
  { value: "5", label: "금요일" },
  { value: "6", label: "토요일" },
  { value: "0", label: "일요일" },
] as const;

export const DIFFICULTY_OPTIONS = [
  { value: "EASY", label: "초급" },
  { value: "SEMI_EASY", label: "초중급" },
  { value: "NORMAL", label: "중급" },
  { value: "SEMI_HARD", label: "중상급" },
  { value: "HARD", label: "고급" },
] as const;

export const REFERENCE_TYPE_OPTIONS = [
  { value: "DOWNLOAD", label: "자료 다운로드" },
  { value: "LINK", label: "웹사이트 링크" },
] as const;

export const STEP_LABELS = [
  "신청 정보 확인",
  "스터디 개요 및 일정",
  "주차별 계획",
  "추천대상 및 운영 방식",
  "입력 정보 확인",
] as const;

export const DEFAULT_CURRICULUM = Array.from({ length: 8 }, (_, i) => ({
  week: i + 1,
  date: "",
  topic: "",
  contents: [""],
}));
