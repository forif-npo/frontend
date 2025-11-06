import type { DifficultyLevel, RecruitStatus } from "@/types/study";
import type { BadgeProps } from "@ui/components/server";

/**
 * 태그 옵션
 */
export const TAG_OPTIONS = [
  { value: "database", label: "데이터베이스" },
  { value: "basic", label: "프로그래밍 기초" },
  { value: "frontend", label: "프론트엔드" },
  { value: "backend", label: "백엔드" },
  { value: "fullstack", label: "풀스택" },
  { value: "app", label: "앱" },
  { value: "ai", label: "인공지능" },
  { value: "data", label: "데이터" },
  { value: "security", label: "보안" },
  { value: "game", label: "게임" },
  { value: "design", label: "디자인" },
  { value: "algorithm", label: "알고리즘" },
  { value: "blockchain", label: "블록체인" },
] as const;

/**
 * 난이도 옵션 (API 스펙 기준)
 */
export const DIFFICULTY_OPTIONS: Array<{
  value: DifficultyLevel;
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
 * 페이지 사이즈 옵션
 */
export const PAGE_SIZE_OPTIONS = [
  { value: 10, label: "10개" },
  { value: 20, label: "20개" },
  { value: 30, label: "30개" },
  { value: 50, label: "50개" },
] as const;
