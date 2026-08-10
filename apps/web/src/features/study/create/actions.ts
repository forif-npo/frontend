import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import type { StudyOpenValues } from "@core/schemas";
import { toLocalDateTimeFromDateInput } from "@/utils/dateInput";
import { getStudyTagName } from "./constants";

const DIFFICULTY_MAP: Record<string, number> = {
  EASY: 1,
  SEMI_EASY: 2,
  NORMAL: 3,
  SEMI_HARD: 4,
  HARD: 5,
};
// 백엔드 @RequestPart(value = "references")와 파트 이름이 일치해야 파일이 매칭된다
const REFERENCE_FILE_FIELD_NAME = "references";
const STUDY_PLAN_CONTENT_SEPARATOR = "; ";

function isFileValue(
  value: StudyOpenValues["references"][number]["value"],
): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

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
  const studyTagNames = values.tags.map((tag) => {
    const name = getStudyTagName(tag);
    if (name === null) {
      throw new Error("선택한 태그 정보를 확인해주세요.");
    }
    return name;
  });

  return {
    title: values.studyName,
    one_liner: values.oneLiner,
    study_tag_names: studyTagNames,
    goal: values.introduction, // Figma removed goal; reuse introduction
    explanation: values.introduction,
    is_online: values.isOnline,
    study_location: values.location,
    study_location_detail: values.room,
    week_day: Number(values.weekDay),
    start_time: values.startTime,
    end_time: values.endTime,
    study_plan_list: values.curriculum.map((week) => ({
      week_num: week.week,
      date: toLocalDateTime(week.date),
      topic: week.topic,
      content: week.contents
        .map((content) => content.trim())
        .filter(Boolean)
        .join(STUDY_PLAN_CONTENT_SEPARATOR),
    })),
    difficulty: DIFFICULTY_MAP[values.difficulty] ?? 3,
    selection_criteria: "참여 의지와 스터디 목표 적합도를 기준으로 선정합니다.",
    capacity: 30,
    requires_interview: values.hasInterview,
    interview_date: toLocalDateTime(values.interviewDate),
    references: values.references.map((ref) => {
      if (ref.type === "DOWNLOAD" && isFileValue(ref.value)) {
        return {
          type: "FILE",
          url: "",
          file_name: ref.value.name,
        };
      }

      return {
        type: "URL",
        url: typeof ref.value === "string" ? ref.value : "",
        file_name: null,
      };
    }),
    secondary_mentor_id: secondaryMentorId,
  };
}

function buildStudyApplicationUpdateRequest(
  values: StudyOpenValues,
  dirtyFields: Partial<Record<keyof StudyOpenValues, unknown>>,
) {
  const fullRequest = buildStudyRequest(values);
  const request: Record<string, unknown> = {};

  if (dirtyFields.studyName) request.study_name = values.studyName;
  if (dirtyFields.oneLiner) request.one_liner = values.oneLiner;
  if (dirtyFields.tags) request.study_tag_names = fullRequest.study_tag_names;
  if (dirtyFields.introduction) {
    request.goal = values.introduction;
    request.explanation = values.introduction;
  }
  if (dirtyFields.isOnline) request.is_online = values.isOnline;
  if (dirtyFields.location) request.location = values.location;
  if (dirtyFields.room) request.location_detail = values.room;
  if (dirtyFields.weekDay) request.week_day = Number(values.weekDay);
  if (dirtyFields.startTime) request.start_time = values.startTime;
  if (dirtyFields.endTime) request.end_time = values.endTime;
  if (dirtyFields.curriculum) {
    request.study_plan_list = fullRequest.study_plan_list;
  }
  if (dirtyFields.difficulty) request.difficulty = fullRequest.difficulty;
  if (dirtyFields.hasInterview) {
    request.requires_interview = values.hasInterview;
    request.interview_date = fullRequest.interview_date;
  } else if (dirtyFields.interviewDate) {
    request.interview_date = fullRequest.interview_date;
  }

  return request;
}

export async function submitStudyCreate(
  values: StudyOpenValues,
  applicationId?: number,
  dirtyFields: Partial<Record<keyof StudyOpenValues, unknown>> = {},
) {
  const studyRequest = buildStudyRequest(values);
  const requestPayload = applicationId
    ? buildStudyApplicationUpdateRequest(values, dirtyFields)
    : studyRequest;

  const formData = new FormData();
  formData.append(
    "studyRequest",
    new Blob([JSON.stringify(requestPayload)], { type: "application/json" }),
  );
  if (values.thumbnail) {
    formData.append("thumbnail", values.thumbnail);
  }
  if (!applicationId) {
    values.references.forEach((reference) => {
      if (isFileValue(reference.value)) {
        formData.append(REFERENCE_FILE_FIELD_NAME, reference.value);
      }
    });
  }

  const request = applicationId
    ? apiClient.patch(`api/v1/study-apply/${applicationId}`, { body: formData })
    : apiClient.post("api/v1/study-apply", { body: formData });
  const response = await request.json<ApiResponse<{ study_id: number }>>();

  return response;
}
