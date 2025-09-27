import { Member } from "@core/types/member";
import { z } from "zod/v4";
import { createSchema } from "../utils/schema.util";

export const signUpSchema = createSchema<Member>()(
  z.object({
    email: z.email().min(1, "이메일을 입력해주세요."),

    id: z
      .string()
      .min(1, "학번을 입력해주세요.")
      .length(10, "학번은 10자리여야 합니다."),

    name: z.string().min(1, "이름을 입력해주세요."),
    department: z.string().min(1, "학과를 선택해주세요."),
    phoneNumber: z
      .string()
      .min(1, "전화번호를 입력해주세요.")
      .regex(
        /^\d{3}-\d{4}-\d{4}$/,
        "전화번호를 010-1234-5678 형식으로 입력해주세요.",
      ),
    serviceTermAgree: z.boolean().refine((val) => val === true, {
      message: "서비스 이용약관에 동의해주세요.",
    }),
    privacyPolicyAgree: z.boolean().refine((val) => val === true, {
      message: "개인정보 수집에 동의해주세요.",
    }),
  }),
);

export type SignUpValues = z.infer<typeof signUpSchema>;

// 멘토 로그인 스키마
export const mentorSignInSchema = z.object({
  studentId: z
    .string()
    .min(1, "학번을 입력해주세요.")
    .length(10, "학번은 10자리여야 합니다.")
    .regex(/^\d{10}$/, "학번은 숫자 10자리여야 합니다."),
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요.")
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
    .max(20, "비밀번호는 최대 20자 이하여야 합니다.")
    .refine(
      (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        // 대문자, 소문자, 숫자, 특수문자 중 2개 이상의 조합 확인
        const criteriaCount = [
          hasUpperCase,
          hasLowerCase,
          hasNumbers,
          hasSpecialChar,
        ].filter(Boolean).length;
        return criteriaCount >= 2;
      },
      {
        message:
          "비밀번호는 대문자, 소문자, 숫자, 특수문자 중 2가지 이상을 포함해야 합니다.",
      },
    ),
});

export type MentorSignInValues = z.infer<typeof mentorSignInSchema>;
