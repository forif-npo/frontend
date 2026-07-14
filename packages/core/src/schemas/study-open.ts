import { z } from "zod/v4";
import { createSchema } from "../utils/schema.util";

const isFileValue = (value: unknown): value is File | null =>
  value === null || (typeof File !== "undefined" && value instanceof File);

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
const shortDateRegex = /^\d{6}$/;

function isValidShortDate(value: string) {
  if (!shortDateRegex.test(value)) return false;

  const year = 2000 + Number(value.slice(0, 2));
  const month = Number(value.slice(2, 4));
  const day = Number(value.slice(4, 6));
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export const studyOpenSchema = createSchema()(
  z
    .object({
      // Step 1: 신청 정보 확인
      mentorIds: z.array(z.number()).default([]),

      // Step 2: 스터디 개요 및 일정
      studyName: z
        .string()
        .min(1, "스터디명을 입력해주세요.")
        .max(50, "스터디명은 최대 50자까지 입력 가능합니다."),
      oneLiner: z
        .string()
        .min(1, "한 줄 설명을 입력해주세요.")
        .max(100, "한 줄 설명은 최대 100자까지 입력 가능합니다."),
      tags: z
        .array(z.string())
        .min(1, "태그를 최소 1개 이상 선택해주세요.")
        .max(4, "태그는 최대 4개까지 선택 가능합니다."),
      thumbnail: z.custom<File | null>(isFileValue).default(null),
      introduction: z
        .string()
        .min(50, "스터디 소개는 최소 50자 이상 작성해주세요.")
        .max(500, "스터디 소개는 최대 500자까지 입력 가능합니다."),
      isOnline: z.boolean().default(false),
      location: z.string().min(1, "진행 장소를 선택해주세요."),
      room: z
        .string()
        .max(50, "강의실(호)은 최대 50자까지 입력 가능합니다.")
        .default(""),
      weekDay: z.string().min(1, "요일을 선택해주세요."),
      startTime: z
        .string()
        .min(1, "시작 시간을 입력해주세요.")
        .regex(timeRegex, "올바른 시작 시간을 입력해주세요."),
      endTime: z
        .string()
        .min(1, "종료 시간을 입력해주세요.")
        .regex(timeRegex, "올바른 종료 시간을 입력해주세요."),

      // Step 3: 주차별 계획
      curriculum: z
        .array(
          z.object({
            week: z.number(),
            date: z
              .string()
              .min(1, "진행 날짜를 입력해주세요.")
              .regex(
                shortDateRegex,
                "진행 날짜는 YYMMDD 형식으로 입력해주세요.",
              )
              .refine(isValidShortDate, "올바른 진행 날짜를 입력해주세요."),
            topic: z.string().min(1, "주제를 입력해주세요."),
            contents: z
              .array(z.string().min(1, "내용을 입력해주세요."))
              .min(1, "내용을 최소 1개 이상 입력해주세요."),
          }),
        )
        .min(8, "8주차 이상 커리큘럼을 작성해주세요."),

      // Step 4: 난이도 및 운영 방식
      difficulty: z.string().min(1, "난이도를 선택해주세요."),
      hasInterview: z.boolean().default(false),
      interviewDate: z.string().nullable().default(null),
      references: z
        .array(
          z.object({
            type: z.string().min(1, "유형을 선택해주세요."),
            value: z.string().min(1, "값을 입력해주세요."),
          }),
        )
        .default([]),
    })
    .superRefine((values, ctx) => {
      if (values.location !== "장소 미정" && !values.room) {
        ctx.addIssue({
          code: "custom",
          path: ["room"],
          message: "강의실(호)을 입력해주세요.",
        });
      }
    }),
);

export type StudyOpenValues = z.infer<typeof studyOpenSchema>;
