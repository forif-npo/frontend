import { STUDY_TAG_OPTIONS } from "@core/study-form";

export {
  STUDY_TAG_CATEGORIES,
  STUDY_TAG_OPTIONS,
  STUDY_TAG_OPTIONS_BY_CATEGORY,
} from "@core/study-form";
export type { StudyTagCategory } from "@core/study-form";

const LEGACY_LABELS: Record<string, (typeof STUDY_TAG_OPTIONS)[number]> = {
  개인개발: STUDY_TAG_OPTIONS[4],
  모바일: STUDY_TAG_OPTIONS[5],
  "프로그래밍 언어 기초": STUDY_TAG_OPTIONS[1],
};

export const TAG_OPTIONS = STUDY_TAG_OPTIONS.map((tag) => tag.label);

function findStudyTag(value: string) {
  return (
    STUDY_TAG_OPTIONS.find(
      (option) => option.name === value || option.label === value,
    ) ?? LEGACY_LABELS[value]
  );
}

export function getStudyTagId(label: string): number | null {
  return findStudyTag(label)?.id ?? null;
}

export function getStudyTagName(label: string): string | null {
  return findStudyTag(label)?.name ?? null;
}

export function getStudyTagLabel(value: string): string {
  return findStudyTag(value)?.label ?? value;
}
