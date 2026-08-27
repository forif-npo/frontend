import type { StudyEditForm } from "./types";
import {
  STUDY_DIFFICULTY_OPTIONS,
  STUDY_TAG_OPTIONS,
  STUDY_WEEK_DAY_OPTIONS,
} from "@core/study-form";

export const EMPTY_STUDY_EDIT_FORM: StudyEditForm = {
  secondary_mentor_id: null,
  secondary_mentor_name: null,
  study_name: "",
  one_liner: "",
  explanation: "",
  thumbnail: null,
  is_online: false,
  start_time: "",
  end_time: "",
  week_day: "",
  location: "",
  location_detail: "",
  difficulty: "",
  tags: [],
  curriculum: Array.from({ length: 8 }, (_, index) => ({
    week: index + 1,
    date: "",
    topic: "",
    contents: [""],
  })),
  requires_interview: false,
  interview_date: "",
  references: [],
};

export const WEEK_DAY_OPTIONS = STUDY_WEEK_DAY_OPTIONS;
export const DIFFICULTY_OPTIONS = STUDY_DIFFICULTY_OPTIONS;

export const DIFFICULTY_TO_LEVEL: Record<string, string> = {
  EASY: "1",
  SEMI_EASY: "2",
  NORMAL: "3",
  SEMI_HARD: "4",
  HARD: "5",
};

export { STUDY_TAG_OPTIONS };

const LEGACY_STUDY_TAGS: Record<string, (typeof STUDY_TAG_OPTIONS)[number]> = {
  개인개발: STUDY_TAG_OPTIONS[4],
  모바일: STUDY_TAG_OPTIONS[5],
  "프로그래밍 언어 기초": STUDY_TAG_OPTIONS[1],
};

export const LEGACY_STUDY_TAG_IDS: Record<string, number> = Object.fromEntries(
  Object.entries(LEGACY_STUDY_TAGS).map(([label, tag]) => [label, tag.id]),
);

function findStudyTag(value: string) {
  return (
    STUDY_TAG_OPTIONS.find(
      (option) => option.name === value || option.label === value,
    ) ?? LEGACY_STUDY_TAGS[value]
  );
}

/** 웹 스터디 화면과 같은 한글 태그 명칭을 반환한다. */
export function getStudyTagLabel(value: string): string {
  return findStudyTag(value)?.label ?? value;
}
