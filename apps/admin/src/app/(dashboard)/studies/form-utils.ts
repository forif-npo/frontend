import type { AdminStudyDetail } from "./api";
import {
  DIFFICULTY_TO_LEVEL,
  LEGACY_STUDY_TAG_IDS,
  STUDY_TAG_OPTIONS,
} from "./constants";
import type { Study, StudyEditForm } from "./types";

function toDateInputValue(value?: string | null) {
  return value ? value.slice(0, 10) : "";
}

export const normalizeTimeValue = (value?: string | null) =>
  value ? value.slice(0, 5) : "";

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
): StudyEditForm => {
  const curriculum = (detail?.plans ?? []).map((plan, index) => ({
    week: plan.week_num || index + 1,
    date: toDateInputValue(plan.date),
    topic: plan.section ?? "",
    contents: plan.content ? plan.content.split("; ") : [""],
  }));

  return {
    secondary_mentor_id:
      detail?.mentors?.find((mentor) => mentor.mentor_num !== 1)?.mentor_id ??
      null,
    study_name: detail?.study_name ?? study.study_name ?? "",
    one_liner: detail?.one_liner ?? study.one_liner ?? "",
    explanation: detail?.explanation ?? "",
    thumbnail: null,
    is_online: Boolean(detail?.is_online),
    start_time: normalizeTimeValue(detail?.start_time),
    end_time: normalizeTimeValue(detail?.end_time),
    week_day:
      detail?.week_day === null || detail?.week_day === undefined
        ? ""
        : String(detail.week_day),
    location: detail?.location ?? "",
    location_detail: detail?.location_detail ?? "",
    difficulty: detail?.difficulty
      ? (DIFFICULTY_TO_LEVEL[detail.difficulty] ?? detail.difficulty)
      : "",
    tags: getStudyTagIds(detail?.tags ?? study.tags),
    curriculum:
      curriculum.length >= 8
        ? curriculum
        : Array.from(
            { length: 8 },
            (_, index) =>
              curriculum[index] ?? {
                week: index + 1,
                date: "",
                topic: "",
                contents: [""],
              },
          ),
    requires_interview: Boolean(detail?.requires_interview),
    interview_date: toDateInputValue(detail?.interview_date),
    references: (detail?.references ?? []).map((reference) => ({
      id: reference.id,
      type: reference.reference_type === "FILE" ? "DOWNLOAD" : "LINK",
      value: reference.content ?? "",
      file_name: reference.file_name ?? null,
      original_value: reference.content ?? "",
      original_type: reference.reference_type === "FILE" ? "DOWNLOAD" : "LINK",
    })),
  };
};

export function buildStudyUpdateFormData(form: StudyEditForm) {
  const retainedReferenceIds: string[] = [];
  const references = form.references.flatMap((reference) => {
    const isUnchanged =
      Boolean(reference.id) &&
      reference.type === reference.original_type &&
      reference.value === reference.original_value;
    if (isUnchanged) {
      retainedReferenceIds.push(reference.id!);
      return [];
    }
    if (reference.type === "DOWNLOAD") {
      return [
        {
          type: "FILE",
          url: "",
          file_name:
            reference.value instanceof File
              ? reference.value.name
              : reference.file_name,
        },
      ];
    }
    return [
      {
        type: "URL",
        url: typeof reference.value === "string" ? reference.value : "",
        file_name: null,
      },
    ];
  });
  const request = {
    study_name: form.study_name.trim(),
    one_liner: form.one_liner.trim(),
    explanation: form.explanation.trim(),
    is_online: form.is_online,
    location: form.location,
    location_detail: form.location_detail.trim(),
    week_day: Number(form.week_day),
    start_time: form.start_time,
    end_time: form.end_time,
    difficulty: Number(form.difficulty),
    study_tag_names: form.tags.map((tagId) => {
      const tag = STUDY_TAG_OPTIONS.find((option) => option.id === tagId);
      if (!tag) throw new Error("선택한 태그 정보를 확인해주세요.");
      return tag.name;
    }),
    secondary_mentor_id: form.secondary_mentor_id,
    requires_interview: form.requires_interview,
    interview_date: form.interview_date
      ? `${form.interview_date}T00:00:00`
      : null,
    study_plan_list: form.curriculum.map((week) => ({
      week_num: week.week,
      date: `${week.date}T00:00:00`,
      topic: week.topic.trim(),
      content: week.contents.map((content) => content.trim()).join("; "),
    })),
    references,
    retained_reference_ids: retainedReferenceIds,
  };
  const formData = new FormData();
  formData.append(
    "studyRequest",
    new Blob([JSON.stringify(request)], { type: "application/json" }),
  );
  if (form.thumbnail) formData.append("thumbnail", form.thumbnail);
  form.references.forEach((reference) => {
    if (reference.type === "DOWNLOAD" && reference.value instanceof File) {
      formData.append("references", reference.value);
    }
  });
  return formData;
}
