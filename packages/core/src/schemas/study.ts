import { z } from "zod/v4";
import { createSchema } from "../utils/schema.util";

export const studyApplySchema = createSchema()(
  z
    .object({
      primaryStudyId: z
        .number({
          message: "1지망 스터디를 선택해주세요.",
        })
        .int("올바른 스터디를 선택해주세요."),
      primaryStudyApplyReason: z
        .string()
        .min(1, "1지망 스터디 지원 사유를 입력해주세요.")
        .min(50, "1지망 스터디 지원 사유는 최소 50자 이상이어야 합니다.")
        .max(500, "1지망 스터디 지원 사유는 최대 500자 이하여야 합니다."),
      secondaryStudyId: z.number().optional().nullable(),
      secondaryStudyApplyReason: z
        .string()
        .optional()
        .nullable()
        .refine(
          (val) => {
            if (!val) return true;
            return val.length >= 50 && val.length <= 500;
          },
          {
            message:
              "2지망 스터디 지원 사유는 50자 이상 500자 이하여야 합니다.",
          },
        ),
    })
    .refine(
      (data) => {
        // 2지망 스터디를 선택했다면 지원 사유도 필수
        if (data.secondaryStudyId && !data.secondaryStudyApplyReason) {
          return false;
        }
        return true;
      },
      {
        message: "2지망 스터디를 선택하셨다면 지원 사유를 입력해주세요.",
        path: ["secondaryStudyApplyReason"],
      },
    )
    .refine(
      (data) => {
        // 1지망과 2지망이 같으면 안됨
        if (
          data.secondaryStudyId &&
          data.primaryStudyId === data.secondaryStudyId
        ) {
          return false;
        }
        return true;
      },
      {
        message: "1지망과 2지망은 다른 스터디여야 합니다.",
        path: ["secondaryStudyId"],
      },
    ),
);

export type StudyApplyValues = z.infer<typeof studyApplySchema>;
