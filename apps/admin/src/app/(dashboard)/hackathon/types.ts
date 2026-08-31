import type { HackathonStatus } from "@core/types/hackathon";

export type { Hackathon, SubmissionStatus } from "@core/types/hackathon";
export { HACKATHON_STATUS_LABELS } from "@core/hackathon-status";

/**
 * 해커톤 상태 라벨/순서
 */
export const HACKATHON_STATUS_FLOW: HackathonStatus[] = [
  "RECRUITING",
  "TEAM_BUILDING",
  "IN_PROGRESS",
  "JUDGING",
  "ENDED",
];

/**
 * 해커톤 생성/수정 폼 상태
 */
export interface HackathonFormState {
  held_year: string;
  held_semester: string;
  title: string;
  description: string;
  location: string;
  recruit_starts_at: string;
  recruit_ends_at: string;
  team_building_starts_at: string;
  team_building_ends_at: string;
  starts_at: string;
  ends_at: string;
  duration_hours: string;
}
