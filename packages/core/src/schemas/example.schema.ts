import { z } from "zod";
import { createSchema } from "./schema.js";

export const signInSchema = createSchema<User>()(
  z.object({
    id: z.number(),
    name: z.string().min(1, "이름을 입력해주세요"),
    department: z.string().min(1, "학과를 선택해주세요"),
  }),
);

export const signUpSchema = createSchema<User & { referral_source: string }>()(
  z.object({
    id: z.number(),
    name: z.string().min(1, "이름을 입력해주세요"),
    department: z.string().min(1, "학과를 선택해주세요"),
    referral_source: z.string().min(1, "가입하게 된 경로를 선택해주세요"),
  }),
);
