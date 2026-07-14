import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import type { StudyOpenValues } from "@core/schemas";
import { toLocalDateTimeFromDateInput } from "@/utils/dateInput";
import { getStudyTagId } from "./constants";

const DIFFICULTY_MAP: Record<string, number> = {
  EASY: 1,
  SEMI_EASY: 2,
  NORMAL: 3,
  SEMI_HARD: 4,
  HARD: 5,
};

function toLocalDateTime(value: string | null | undefined) {
  if (!value) return null;
  const parsedDateTime = toLocalDateTimeFromDateInput(value);
  if (parsedDateTime) return parsedDateTime;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value}T00:00:00`;

  const shortDate = value.match(/^(\d{2})\.(\d{2})\.(\d{2})$/);
  if (shortDate) {
    const [, year, month, day] = shortDate;
    return `20${year}-${month}-${day}T00:00:00`;
  }

  return value;
}

function buildStudyRequest(values: StudyOpenValues) {
  const secondaryMentorId = values.mentorIds[0] ?? null;
  const studyTagIds = values.tags.map((tag) => {
    const id = getStudyTagId(tag);
    if (id === null) {
      throw new Error("선택한 태그 정보를 확인해주세요.");
    }
    return id;
  });

  return {
    title: values.studyName,
    sub_title: values.oneLiner,
    study_tag_id: studyTagIds,
    goal: values.introduction, // Figma removed goal; reuse introduction
    explanation: values.introduction,
    is_online: values.isOnline,
    study_location: values.location,
    study_location_detail: values.room,
    week_day: Number(values.weekDay),
    start_time: values.startTime,
    end_time: values.endTime,
    study_plan_list: values.curriculum.flatMap((week) =>
      week.contents.map((content) => ({
        week_num: week.week,
        date: toLocalDateTime(week.date),
        topic: week.topic,
        content,
      })),
    ),
    difficulty: DIFFICULTY_MAP[values.difficulty] ?? 3,
    selection_criteria: "참여 의지와 스터디 목표 적합도를 기준으로 선정합니다.",
    capacity: 30,
    requires_interview: values.hasInterview,
    interview_date: toLocalDateTime(values.interviewDate),
    references: values.references.map((ref) => ({
      type: "URL",
      url: ref.value,
      file_name: null,
    })),
    secondary_mentor_id: secondaryMentorId,
  };
}

export async function submitStudyCreate(values: StudyOpenValues) {
  const studyRequest = buildStudyRequest(values);

  const formData = new FormData();
  formData.append(
    "studyRequest",
    new Blob([JSON.stringify(studyRequest)], { type: "application/json" }),
  );
  if (values.thumbnail) {
    formData.append("thumbnail", values.thumbnail);
  }

  const response = await apiClient
    .post("api/v1/study-apply", { body: formData })
    .json<ApiResponse<{ study_apply_id: number }>>();

  return response;
}
