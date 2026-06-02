/**
 * 해커톤 상태
 */
export type HackathonStatus =
  | "RECRUITING"
  | "TEAM_BUILDING"
  | "IN_PROGRESS"
  | "JUDGING"
  | "ENDED";

export type ParticipantStatus = "REGISTERED" | "CANCELED";
export type JoinRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELED";
export type TeamStatus = "FORMING" | "CONFIRMED" | "DISBANDED";
export type TeamMemberRole = "LEADER" | "MEMBER";

/**
 * 해커톤 정보
 */
export interface Hackathon {
  hackathon_id: number;
  held_year: number;
  held_semester: number;
  event_round: number;
  title: string;
  description?: string;
  location?: string;
  status: HackathonStatus;
  recruit_starts_at?: string;
  recruit_ends_at?: string;
  team_building_starts_at?: string;
  team_building_ends_at?: string;
  starts_at: string;
  ends_at: string;
  server_time?: string;
}

/**
 * 참가자
 */
export interface Participant {
  participant_id: number;
  hackathon_id: number;
  user_id: number;
  user_name: string;
  status: ParticipantStatus;
  registered_at: string;
  canceled_at?: string;
}

/**
 * 팀 멤버
 */
export interface TeamMember {
  user_id: number;
  user_name: string;
  role: TeamMemberRole;
  joined_at: string;
}

/**
 * 팀
 */
export interface Team {
  hackathon_team_id: number;
  hackathon_id: number;
  name: string;
  topic?: string;
  description?: string;
  leader_id: number;
  leader_name: string;
  max_members?: number;
  member_count: number;
  status: TeamStatus;
  members: TeamMember[];
}

/**
 * 팀 가입 신청
 */
export interface JoinRequest {
  join_request_id: number;
  hackathon_id: number;
  hackathon_team_id: number;
  team_name: string;
  user_id: number;
  user_name: string;
  status: JoinRequestStatus;
  message?: string;
  reviewed_by?: number;
  reviewed_at?: string;
}

/**
 * 결과물 제출
 */
export interface Submission {
  submission_id: number;
  hackathon_id: number;
  team_id: number;
  team_name: string;
  project_name: string;
  summary: string;
  description?: string;
  github_url: string;
  deploy_url?: string;
  presentation_file?: string;
  tech_stacks: string[];
  created_at: string;
  updated_at: string;
}

/**
 * 제출 현황 (운영진용)
 */
export interface SubmissionStatus {
  hackathon_team_id: number;
  team_name: string;
  leader_id: number;
  leader_name: string;
  member_count: number;
  submitted: boolean;
  submission: Submission | null;
}

/**
 * 평가 기준
 */
export interface Criterion {
  criterion_id: number;
  hackathon_id: number;
  name: string;
  description?: string;
  max_score: number;
  weight: number;
  display_order: number;
}

/**
 * 평가 집계
 */
export interface EvaluationSummary {
  hackathon_team_id: number;
  team_name: string;
  average_total_score: number;
  total_score: number;
  evaluation_count: number;
  criterion_averages: Array<{
    criterion_id: number;
    criterion_name: string;
    average_score: number;
  }>;
}

/**
 * 수상
 */
export interface Award {
  award_id: number;
  hackathon_id: number;
  hackathon_team_id: number;
  team_name: string;
  award_name: string;
  award_rank?: number;
}

/**
 * 아카이브 해커톤 상세
 */
export interface ArchiveHackathonDetail extends Hackathon {
  participant_count: number;
  team_count: number;
  submission_count: number;
  awards: Award[];
}

/**
 * 아카이브 제출물 상세
 */
export interface ArchiveSubmissionDetail extends Submission {
  team_members: TeamMember[];
  awarded: boolean;
  awards: Award[];
}

/**
 * 해커톤 목록 조회 파라미터
 */
export interface HackathonsParams {
  year?: number;
  semester?: number;
  status?: HackathonStatus;
}

/**
 * 아카이브 제출물 조회 파라미터
 */
export interface ArchiveSubmissionsParams {
  search?: string;
  tech_stack?: string;
}

/**
 * 팀 생성 요청
 */
export interface CreateTeamRequest {
  name: string;
  topic?: string;
  description?: string;
  max_members?: number;
}

/**
 * 제출 요청 (JSON 파트)
 */
export interface SubmissionRequest {
  project_name: string;
  summary: string;
  description?: string;
  github_url: string;
  deploy_url?: string;
  tech_stacks: string[];
}
