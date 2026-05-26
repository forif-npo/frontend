"use server";
import { auth, signIn } from "@/auth";
import { SignUpValues, StudyApplyValues } from "@core/schemas";
import { apiClient } from "@core/utils/api-client";

export const signInWithGoogle = async () => {
  await signIn("google", { redirectTo: "/signup" });
};

export const signUp = async (data: SignUpValues) => {
  // throw new Error("Unknown error")
  console.log(data);
};

export const applyStudy = async (data: StudyApplyValues) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("로그인이 필요합니다.");
  }

  // Prepare request body (backend expects snake_case)
  const requestBody: {
    primary_study_id: number;
    primary_study_apply_reason: string;
    secondary_study_id?: number;
    secondary_study_apply_reason?: string;
  } = {
    primary_study_id: data.primaryStudyId,
    primary_study_apply_reason: data.primaryStudyApplyReason,
  };

  // Only include secondary fields if they exist
  if (data.secondaryStudyId && data.secondaryStudyApplyReason) {
    requestBody.secondary_study_id = data.secondaryStudyId;
    requestBody.secondary_study_apply_reason = data.secondaryStudyApplyReason;
  }

  const response = await apiClient
    .post("api/v1/studies/apply", {
      json: requestBody,
    })
    .json<{ message: string; data: null }>();

  return response;
};

export { auth as getSession };
