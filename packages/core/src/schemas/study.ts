import { z } from "zod/v4";
import { createSchema } from "../utils/schema.util";

export const studyApplySchema = createSchema()(
  z
    .object({
      primaryStudyId: z.number().int(),
      isAutonomousStudy: z.boolean(),
      priority: z.union([z.literal(1), z.literal(2)]).optional(),
      primaryStudyApplyReason: z.string().optional(),
    })
    .superRefine((values, context) => {
      if (values.isAutonomousStudy) return;

      if (values.priority === undefined) {
        context.addIssue({
          code: "custom",
          path: ["priority"],
          message: "지원순위를 선택해주세요.",
        });
      }

      const applyReason = values.primaryStudyApplyReason ?? "";
      if (applyReason.length < 50) {
        context.addIssue({
          code: "custom",
          path: ["primaryStudyApplyReason"],
          message: "지원 사유는 최소 50자 이상이어야 합니다.",
        });
      }
      if (applyReason.length > 500) {
        context.addIssue({
          code: "custom",
          path: ["primaryStudyApplyReason"],
          message: "지원 사유는 최대 500자 이하여야 합니다.",
        });
      }
    }),
);

export type StudyApplyValues = z.infer<typeof studyApplySchema>;
