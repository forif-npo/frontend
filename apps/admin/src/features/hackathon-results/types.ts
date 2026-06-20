export type ResultTrack = "HACKATHON" | "IDEATHON";

export interface AwardResult {
  id: string;
  track: ResultTrack;
  /** 관리 화면 팀 데이터에서 선택한 팀 id (수동 입력 시 null) */
  hackathonTeamId: number | null;
  teamName: string;
  /** 순위. 특별상 등 순위가 없는 경우 null */
  rank: number | null;
  members: string[];
  /** 동일 순위·특별상 간 안정적인 정렬을 위한 입력 순서 */
  presentationOrder: number;
}

export interface HackathonResultDraft {
  version: 1;
  hackathonId: number;
  eventTitle: string;
  updatedAt: string;
  results: AwardResult[];
}

export const TRACK_LABELS: Record<ResultTrack, string> = {
  IDEATHON: "아이디어톤",
  HACKATHON: "해커톤",
};

// 발표 슬라이드는 IDEATHON → HACKATHON 순서로 공개한다.
export const TRACK_ORDER: readonly ResultTrack[] = ["IDEATHON", "HACKATHON"];
