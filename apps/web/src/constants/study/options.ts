import type { RecruitStatus } from "@/types/study";
import type { BadgeProps } from "@ui/components/server";

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

/**
 * 모집 상태 옵션 (API 스펙 기준)
 */
export const RECRUIT_STATUS_OPTIONS: Array<{
  value: RecruitStatus;
  label: string;
  variant: BadgeProps["variant"];
}> = [
  { value: "APPLICABLE", label: "모집 중", variant: "success" },
  { value: "CLOSED", label: "모집 마감", variant: "disabled" },
];

/**
 * 난이도 숫자 라벨 (my-page API 기준, 1-5)
 */
export const NUMERIC_DIFFICULTY_LABELS: Record<number, string> = {
  1: "매우 쉬움",
  2: "쉬움",
  3: "보통",
  4: "어려움",
  5: "매우 어려움",
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
