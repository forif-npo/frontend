import { HACKATHON_STATUS_LABELS as SHARED_HACKATHON_STATUS_LABELS } from "@core/hackathon-status";
import type { HackathonStatus } from "@core/types/hackathon";

export type { Hackathon, SubmissionStatus } from "@core/types/hackathon";

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

export const HACKATHON_STATUS_LABELS: Record<HackathonStatus, string> = {
  ...SHARED_HACKATHON_STATUS_LABELS,
  // 운영 화면의 기존 표현을 그대로 유지한다.
  TEAM_BUILDING: "팀 빌딩",
};

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
