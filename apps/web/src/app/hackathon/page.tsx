"use client";

import { useCallback, useState } from "react";
import { useCurrentHackathon } from "@/hooks/hackathon";
import { useHackathonData } from "@/hooks/hackathon";
import {
  HackathonIntro,
  TimerHero,
  EventFacts,
  RecruitingMain,
  WaitingStartMain,
  ActiveHackathonMain,
  EndedMain,
  getMainStage,
} from "@/features/hackathon";
import { handleApiError } from "@core/utils/api-client";
import { Body } from "@ui/components/server";
import { HackathonPageSkeleton } from "@/components/skeleton/HackathonSkeleton";

export default function HackathonPage() {
  const {
    hackathon: currentHackathon,
    loading: listLoading,
    error: listError,
  } = useCurrentHackathon();

  const {
    hackathon,
    participant,
    teams,
    myTeam,
    submissions,
    loading: dataLoading,
    error: dataError,
    refetch,
    registerParticipant,
  } = useHackathonData(currentHackathon?.hackathon_id ?? null);

  const [actionError, setActionError] = useState<string | null>(null);

  const loading = listLoading || dataLoading;
  const error = listError || dataError;
  const stage = getMainStage(hackathon, hackathon?.server_time);

  const handleRegister = useCallback(async () => {
    try {
      setActionError(null);
      await registerParticipant();
      await refetch();
    } catch (err) {
      const msg = await handleApiError(err);
      setActionError(msg);
    }
  }, [registerParticipant, refetch]);

  const handleCreateTeam = useCallback(() => {
    alert("팀 생성 기능이 곧 추가됩니다.");
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleJoinRequest = useCallback((teamId: number) => {
    alert("가입 신청 기능이 곧 추가됩니다.");
  }, []);

  const handleSubmit = useCallback(() => {
    alert("제출 기능이 곧 추가됩니다.");
  }, []);

  if (loading) {
    return <HackathonPageSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Body size="m" className="text-text-danger">
          {error}
        </Body>
      </div>
    );
  }

  if (!hackathon || stage === "BEFORE_CREATED") {
    return <HackathonIntro />;
  }

  return (
    <>
      <TimerHero hackathon={hackathon} stage={stage} />
      <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
        <EventFacts hackathon={hackathon} />

        {actionError && (
          <div className="bg-surface-danger-subtler border-border-danger-light rounded-3 text-text-danger text-body-s mb-6 border p-4">
            {actionError}
          </div>
        )}

        {stage === "RECRUITING" && (
          <RecruitingMain
            hackathon={hackathon}
            onRegister={handleRegister}
            isRegistered={participant?.status === "REGISTERED"}
          />
        )}
        {stage === "WAITING_START" && (
          <WaitingStartMain hackathon={hackathon} />
        )}
        {stage === "ACTIVE" && (
          <ActiveHackathonMain
            hackathon={hackathon}
            myTeam={myTeam}
            teams={teams}
            submissions={submissions}
            onCreateTeam={handleCreateTeam}
            onJoinRequest={handleJoinRequest}
            onSubmit={handleSubmit}
          />
        )}
        {stage === "ENDED" && (
          <EndedMain
            hackathon={hackathon}
            submissionCount={submissions.length}
            awardCount={0}
          />
        )}
      </main>
    </>
  );
}
