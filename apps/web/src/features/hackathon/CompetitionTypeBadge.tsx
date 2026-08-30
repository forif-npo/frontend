import type { CompetitionType } from "@core/types/hackathon";
import { Badge } from "@ui/components/server";

const COMPETITION_TYPE_BADGE = {
  IDEATHON: { label: "아이디어톤", variant: "info" },
  HACKATHON: { label: "해커톤", variant: "primary" },
} as const;

export function CompetitionTypeBadge({
  competitionType,
}: {
  competitionType: CompetitionType;
}) {
  const { label, variant } = COMPETITION_TYPE_BADGE[competitionType];
  return (
    <Badge
      label={label}
      variant={variant}
      appearance="solid-pastel"
      size="small"
    />
  );
}
