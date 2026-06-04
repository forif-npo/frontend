import { apiClient } from "@core/utils/api-client";
import type { ApiResponse, OffsetPageResponse } from "@core/types/api";
import type {
  Award,
  AwardRequest,
  CreateHackathonRequest,
  Criterion,
  CriterionRequest,
  EvaluationScore,
  EvaluationSummary,
  Hackathon,
  HackathonStatus,
  Participant,
  SubmissionStatus,
  Team,
  UpdateHackathonRequest,
} from "@core/types/hackathon";

/**
 * 해커톤 목록 조회 (서버 컴포넌트용 - 토큰 명시)
 * GET /api/v1/hackathons
 */
export async function fetchHackathons(token?: string): Promise<Hackathon[]> {
  const res = await apiClient
    .get("api/v1/hackathons", {
      searchParams: { page: "0", size: "100" },
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    })
    .json<ApiResponse<OffsetPageResponse<Hackathon>>>();

  return res.data?.content ?? [];
}

/**
 * 해커톤 생성 (운영진)
 * POST /api/v1/admin/hackathons
 */
export async function createHackathon(
  body: CreateHackathonRequest,
): Promise<void> {
  await apiClient
    .post("api/v1/admin/hackathons", { json: body })
    .json<ApiResponse<Hackathon>>();
}

/**
 * 해커톤 수정 (운영진)
 * PATCH /api/v1/admin/hackathons/{hackathonId}
 */
export async function updateHackathon(
  hackathonId: number,
  body: UpdateHackathonRequest,
): Promise<void> {
  await apiClient
    .patch(`api/v1/admin/hackathons/${hackathonId}`, { json: body })
    .json<ApiResponse<Hackathon>>();
}

/**
 * 해커톤 삭제 (운영진)
 * DELETE /api/v1/admin/hackathons/{hackathonId}
 */
export async function deleteHackathon(hackathonId: number): Promise<void> {
  await apiClient
    .delete(`api/v1/admin/hackathons/${hackathonId}`)
    .json<ApiResponse<null>>();
}

/**
 * 해커톤 상태 변경 (운영진)
 * PATCH /api/v1/admin/hackathons/{hackathonId}/status
 */
export async function updateHackathonStatus(
  hackathonId: number,
  status: HackathonStatus,
): Promise<void> {
  await apiClient
    .patch(`api/v1/admin/hackathons/${hackathonId}/status`, {
      json: { status },
    })
    .json<ApiResponse<Hackathon>>();
}

/**
 * 제출 현황 조회 (운영진)
 * GET /api/v1/admin/hackathons/{hackathonId}/submissions
 */
export async function fetchSubmissionStatuses(
  hackathonId: number,
): Promise<SubmissionStatus[]> {
  const res = await apiClient
    .get(`api/v1/admin/hackathons/${hackathonId}/submissions`, {
      searchParams: { page: "0", size: "200" },
    })
    .json<ApiResponse<OffsetPageResponse<SubmissionStatus>>>();

  return res.data?.content ?? [];
}

/**
 * 해커톤 단건 조회 (서버 컴포넌트용 - 토큰 명시)
 * GET /api/v1/hackathons/{hackathonId}
 */
export async function fetchHackathon(
  hackathonId: number,
  token?: string,
): Promise<Hackathon | null> {
  const res = await apiClient
    .get(`api/v1/hackathons/${hackathonId}`, {
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    })
    .json<ApiResponse<Hackathon>>();

  return res.data;
}

/**
 * 팀 목록 조회 (운영진)
 * GET /api/v1/admin/hackathons/{hackathonId}/teams
 */
export async function fetchTeams(
  hackathonId: number,
  token?: string,
): Promise<Team[]> {
  const res = await apiClient
    .get(`api/v1/admin/hackathons/${hackathonId}/teams`, {
      searchParams: { page: "0", size: "100" },
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    })
    .json<ApiResponse<OffsetPageResponse<Team>>>();

  return res.data?.content ?? [];
}

/**
 * 팀 삭제 (운영진)
 * DELETE /api/v1/admin/hackathons/{hackathonId}/teams/{teamId}
 */
export async function deleteTeam(
  hackathonId: number,
  teamId: number,
): Promise<void> {
  await apiClient
    .delete(`api/v1/admin/hackathons/${hackathonId}/teams/${teamId}`)
    .json<ApiResponse<null>>();
}

/**
 * 참가자 목록 조회 (운영진)
 * GET /api/v1/admin/hackathons/{hackathonId}/participants
 */
export async function fetchParticipants(
  hackathonId: number,
  token?: string,
): Promise<Participant[]> {
  const res = await apiClient
    .get(`api/v1/admin/hackathons/${hackathonId}/participants`, {
      searchParams: { page: "0", size: "200" },
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    })
    .json<ApiResponse<OffsetPageResponse<Participant>>>();

  return res.data?.content ?? [];
}

/* ============================================
 * 평가 기준 (Criteria)
 * ============================================ */

/**
 * 평가 기준 목록 조회
 * GET /api/v1/hackathons/{hackathonId}/criteria
 */
export async function fetchCriteria(
  hackathonId: number,
  token?: string,
): Promise<Criterion[]> {
  const res = await apiClient
    .get(`api/v1/hackathons/${hackathonId}/criteria`, {
      searchParams: { page: "0", size: "100" },
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    })
    .json<ApiResponse<OffsetPageResponse<Criterion>>>();

  return (res.data?.content ?? [])
    .slice()
    .sort((a, b) => a.display_order - b.display_order);
}

/**
 * 평가 기준 생성
 * POST /api/v1/admin/hackathons/{hackathonId}/criteria
 */
export async function createCriterion(
  hackathonId: number,
  body: CriterionRequest,
): Promise<void> {
  await apiClient
    .post(`api/v1/admin/hackathons/${hackathonId}/criteria`, { json: body })
    .json<ApiResponse<Criterion>>();
}

/**
 * 평가 기준 수정
 * PUT /api/v1/admin/hackathons/{hackathonId}/criteria/{criterionId}
 */
export async function updateCriterion(
  hackathonId: number,
  criterionId: number,
  body: CriterionRequest,
): Promise<void> {
  await apiClient
    .put(`api/v1/admin/hackathons/${hackathonId}/criteria/${criterionId}`, {
      json: body,
    })
    .json<ApiResponse<Criterion>>();
}

/**
 * 평가 기준 삭제
 * DELETE /api/v1/admin/hackathons/{hackathonId}/criteria/{criterionId}
 */
export async function deleteCriterion(
  hackathonId: number,
  criterionId: number,
): Promise<void> {
  await apiClient
    .delete(`api/v1/admin/hackathons/${hackathonId}/criteria/${criterionId}`)
    .json<ApiResponse<null>>();
}

/* ============================================
 * 심사 / 집계 (Evaluations)
 * ============================================ */

/**
 * 평가 집계 조회 (운영진)
 * GET /api/v1/admin/hackathons/{hackathonId}/evaluations/summary
 */
export async function fetchEvaluationSummary(
  hackathonId: number,
  token?: string,
): Promise<EvaluationSummary[]> {
  const res = await apiClient
    .get(`api/v1/admin/hackathons/${hackathonId}/evaluations/summary`, {
      searchParams: { page: "0", size: "200" },
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    })
    .json<ApiResponse<OffsetPageResponse<EvaluationSummary>>>();

  return res.data?.content ?? [];
}

/**
 * 팀 심사 점수 제출
 * POST /api/v1/hackathons/{hackathonId}/teams/{teamId}/evaluations
 */
export async function submitTeamEvaluation(
  hackathonId: number,
  teamId: number,
  scores: EvaluationScore[],
): Promise<void> {
  await apiClient
    .post(`api/v1/hackathons/${hackathonId}/teams/${teamId}/evaluations`, {
      json: { scores },
    })
    .json<ApiResponse<unknown>>();
}

/* ============================================
 * 수상 (Awards)
 * ============================================ */

/**
 * 수상 목록 조회
 * GET /api/v1/hackathons/{hackathonId}/awards
 */
export async function fetchAwards(
  hackathonId: number,
  token?: string,
): Promise<Award[]> {
  const res = await apiClient
    .get(`api/v1/hackathons/${hackathonId}/awards`, {
      searchParams: { page: "0", size: "100" },
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    })
    .json<ApiResponse<OffsetPageResponse<Award>>>();

  return res.data?.content ?? [];
}

/**
 * 수상 등록
 * POST /api/v1/admin/hackathons/{hackathonId}/awards
 */
export async function createAward(
  hackathonId: number,
  body: AwardRequest,
): Promise<void> {
  await apiClient
    .post(`api/v1/admin/hackathons/${hackathonId}/awards`, { json: body })
    .json<ApiResponse<Award>>();
}

/**
 * 수상 수정
 * PUT /api/v1/admin/hackathons/{hackathonId}/awards/{awardId}
 */
export async function updateAward(
  hackathonId: number,
  awardId: number,
  body: AwardRequest,
): Promise<void> {
  await apiClient
    .put(`api/v1/admin/hackathons/${hackathonId}/awards/${awardId}`, {
      json: body,
    })
    .json<ApiResponse<Award>>();
}

/**
 * 수상 삭제
 * DELETE /api/v1/admin/hackathons/{hackathonId}/awards/{awardId}
 */
export async function deleteAward(
  hackathonId: number,
  awardId: number,
): Promise<void> {
  await apiClient
    .delete(`api/v1/admin/hackathons/${hackathonId}/awards/${awardId}`)
    .json<ApiResponse<null>>();
}
