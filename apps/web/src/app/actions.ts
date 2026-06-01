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

  const response = await apiClient
    .post("api/v1/users/apply", {
      json: {
        study_id: data.primaryStudyId,
        apply_reason: data.primaryStudyApplyReason,
        priority: 1,
      },
    })
    .json<{ message: string; data: null }>();

  return response;
};

export { auth as getSession };
