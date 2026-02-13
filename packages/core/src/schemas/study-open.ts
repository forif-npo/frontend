import { z } from "zod/v4";
import { createSchema } from "../utils/schema.util";

export const studyOpenSchema = createSchema()(
  z.object({
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
    goal: z
      .string()
      .min(50, "목표는 최소 50자 이상 작성해주세요.")
      .max(500, "목표는 최대 500자까지 입력 가능합니다."),
    introduction: z
      .string()
      .min(50, "스터디 소개는 최소 50자 이상 작성해주세요.")
      .max(500, "스터디 소개는 최대 500자까지 입력 가능합니다."),
    isOnline: z.boolean().default(false),
    location: z.string().min(1, "진행 장소를 선택해주세요."),
    room: z.string().optional().default(""),
    weekDay: z.string().min(1, "요일을 선택해주세요."),
    startTime: z
      .string()
      .min(1, "시작 시간을 입력해주세요.")
      .regex(/^\d{2}:\d{2}$/, "HH:MM 형식으로 입력해주세요."),
    endTime: z
      .string()
      .min(1, "종료 시간을 입력해주세요.")
      .regex(/^\d{2}:\d{2}$/, "HH:MM 형식으로 입력해주세요."),

    // Step 3: 주차별 계획
    curriculum: z
      .array(
        z.object({
          week: z.number(),
          date: z.string(),
          topic: z.string().min(1, "주제를 입력해주세요."),
          contents: z
            .array(z.string().min(1, "내용을 입력해주세요."))
            .min(1, "내용을 최소 1개 이상 입력해주세요."),
        }),
      )
      .length(8, "8주차 커리큘럼을 모두 작성해주세요."),

    // Step 4: 추천대상 및 운영 방식
    difficulty: z.string().min(1, "난이도를 선택해주세요."),
    selectionCriteria: z
      .string()
      .min(1, "선정 기준을 입력해주세요.")
      .max(100, "선정 기준은 최대 100자까지 입력 가능합니다."),
    maxMembers: z
      .number({ message: "모집 인원을 입력해주세요." })
      .int("정수를 입력해주세요.")
      .min(1, "최소 1명 이상이어야 합니다.")
      .max(50, "최대 50명까지 가능합니다."),
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
  }),
);

export type StudyOpenValues = z.infer<typeof studyOpenSchema>;
