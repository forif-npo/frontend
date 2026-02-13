import type { StudyOpenValues } from "@core/schemas";

export async function submitStudyCreate(values: StudyOpenValues) {
  // TODO: API 연결 시 이 함수만 수정
  console.log("Submitting study create:", values);
  return { success: true };
}

export async function saveDraft(values: Partial<StudyOpenValues>) {
  // TODO: API 연결 시 이 함수만 수정
  console.log("Saving draft:", values);
  return { success: true };
}
