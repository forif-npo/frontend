import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import type {
  Hackathon,
  Participant,
  Team,
  Submission,
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
}

export const useHackathonData = (
  hackathonId: number | null,
): UseHackathonDataReturn => {
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [myTeam, setMyTeam] = useState<Team | null>(null);
  const [submissions] = useState<Submission[]>([]);
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
          .json<ApiResponse<Team[]>>();
        const teamList = teamsRes.data ?? [];
        setTeams(teamList);

        // 내 팀 찾기
        if (myParticipant) {
          const mine = teamList.find((t) =>
            t.members.some((m) => m.user_id === myParticipant!.user_id),
          );
          setMyTeam(mine ?? null);
        }
      } catch {
        setTeams([]);
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
  };
};
