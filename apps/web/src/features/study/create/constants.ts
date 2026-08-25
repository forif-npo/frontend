export { TAG_OPTIONS, getStudyTagName } from "@/constants/study-tags";
export {
  STUDY_LOCATION_OPTIONS as LOCATION_OPTIONS,
  STUDY_WEEK_DAY_OPTIONS as WEEKDAY_OPTIONS,
} from "@core/study-form";

export const DIFFICULTY_OPTIONS = [
  { value: "EASY", label: "쉬움" },
  { value: "SEMI_EASY", label: "조금 쉬움" },
  { value: "NORMAL", label: "보통" },
  { value: "SEMI_HARD", label: "조금 어려움" },
  { value: "HARD", label: "어려움" },
] as const;

export const REFERENCE_TYPE_OPTIONS = [
  { value: "DOWNLOAD", label: "파일" },
  { value: "LINK", label: "링크" },
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
