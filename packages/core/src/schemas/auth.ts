import { z } from "zod/v4";
import { createSchema } from "../utils/schema.util";

export const signUpSchema = createSchema<User & { referral_source: string }>()(
  z.object({
    email: z.email().min(1, "이메일을 입력해주세요"),
    id: z.string().length(10, "학번을 입력해주세요").default(""),
    name: z.string().min(1, "이름을 입력해주세요"),
    department: z.string().min(1, "학과를 선택해주세요"),
    phone_number: z
      .string()
      .min(1, "휴대폰 번호를 입력해주세요")
      .regex(/^\d{3}-\d{4}-\d{4}$/, "전화번호 형식이 일치하지 않습니다."),
    referral_source: z.string().min(1, "가입하게 된 경로를 선택해주세요"),
  }),
);

export type SignUpValues = z.infer<typeof signUpSchema>;
