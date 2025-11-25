import { Study } from "@/types/study";

export type BadgeVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "disabled";

export type BadgeTag = {
  label: string;
  variant: BadgeVariant;
};

export function getStudyBadgeTags(study: Study): BadgeTag[] {
  const statusBadge: BadgeTag = {
    label: study.recruit_status === "APPLICABLE" ? "신청중" : "마감",
    variant: study.recruit_status === "APPLICABLE" ? "success" : "disabled",
  };

  const tagBadges: BadgeTag[] = study.tags.slice(0, 2).map((tag, idx) => ({
    label: tag,
    variant: (idx === 0 ? "danger" : "primary") as BadgeVariant,
  }));

  return [statusBadge, ...tagBadges];
}
