"use server";
import { auth, signIn } from "@/auth";
import { SignUpValues, StudyApplyValues } from "@core/schemas";
import { kvInstance } from "@/api/client";

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

  // Prepare request body
  const requestBody: {
    primaryStudyId: number;
    primaryStudyApplyReason: string;
    secondaryStudyId?: number;
    secondaryStudyApplyReason?: string;
  } = {
    primaryStudyId: data.primaryStudyId,
    primaryStudyApplyReason: data.primaryStudyApplyReason,
  };

  // Only include secondary fields if they exist
  if (data.secondaryStudyId && data.secondaryStudyApplyReason) {
    requestBody.secondaryStudyId = data.secondaryStudyId;
    requestBody.secondaryStudyApplyReason = data.secondaryStudyApplyReason;
  }

  // Make API request
  const response = await kvInstance
    .post("api/v1/study/apply", {
      json: requestBody,
    })
    .json<{ message: string; data: null }>();

  return response;
};

export { auth as getSession };
