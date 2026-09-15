import type { Participant, Team } from "@core/types/hackathon";

export const PARTICIPANT_STATUS_LABELS: Record<Participant["status"], string> =
  {
    REGISTERED: "참가",
    CANCELED: "취소",
  };

export const TEAM_STATUS_LABELS: Record<Team["status"], string> = {
  FORMING: "구성중",
  CONFIRMED: "확정",
  DISBANDED: "해산",
};

export function formatDate(value?: string) {
  if (!value) return "-";
  return value.replace("T", " ").slice(0, 16);
}

export type CriterionForm = {
  name: string;
  description: string;
  max_score: string;
  weight: string;
  display_order: string;
};

export type AwardForm = {
  hackathon_team_id: string;
  award_name: string;
  award_rank: string;
};

export const EMPTY_CRITERION: CriterionForm = {
  name: "",
  description: "",
  max_score: "10",
  weight: "1",
  display_order: "1",
};

export const EMPTY_AWARD: AwardForm = {
  hackathon_team_id: "",
  award_name: "",
  award_rank: "",
};
