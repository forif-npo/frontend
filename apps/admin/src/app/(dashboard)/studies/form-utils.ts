import type { AdminStudyDetail } from "./api";
import {
  DIFFICULTY_TO_LEVEL,
  LEGACY_STUDY_TAG_IDS,
  STUDY_TAG_OPTIONS,
} from "./constants";
import type { Study, StudyEditForm } from "./types";

export const normalizeTimeValue = (value?: string | null) =>
  value ? value.slice(0, 5) : "";

export const parseOptionalNumber = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return undefined;
  }

  const parsedValue = Number(trimmedValue);

  return Number.isNaN(parsedValue) ? undefined : parsedValue;
};

export const getStudyTagId = (tagValue: string) => {
  const option = STUDY_TAG_OPTIONS.find(
    (tag) => tag.name === tagValue || tag.label === tagValue,
  );

  return option?.id ?? LEGACY_STUDY_TAG_IDS[tagValue] ?? null;
};

export const getStudyTagIds = (tags?: string[] | null) => {
  const tagIds = (tags ?? [])
    .map(getStudyTagId)
    .filter((tagId): tagId is number => tagId !== null);

  return Array.from(new Set(tagIds));
};

export const toStudyEditForm = (
  study: Study,
  detail?: AdminStudyDetail,
): StudyEditForm => ({
  study_name: detail?.study_name ?? study.study_name ?? "",
  sub_title: detail?.sub_title ?? "",
  one_liner: detail?.one_liner ?? study.one_liner ?? "",
  explanation: detail?.explanation ?? "",
  goal: detail?.goal ?? "",
  start_time: normalizeTimeValue(detail?.start_time),
  end_time: normalizeTimeValue(detail?.end_time),
  week_day:
    detail?.week_day === null || detail?.week_day === undefined
      ? ""
      : String(detail.week_day),
  location: detail?.location ?? "",
  location_detail: detail?.location_detail ?? "",
  recruit_status: detail?.recruit_status ?? study.recruit_status,
  difficulty: detail?.difficulty
    ? (DIFFICULTY_TO_LEVEL[detail.difficulty] ?? detail.difficulty)
    : "",
  capacity:
    detail?.capacity === null || detail?.capacity === undefined
      ? ""
      : String(detail.capacity),
  tags: getStudyTagIds(detail?.tags ?? study.tags),
});
