import { Member } from "@core/types/member";
import { z } from "zod/v4";
import { createSchema } from "../utils/schema.util";

export const signUpSchema = createSchema<Member>()(
  z.object({
    email: z.email().min(1, "이메일을 입력해주세요."),

    id: z
      .string()
      .min(1, "학번을 입력해주세요.")
      .length(10, "학번은 10자리여야 합니다.")
      .refine((val) => !isNaN(Number(val)), {
        message: "학번은 숫자만 입력 가능합니다.",
      }),

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

/**
 * 부원 로그인 스키마 (Google OAuth용)
 */
export const userLoginSchema = z.object({
  accessToken: z.string().min(1, "Google Access Token이 필요합니다."),
});

export type UserLoginValues = z.infer<typeof userLoginSchema>;

/**
 * 스태프(멘토/운영진) 로그인 스키마
 */
export const staffLoginSchema = z.object({
  userId: z
    .string()
    .min(1, "학번을 입력해주세요.")
    .refine((val) => !isNaN(Number(val)), {
      message: "학번은 숫자만 입력 가능합니다.",
    }),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

export type StaffLoginValues = z.infer<typeof staffLoginSchema>;
