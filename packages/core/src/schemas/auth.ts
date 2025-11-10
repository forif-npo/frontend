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
  studentId: z.string().min(1, "학번을 입력해주세요."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

export type MentorSignInValues = z.infer<typeof mentorSignInSchema>;
