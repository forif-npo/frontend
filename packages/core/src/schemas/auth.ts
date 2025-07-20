import { Member } from "@core/types/member";
import { z } from "zod/v4";
import { createSchema } from "../utils/schema.util";

export const signUpSchema = createSchema<Member & { referralSource: string }>()(
  z
    .object({
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
      referralSource: z.string().min(1, "추천 경로를 선택해주세요."),
      serviceTermAgree: z.boolean(), // z.enum(["on", "off", "intermediate"])
      privacyPolicyAgree: z.boolean(),
    })
    .refine(
      (data) => {
        return data.serviceTermAgree && data.privacyPolicyAgree;
      },
      {
        error: "서비스 이용약관과 개인정보 수집에 모두 동의해주세요.",
        path: ["serviceTermAgree"],
      },
    ),
);

export type SignUpValues = z.infer<typeof signUpSchema>;
