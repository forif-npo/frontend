"use client";

import { useCallback, useState } from "react";
import { useCurrentHackathon, useHackathonData } from "@/hooks/hackathon";
import {
  ActiveHackathonMain,
  EndedMain,
  EventFacts,
  RecruitingMain,
  getMainStage,
} from "@/features/hackathon";
import { statusBadgeClass, statusLabel } from "@/features/hackathon/utils";
import { HackathonDetailSkeleton } from "@/components/skeleton/HackathonSkeleton";
import { handleApiError } from "@core/utils/api-client";
import { Body, Breadcrumb, Heading, Link } from "@ui/components/server";
import { Button } from "@ui/components/client";
import type {
  CreateTeamRequest,
  EvaluationScore,
  SubmissionRequest,
} from "@core/types/hackathon";

export default function HackathonDetailPage() {
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
  } = useHackathonData(currentHackathon?.hackathon_id ?? null);

  const [actionError, setActionError] = useState<string | null>(null);

  const loading = listLoading || dataLoading;
  const error = listError || dataError;
  const stage = getMainStage(hackathon);

  const runAction = useCallback(
    async (action: () => Promise<void>) => {
      try {
        setActionError(null);
        await action();
        await refetch();
      } catch (err) {
        const msg = await handleApiError(err);
        setActionError(msg);
        throw err;
      }
    },
    [refetch],
  );

  const handleRegister = useCallback(async () => {
    await runAction(registerParticipant);
  }, [registerParticipant, runAction]);

  const handleCancelRegistration = useCallback(async () => {
    await runAction(cancelParticipant);
  }, [cancelParticipant, runAction]);

  const handleCreateTeam = useCallback(
    async (body: CreateTeamRequest) => {
      await runAction(() => createTeam(body));
    },
    [createTeam, runAction],
  );

  const handleUpdateTeam = useCallback(
    async (teamId: number, body: CreateTeamRequest) => {
      await runAction(() => updateTeam(teamId, body));
    },
    [runAction, updateTeam],
  );

  const handleDisbandTeam = useCallback(
    async (teamId: number) => {
      await runAction(() => disbandTeam(teamId));
    },
    [disbandTeam, runAction],
  );

  const handleJoinRequest = useCallback(
    async (teamId: number, message?: string) => {
      await runAction(() => createJoinRequest(teamId, message));
    },
    [createJoinRequest, runAction],
  );

  const handleApproveJoinRequest = useCallback(
    async (requestId: number) => {
      await runAction(() => approveJoinRequest(requestId));
    },
    [approveJoinRequest, runAction],
  );

  const handleRejectJoinRequest = useCallback(
    async (requestId: number) => {
      await runAction(() => rejectJoinRequest(requestId));
    },
    [rejectJoinRequest, runAction],
  );

  const handleSubmitProject = useCallback(
    async (
      teamId: number,
      body: SubmissionRequest,
      presentation?: File | null,
      method?: "POST" | "PUT",
    ) => {
      await runAction(() => submitProject(teamId, body, presentation, method));
    },
    [runAction, submitProject],
  );

  const handleSubmitEvaluation = useCallback(
    async (
      teamId: number,
      scores: EvaluationScore[],
      hasEvaluation: boolean,
    ) => {
      await runAction(() =>
        hasEvaluation
          ? updateMyEvaluation(teamId, scores)
          : submitEvaluation(teamId, scores),
      );
    },
    [runAction, submitEvaluation, updateMyEvaluation],
  );

  if (loading) {
    return <HackathonDetailSkeleton />;
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
    return (
      <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
        <section className="rounded-3 border-border-gray-light bg-surface-white flex flex-col items-center gap-4 border p-12 text-center shadow-sm">
          <Heading size="s" className="text-text-basic">
            현재 진행중인 해커톤이 없습니다
          </Heading>
          <Body size="s" className="text-text-subtle max-w-md">
            진행중인 해커톤이 생성되면 이곳에서 참가 신청과 진행 상황을 확인할
            수 있습니다.
          </Body>
          <Link href="/hackathon">
            <Button variant="secondary" size="medium">
              해커톤 메인으로
            </Button>
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      {/* 헤더 */}
      <div className="mb-6 flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "홈", href: "/" },
            { label: "해커톤", href: "/hackathon" },
            { label: "해커톤 상세" },
          ]}
        />
        <div className="flex flex-wrap items-center gap-3">
          <Heading size="m" className="text-text-basic">
            {hackathon.title}
          </Heading>
          <span className={statusBadgeClass(hackathon.status)}>
            {statusLabel[hackathon.status]}
          </span>
        </div>
      </div>

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
          onCancelRegistration={handleCancelRegistration}
          isRegistered={participant?.status === "REGISTERED"}
        />
      )}
      {(stage === "TEAM_BUILDING" ||
        stage === "IN_PROGRESS" ||
        stage === "JUDGING") && (
        <ActiveHackathonMain
          hackathon={hackathon}
          stage={stage}
          participant={participant}
          myTeam={myTeam}
          teams={teams}
          submissions={submissions}
          onCreateTeam={handleCreateTeam}
          onUpdateTeam={handleUpdateTeam}
          onDisbandTeam={handleDisbandTeam}
          onJoinRequest={handleJoinRequest}
          onFetchJoinRequests={fetchJoinRequests}
          onApproveJoinRequest={handleApproveJoinRequest}
          onRejectJoinRequest={handleRejectJoinRequest}
          onSubmitProject={handleSubmitProject}
          onFetchCriteria={fetchCriteria}
          onGetMyEvaluation={getMyEvaluation}
          onSubmitEvaluation={handleSubmitEvaluation}
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
  );
}
