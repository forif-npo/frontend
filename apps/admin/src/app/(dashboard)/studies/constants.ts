import { DEFAULT_SEMESTER_OPTIONS } from "@/components/list/semester-tabs";
import type { StudyEditForm } from "./types";

export const STUDY_SEMESTER_OPTIONS = DEFAULT_SEMESTER_OPTIONS.filter(
  (option) => option !== "그 외",
);

export const EMPTY_STUDY_EDIT_FORM: StudyEditForm = {
  study_name: "",
  sub_title: "",
  one_liner: "",
  explanation: "",
  goal: "",
  start_time: "",
  end_time: "",
  week_day: "",
  location: "",
  location_detail: "",
  recruit_status: "APPLICABLE",
  difficulty: "",
  capacity: "",
  tags: [],
};

export const WEEK_DAY_OPTIONS = [
  { value: "0", label: "일요일" },
  { value: "1", label: "월요일" },
  { value: "2", label: "화요일" },
  { value: "3", label: "수요일" },
  { value: "4", label: "목요일" },
  { value: "5", label: "금요일" },
  { value: "6", label: "토요일" },
];

export const DIFFICULTY_OPTIONS = [
  { value: "1", label: "쉬움" },
  { value: "2", label: "조금 쉬움" },
  { value: "3", label: "보통" },
  { value: "4", label: "조금 어려움" },
  { value: "5", label: "어려움" },
];

export const DIFFICULTY_TO_LEVEL: Record<string, string> = {
  EASY: "1",
  SEMI_EASY: "2",
  NORMAL: "3",
  SEMI_HARD: "4",
  HARD: "5",
};

export const STUDY_TAG_OPTIONS = [
  { id: 1, name: "database", label: "데이터베이스" },
  { id: 2, name: "basic", label: "프로그래밍 기초" },
  { id: 3, name: "frontend", label: "프론트엔드" },
  { id: 4, name: "backend", label: "백엔드" },
  { id: 5, name: "fullstack", label: "풀스택" },
  { id: 6, name: "app", label: "앱" },
  { id: 7, name: "ai", label: "인공지능" },
  { id: 8, name: "data", label: "데이터" },
  { id: 9, name: "security", label: "보안" },
  { id: 10, name: "game", label: "게임" },
  { id: 11, name: "design", label: "디자인" },
  { id: 12, name: "algorithm", label: "알고리즘" },
  { id: 13, name: "blockchain", label: "블록체인" },
] as const;

export const LEGACY_STUDY_TAG_IDS: Record<string, number> = {
  개인개발: 5,
  모바일: 6,
  "프로그래밍 언어 기초": 2,
};
