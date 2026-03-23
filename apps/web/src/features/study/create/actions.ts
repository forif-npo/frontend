import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import type { StudyOpenValues } from "@core/schemas";

const DIFFICULTY_MAP: Record<string, number> = {
  EASY: 1,
  SEMI_EASY: 2,
  NORMAL: 3,
  SEMI_HARD: 4,
  HARD: 5,
};

function buildStudyRequest(values: StudyOpenValues) {
  return {
    title: values.studyName,
    sub_title: values.oneLiner,
    study_tag_id: values.tags.map((_, i) => i + 1), // TODO: map tag names to actual IDs
    goal: values.introduction, // Figma removed goal; reuse introduction
    explanation: values.introduction,
    is_online: values.isOnline,
    study_location: values.location,
    study_location_detail: values.room || "",
    week_day: Number(values.weekDay),
    start_time: values.startTime,
    end_time: values.endTime,
    study_plan_list: values.curriculum.flatMap((week) =>
      week.contents.map((content) => ({
        week_num: week.week,
        date: week.date || null,
        topic: week.topic,
        content,
      })),
    ),
    difficulty: DIFFICULTY_MAP[values.difficulty] ?? 3,
    selection_criteria: "",
    capacity: 30,
    requires_interview: values.hasInterview,
    interview_date: values.interviewDate || null,
    references: values.references.map((ref) => ({
      type: ref.type === "LINK" ? "URL" : "FILE",
      url: ref.type === "LINK" ? ref.value : null,
      file_name: ref.type === "DOWNLOAD" ? ref.value : null,
    })),
  };
}

export async function submitStudyCreate(values: StudyOpenValues) {
  const studyRequest = buildStudyRequest(values);

  const formData = new FormData();
  formData.append(
    "studyRequest",
    new Blob([JSON.stringify(studyRequest)], { type: "application/json" }),
  );

  const response = await apiClient
    .post("api/v1/study-apply", { body: formData })
    .json<ApiResponse<{ study_apply_id: number }>>();

  return response;
}

export async function saveDraft(values: Partial<StudyOpenValues>) {
  // Draft saving - store locally for now
  localStorage.setItem("study-create-draft", JSON.stringify(values));
  return { success: true };
}
