import { apiClient } from "../utils/api-client";
import type { CursorPageResponse } from "../types/api";
import type {
  ArchiveHackathonDetail,
  ArchiveSubmissionDetail,
  ArchiveSubmissionsParams,
  Award,
  CreateTeamRequest,
  Criterion,
  EvaluationSummary,
  Hackathon,
  HackathonsParams,
  JoinRequest,
  JoinRequestStatus,
  Participant,
  Submission,
  SubmissionStatus,
  Team,
} from "../types/hackathon";

/**
 * 해커톤 목록 조회
 * GET /api/v1/hackathons
 */
export const getHackathons = async (
  params?: HackathonsParams,
): Promise<Hackathon[]> => {
  const searchParams = new URLSearchParams();
  if (params?.year) searchParams.set("year", String(params.year));
  if (params?.semester) searchParams.set("semester", String(params.semester));
  if (params?.status) searchParams.set("status", params.status);

  const res = await apiClient
    .get("api/v1/hackathons", { searchParams })
    .json<{ data: CursorPageResponse<Hackathon> }>();
  return res.data.content;
};

/**
 * 해커톤 상세 조회
 * GET /api/v1/hackathons/{hackathonId}
 */
export const getHackathon = async (hackathonId: number): Promise<Hackathon> => {
  const res = await apiClient
    .get(`api/v1/hackathons/${hackathonId}`)
    .json<{ data: Hackathon }>();
  return res.data;
};

/**
 * 참가 신청
 * POST /api/v1/hackathons/{hackathonId}/participants/me
 */
export const registerParticipant = async (
  hackathonId: number,
): Promise<Participant> => {
  const res = await apiClient
    .post(`api/v1/hackathons/${hackathonId}/participants/me`)
    .json<{ data: Participant }>();
  return res.data;
};

/**
 * 내 참가 상태 조회
 * GET /api/v1/hackathons/{hackathonId}/participants/me
 */
export const getMyParticipant = async (
  hackathonId: number,
): Promise<Participant> => {
  const res = await apiClient
    .get(`api/v1/hackathons/${hackathonId}/participants/me`)
    .json<{ data: Participant }>();
  return res.data;
};

/**
 * 팀 목록 조회
 * GET /api/v1/hackathons/{hackathonId}/teams
 */
export const getTeams = async (hackathonId: number): Promise<Team[]> => {
  const res = await apiClient
    .get(`api/v1/hackathons/${hackathonId}/teams`)
    .json<{ data: CursorPageResponse<Team> }>();
  return res.data.content;
};

/**
 * 팀 생성
 * POST /api/v1/hackathons/{hackathonId}/teams
 */
export const createTeam = async (
  hackathonId: number,
  body: CreateTeamRequest,
): Promise<Team> => {
  const res = await apiClient
    .post(`api/v1/hackathons/${hackathonId}/teams`, { json: body })
    .json<{ data: Team }>();
  return res.data;
};

/**
 * 팀 가입 신청
 * POST /api/v1/hackathons/{hackathonId}/teams/{teamId}/join-requests
 */
export const createJoinRequest = async (
  hackathonId: number,
  teamId: number,
  body: { message?: string },
): Promise<JoinRequest> => {
  const res = await apiClient
    .post(`api/v1/hackathons/${hackathonId}/teams/${teamId}/join-requests`, {
      json: body,
    })
    .json<{ data: JoinRequest }>();
  return res.data;
};

/**
 * 팀 가입 신청 목록
 * GET /api/v1/hackathons/{hackathonId}/teams/{teamId}/join-requests
 */
export const getJoinRequests = async (
  hackathonId: number,
  teamId: number,
  status?: JoinRequestStatus,
): Promise<JoinRequest[]> => {
  const searchParams = new URLSearchParams();
  if (status) searchParams.set("status", status);

  const res = await apiClient
    .get(`api/v1/hackathons/${hackathonId}/teams/${teamId}/join-requests`, {
      searchParams,
    })
    .json<{ data: CursorPageResponse<JoinRequest> }>();
  return res.data.content;
};

/**
 * 팀 가입 승인/거절
 * PATCH /api/v1/hackathons/{hackathonId}/join-requests/{requestId}/approve|reject
 */
export const reviewJoinRequest = async (
  hackathonId: number,
  requestId: number,
  decision: "approve" | "reject",
): Promise<JoinRequest> => {
  const res = await apiClient
    .patch(
      `api/v1/hackathons/${hackathonId}/join-requests/${requestId}/${decision}`,
    )
    .json<{ data: JoinRequest }>();
  return res.data;
};

/**
 * 결과물 제출/수정
 * POST|PUT /api/v1/hackathons/{hackathonId}/teams/{teamId}/submission
 */
export const submitProject = async (
  hackathonId: number,
  teamId: number,
  formData: FormData,
  method: "POST" | "PUT" = "POST",
): Promise<Submission> => {
  const options = { body: formData };
  const res =
    method === "POST"
      ? await apiClient
          .post(
            `api/v1/hackathons/${hackathonId}/teams/${teamId}/submission`,
            options,
          )
          .json<{ data: Submission }>()
      : await apiClient
          .put(
            `api/v1/hackathons/${hackathonId}/teams/${teamId}/submission`,
            options,
          )
          .json<{ data: Submission }>();
  return res.data;
};

/**
 * 운영진 제출 현황
 * GET /api/v1/admin/hackathons/{hackathonId}/submissions
 */
export const getSubmissionStatuses = async (
  hackathonId: number,
): Promise<SubmissionStatus[]> => {
  const res = await apiClient
    .get(`api/v1/admin/hackathons/${hackathonId}/submissions`)
    .json<{ data: CursorPageResponse<SubmissionStatus> }>();
  return res.data.content;
};

/**
 * 평가 기준 조회
 * GET /api/v1/hackathons/{hackathonId}/criteria
 */
export const getCriteria = async (
  hackathonId: number,
): Promise<Criterion[]> => {
  const res = await apiClient
    .get(`api/v1/hackathons/${hackathonId}/criteria`)
    .json<{ data: CursorPageResponse<Criterion> }>();
  return res.data.content;
};

/**
 * 평가 제출
 * POST /api/v1/hackathons/{hackathonId}/teams/{teamId}/evaluations
 */
export const submitEvaluation = async (
  hackathonId: number,
  teamId: number,
  scores: Array<{ criterion_id: number; score: number }>,
): Promise<void> => {
  await apiClient.post(
    `api/v1/hackathons/${hackathonId}/teams/${teamId}/evaluations`,
    { json: { scores } },
  );
};

/**
 * 평가 집계 (운영진)
 * GET /api/v1/admin/hackathons/{hackathonId}/evaluations/summary
 */
export const getEvaluationSummary = async (
  hackathonId: number,
): Promise<EvaluationSummary[]> => {
  const res = await apiClient
    .get(`api/v1/admin/hackathons/${hackathonId}/evaluations/summary`)
    .json<{ data: CursorPageResponse<EvaluationSummary> }>();
  return res.data.content;
};

/**
 * 수상 결과 등록 (운영진)
 * POST /api/v1/admin/hackathons/{hackathonId}/awards
 */
export const createAward = async (
  hackathonId: number,
  body: { hackathon_team_id: number; award_name: string; award_rank?: number },
): Promise<Award> => {
  const res = await apiClient
    .post(`api/v1/admin/hackathons/${hackathonId}/awards`, { json: body })
    .json<{ data: Award }>();
  return res.data;
};

/**
 * 아카이브 해커톤 목록
 * GET /api/v1/archive/hackathons
 */
export const getArchiveHackathons = async (): Promise<Hackathon[]> => {
  const res = await apiClient
    .get("api/v1/archive/hackathons")
    .json<{ data: CursorPageResponse<Hackathon> }>();
  return res.data.content;
};

/**
 * 아카이브 해커톤 상세
 * GET /api/v1/archive/hackathons/{hackathonId}
 */
export const getArchiveHackathon = async (
  hackathonId: number,
): Promise<ArchiveHackathonDetail> => {
  const res = await apiClient
    .get(`api/v1/archive/hackathons/${hackathonId}`)
    .json<{ data: ArchiveHackathonDetail }>();
  return res.data;
};

/**
 * 아카이브 제출물 목록
 * GET /api/v1/archive/hackathons/{hackathonId}/submissions
 */
export const getArchiveSubmissions = async (
  hackathonId: number,
  params?: ArchiveSubmissionsParams,
): Promise<Submission[]> => {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set("search", params.search);
  if (params?.tech_stack) searchParams.set("tech_stack", params.tech_stack);

  const res = await apiClient
    .get(`api/v1/archive/hackathons/${hackathonId}/submissions`, {
      searchParams,
    })
    .json<{ data: CursorPageResponse<Submission> }>();
  return res.data.content;
};

/**
 * 아카이브 제출물 상세
 * GET /api/v1/archive/submissions/{submissionId}
 */
export const getArchiveSubmission = async (
  submissionId: number,
): Promise<ArchiveSubmissionDetail> => {
  const res = await apiClient
    .get(`api/v1/archive/submissions/${submissionId}`)
    .json<{ data: ArchiveSubmissionDetail }>();
  return res.data;
};
