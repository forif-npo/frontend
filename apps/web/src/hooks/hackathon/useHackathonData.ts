import { apiClient } from "@core/utils/api-client";
import type { ApiResponse, CursorPageResponse } from "@core/types/api";
import type {
  CreateTeamRequest,
  Criterion,
  Evaluation,
  EvaluationScore,
  Hackathon,
  JoinRequest,
  JoinRequestStatus,
  Participant,
  Submission,
  SubmissionRequest,
  Team,
} from "@core/types/hackathon";
import { useCallback, useEffect, useState } from "react";

interface UseHackathonDataReturn {
  hackathon: Hackathon | null;
  participant: Participant | null;
  teams: Team[];
  myTeam: Team | null;
  submissions: Submission[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  registerParticipant: () => Promise<void>;
  cancelParticipant: () => Promise<void>;
  createTeam: (body: CreateTeamRequest) => Promise<void>;
  updateTeam: (teamId: number, body: CreateTeamRequest) => Promise<void>;
  disbandTeam: (teamId: number) => Promise<void>;
  createJoinRequest: (teamId: number, message?: string) => Promise<void>;
  fetchJoinRequests: (
    teamId: number,
    status?: JoinRequestStatus,
  ) => Promise<JoinRequest[]>;
  approveJoinRequest: (requestId: number) => Promise<void>;
  rejectJoinRequest: (requestId: number) => Promise<void>;
  submitProject: (
    teamId: number,
    body: SubmissionRequest,
    presentation?: File | null,
    method?: "POST" | "PUT",
  ) => Promise<void>;
  fetchCriteria: () => Promise<Criterion[]>;
  submitEvaluation: (
    teamId: number,
    scores: EvaluationScore[],
  ) => Promise<void>;
  updateMyEvaluation: (
    teamId: number,
    scores: EvaluationScore[],
  ) => Promise<void>;
  getMyEvaluation: (teamId: number) => Promise<Evaluation | null>;
}

export const useHackathonData = (
  hackathonId: number | null,
): UseHackathonDataReturn => {
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [myTeam, setMyTeam] = useState<Team | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!hackathonId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const hackathonRes = await apiClient
        .get(`api/v1/hackathons/${hackathonId}`)
        .json<ApiResponse<Hackathon>>();
      const h = hackathonRes.data;
      setHackathon(h);

      if (!h) return;

      // 참가 상태 조회 (실패 가능 - 미참가자)
      let myParticipant: Participant | null = null;
      try {
        const participantRes = await apiClient
          .get(`api/v1/hackathons/${hackathonId}/participants/me`)
          .json<ApiResponse<Participant>>();
        myParticipant = participantRes.data;
        setParticipant(myParticipant);
      } catch {
        setParticipant(null);
      }

      // 팀 목록 조회 (참가자만 가능)
      try {
        const teamsRes = await apiClient
          .get(`api/v1/hackathons/${hackathonId}/teams`)
          .json<ApiResponse<CursorPageResponse<Team>>>();
        const teamList = teamsRes.data?.content ?? [];
        setTeams(teamList);

        // 내 팀 찾기
        if (myParticipant) {
          const mine = teamList.find((t) =>
            t.members.some((m) => m.user_id === myParticipant!.user_id),
          );
          setMyTeam(mine ?? null);
        } else {
          setMyTeam(null);
        }
      } catch {
        setTeams([]);
        setMyTeam(null);
      }

      // 제출물 목록 조회
      try {
        const submissionsRes = await apiClient
          .get(`api/v1/hackathons/${hackathonId}/submissions`)
          .json<ApiResponse<CursorPageResponse<Submission>>>();
        setSubmissions(submissionsRes.data?.content ?? []);
      } catch {
        setSubmissions([]);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "해커톤 정보를 불러오지 못했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }, [hackathonId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const registerParticipant = useCallback(async () => {
    if (!hackathonId) return;
    const res = await apiClient
      .post(`api/v1/hackathons/${hackathonId}/participants/me`)
      .json<ApiResponse<Participant>>();
    setParticipant(res.data);
  }, [hackathonId]);

  const cancelParticipant = useCallback(async () => {
    if (!hackathonId) return;
    await apiClient
      .delete(`api/v1/hackathons/${hackathonId}/participants/me`)
      .json<ApiResponse<null>>();
    setParticipant(null);
  }, [hackathonId]);

  const createTeam = useCallback(
    async (body: CreateTeamRequest) => {
      if (!hackathonId) return;
      await apiClient
        .post(`api/v1/hackathons/${hackathonId}/teams`, { json: body })
        .json<ApiResponse<Team>>();
      await fetchData();
    },
    [fetchData, hackathonId],
  );

  const updateTeam = useCallback(
    async (teamId: number, body: CreateTeamRequest) => {
      if (!hackathonId) return;
      await apiClient
        .patch(`api/v1/hackathons/${hackathonId}/teams/${teamId}`, {
          json: body,
        })
        .json<ApiResponse<Team>>();
      await fetchData();
    },
    [fetchData, hackathonId],
  );

  const disbandTeam = useCallback(
    async (teamId: number) => {
      if (!hackathonId) return;
      await apiClient
        .delete(`api/v1/hackathons/${hackathonId}/teams/${teamId}`)
        .json<ApiResponse<null>>();
      await fetchData();
    },
    [fetchData, hackathonId],
  );

  const createJoinRequest = useCallback(
    async (teamId: number, message?: string) => {
      if (!hackathonId) return;
      await apiClient
        .post(
          `api/v1/hackathons/${hackathonId}/teams/${teamId}/join-requests`,
          {
            json: { message: message?.trim() || undefined },
          },
        )
        .json<ApiResponse<JoinRequest>>();
    },
    [hackathonId],
  );

  const fetchJoinRequests = useCallback(
    async (teamId: number, status?: JoinRequestStatus) => {
      if (!hackathonId) return [];
      const res = await apiClient
        .get(`api/v1/hackathons/${hackathonId}/teams/${teamId}/join-requests`, {
          searchParams: {
            ...(status ? { status } : {}),
            size: "100",
          },
        })
        .json<ApiResponse<CursorPageResponse<JoinRequest>>>();
      return res.data?.content ?? [];
    },
    [hackathonId],
  );

  const approveJoinRequest = useCallback(
    async (requestId: number) => {
      if (!hackathonId) return;
      await apiClient
        .patch(
          `api/v1/hackathons/${hackathonId}/join-requests/${requestId}/approve`,
        )
        .json<ApiResponse<JoinRequest>>();
      await fetchData();
    },
    [fetchData, hackathonId],
  );

  const rejectJoinRequest = useCallback(
    async (requestId: number) => {
      if (!hackathonId) return;
      await apiClient
        .patch(
          `api/v1/hackathons/${hackathonId}/join-requests/${requestId}/reject`,
        )
        .json<ApiResponse<JoinRequest>>();
    },
    [hackathonId],
  );

  const submitProject = useCallback(
    async (
      teamId: number,
      body: SubmissionRequest,
      presentation?: File | null,
      method: "POST" | "PUT" = "POST",
    ) => {
      if (!hackathonId) return;
      const formData = new FormData();
      formData.append(
        "request",
        new Blob([JSON.stringify(body)], { type: "application/json" }),
      );
      if (presentation) {
        formData.append("presentation", presentation);
      }

      const endpoint = `api/v1/hackathons/${hackathonId}/teams/${teamId}/submission`;
      const request =
        method === "PUT"
          ? apiClient.put(endpoint, { body: formData })
          : apiClient.post(endpoint, { body: formData });
      await request.json<ApiResponse<Submission>>();
      await fetchData();
    },
    [fetchData, hackathonId],
  );

  const fetchCriteria = useCallback(async () => {
    if (!hackathonId) return [];
    const res = await apiClient
      .get(`api/v1/hackathons/${hackathonId}/criteria`, {
        searchParams: { size: "100" },
      })
      .json<ApiResponse<CursorPageResponse<Criterion>>>();
    return res.data?.content ?? [];
  }, [hackathonId]);

  const submitEvaluation = useCallback(
    async (teamId: number, scores: EvaluationScore[]) => {
      if (!hackathonId) return;
      await apiClient
        .post(`api/v1/hackathons/${hackathonId}/teams/${teamId}/evaluations`, {
          json: { scores },
        })
        .json<ApiResponse<Evaluation>>();
    },
    [hackathonId],
  );

  const updateMyEvaluation = useCallback(
    async (teamId: number, scores: EvaluationScore[]) => {
      if (!hackathonId) return;
      await apiClient
        .put(
          `api/v1/hackathons/${hackathonId}/teams/${teamId}/evaluations/me`,
          { json: { scores } },
        )
        .json<ApiResponse<Evaluation>>();
    },
    [hackathonId],
  );

  const getMyEvaluation = useCallback(
    async (teamId: number) => {
      if (!hackathonId) return null;
      try {
        const res = await apiClient
          .get(
            `api/v1/hackathons/${hackathonId}/teams/${teamId}/evaluations/me`,
          )
          .json<ApiResponse<Evaluation>>();
        return res.data;
      } catch {
        return null;
      }
    },
    [hackathonId],
  );

  return {
    hackathon,
    participant,
    teams,
    myTeam,
    submissions,
    loading,
    error,
    refetch: fetchData,
    registerParticipant,
    cancelParticipant,
    createTeam,
    updateTeam,
    disbandTeam,
    createJoinRequest,
    fetchJoinRequests,
    approveJoinRequest,
    rejectJoinRequest,
    submitProject,
    fetchCriteria,
    submitEvaluation,
    updateMyEvaluation,
    getMyEvaluation,
  };
};
