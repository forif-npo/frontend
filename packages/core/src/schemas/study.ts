import { z } from "zod/v4";
import { createSchema } from "../utils/schema.util";

export const studyApplySchema = createSchema()(
  z.object({
    primaryStudyId: z.number().int(),
    primaryStudyApplyReason: z
      .string()
      .min(50, "지원 사유는 최소 50자 이상이어야 합니다.")
      .max(500, "지원 사유는 최대 500자 이하여야 합니다."),
  }),
);

export type StudyApplyValues = z.infer<typeof studyApplySchema>;
