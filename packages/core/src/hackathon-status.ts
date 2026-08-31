import type { HackathonStatus } from "./types/hackathon";

/** 부원 화면에서 사용하는 해커톤 진행 상태 표시명이다. */
export const HACKATHON_STATUS_LABELS: Record<HackathonStatus, string> = {
  RECRUITING: "모집중",
  TEAM_BUILDING: "팀 구성",
  IN_PROGRESS: "진행중",
  JUDGING: "심사중",
  ENDED: "종료",
};
