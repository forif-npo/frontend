import { Study, StudyDifficulty } from "@/types/study";

export type BadgeVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "disabled"
  | "info";

export type BadgeTag = {
  label: string;
  variant: BadgeVariant;
};

const DIFFICULTY_LABEL: Record<StudyDifficulty, string> = {
  EASY: "쉬움",
  SEMI_EASY: "조금 쉬움",
  NORMAL: "보통",
  SEMI_HARD: "조금 어려움",
  HARD: "어려움",
};

export function getStudyBadgeTags(study: Study): BadgeTag[] {
  const statusBadge: BadgeTag = {
    label: study.recruit_status === "APPLICABLE" ? "지원중" : "마감",
    variant: study.recruit_status === "APPLICABLE" ? "info" : "disabled",
  };

  const tagBadges: BadgeTag[] = study.tags.slice(0, 2).map((tag, idx) => ({
    label: tag,
    variant: (idx === 0 ? "danger" : "primary") as BadgeVariant,
  }));

  const difficultyBadge: BadgeTag = {
    label: DIFFICULTY_LABEL[study.difficulty] || study.difficulty,
    variant: "primary",
  };

  return [statusBadge, ...tagBadges, difficultyBadge];
}
