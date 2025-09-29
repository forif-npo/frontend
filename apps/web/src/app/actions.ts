"use server";
import { auth, signIn } from "@/auth";
import {
  mentorSignInSchema,
  MentorSignInValues,
  SignUpValues,
} from "@core/schemas";

export const signInWithGoogle = async () => {
  await signIn("google", { redirectTo: "/signup" });
};

export const signUp = async (data: SignUpValues) => {
  // throw new Error("Unknown error")
  console.log(data);
};

// 멘토 로그인 Server Action
export const mentorSignIn = async (
  _: {
    errors: Record<string, { message: string }>;
    values: MentorSignInValues;
  },
  formData: FormData,
) => {
  const values: MentorSignInValues = {
    studentId: String(formData.get("studentId") || ""),
    password: String(formData.get("password") || ""),
  };

  const { error: parseError } = mentorSignInSchema.safeParse(values);
  const errors: Record<string, { message: string }> = {};

  for (const { path, message } of parseError?.issues || []) {
    errors[path.join(".")] = { message };
  }

  if (Object.keys(errors).length > 0) {
    return {
      values,
      errors,
    };
  }

  try {
    // TODO: 실제 인증 로직 구현
    // 예시: await authenticateMentor(values.studentId, values.password);

    console.log("Mentor sign in attempt:", {
      studentId: values.studentId,
      // password는 로그에 남기지 않음
    });

    // 인증 성공 시 리디렉션 (예시)
    // redirect("/mentor-dashboard");

    // 현재는 임시로 성공 처리
    return {
      values: { studentId: "", password: "" },
      errors: {},
    };
  } catch (error) {
    errors["root"] = {
      message:
        error instanceof Error ? error.message : "로그인에 실패했습니다.",
    };

    return {
      values,
      errors,
    };
  }
};

export { auth as getSession };
