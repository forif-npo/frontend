import type { RecruitStatus } from "@/types/study";
import type { BadgeProps } from "@ui/components/server";
import { STUDY_RECRUIT_STATUS_LABELS } from "@core/study-status";

/**
 * 난이도 옵션 (API 스펙 기준)
 */
export const DIFFICULTY_OPTIONS: Array<{
  value: string;
  label: string;
  variant: BadgeProps["variant"];
}> = [
  { value: "EASY", label: "쉬움", variant: "success" },
  { value: "SEMI_EASY", label: "조금 쉬움", variant: "success" },
  { value: "NORMAL", label: "보통", variant: "warning" },
  { value: "SEMI_HARD", label: "조금 어려움", variant: "danger" },
  { value: "HARD", label: "어려움", variant: "danger" },
];

export const STUDY_DIFFICULTY_GUIDE = [
  {
    label: "쉬움",
    stars: "★",
    description:
      "프로그래밍이 처음이거나 기초부터 차근차근 배우고 싶은 분에게 추천합니다.",
  },
  {
    label: "조금 쉬움",
    stars: "★★",
    description:
      "기초 문법을 학습했거나, 첫 프로젝트를 경험해 보고 싶은 분에게 추천합니다.",
  },
  {
    label: "보통",
    stars: "★★★",
    description:
      "프로그래밍 경험이 있으며, 간단한 프로젝트를 진행해 본 분에게 추천합니다.",
  },
  {
    label: "조금 어려움",
    stars: "★★★★",
    description:
      "관련 전공 수준의 기초 지식이나 프로젝트 경험을 바탕으로 심화 내용을 학습하고 싶은 분에게 추천합니다.",
  },
  {
    label: "어려움",
    stars: "★★★★★",
    description:
      "실무 수준의 기술이나 고난도 프로젝트를 다루며, 충분한 개발 경험이 있는 분에게 추천합니다.",
  },
] as const;

/**
 * 모집 상태 옵션 (API 스펙 기준)
 */
export const RECRUIT_STATUS_OPTIONS: Array<{
  value: RecruitStatus;
  label: string;
  variant: BadgeProps["variant"];
}> = [
  {
    value: "APPLICABLE",
    label: STUDY_RECRUIT_STATUS_LABELS.APPLICABLE,
    variant: "success",
  },
  {
    value: "CLOSED",
    label: STUDY_RECRUIT_STATUS_LABELS.CLOSED,
    variant: "disabled",
  },
];

/**
 * 난이도 숫자 라벨 (my-page API 기준, 1-5)
 */
export const NUMERIC_DIFFICULTY_LABELS: Record<number, string> = {
  1: "쉬움",
  2: "조금 쉬움",
  3: "보통",
  4: "조금 어려움",
  5: "어려움",
};

/**
 * 지원 상태 라벨 (my-page API 기준, 0-3)
 */
export const APPLICATION_STATUS_LABELS: Record<number, string> = {
  0: "지원중",
  1: "합격",
  2: "불합격",
  3: "취소",
};

/**
 * 페이지 사이즈 옵션
 */
export const PAGE_SIZE_OPTIONS = [
  { value: 10, label: "10개" },
  { value: 20, label: "20개" },
  { value: 30, label: "30개" },
  { value: 50, label: "50개" },
] as const;
