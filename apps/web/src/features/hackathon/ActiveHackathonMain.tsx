"use client";

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
import { handleApiError } from "@core/utils/api-client";
import { Heading } from "@ui/components/server";
import { useEffect, useMemo, useState } from "react";
import { InfoRow, Notice, Panel } from "./shared";
import { EvaluationPanel } from "./active/EvaluationPanel";
import { TeamRecruitingPanel } from "./active/TeamRecruitingPanel";
import { TeamStatusBoard } from "./active/TeamStatusBoard";
import { TeamWorkspacePanel } from "./active/TeamWorkspacePanel";
import {
  EvaluationModal,
  JoinRequestModal,
  SubmissionModal,
  TeamFormModal,
} from "./active/modals";
import {
  EMPTY_SUBMISSION_FORM,
  EMPTY_TEAM_FORM,
  statusValue,
  type ActiveStage,
  type SubmissionFormState,
  type TeamFormState,
} from "./active/types";

interface ActiveHackathonMainProps {
  hackathon: Hackathon;
  stage: ActiveStage;
  participant: Participant | null;
  myTeam: Team | null;
  teams: Team[];
  submissions: Submission[];
  onCreateTeam: (body: CreateTeamRequest) => Promise<void>;
  onUpdateTeam: (teamId: number, body: CreateTeamRequest) => Promise<void>;
  onDisbandTeam: (teamId: number) => Promise<void>;
  onJoinRequest: (teamId: number, message?: string) => Promise<void>;
  onFetchJoinRequests: (
    teamId: number,
    status?: JoinRequestStatus,
  ) => Promise<JoinRequest[]>;
  onApproveJoinRequest: (requestId: number) => Promise<void>;
  onRejectJoinRequest: (requestId: number) => Promise<void>;
  onSubmitProject: (
    teamId: number,
    body: SubmissionRequest,
    presentation?: File | null,
    method?: "POST" | "PUT",
  ) => Promise<void>;
  onFetchCriteria: () => Promise<Criterion[]>;
  onGetMyEvaluation: (teamId: number) => Promise<Evaluation | null>;
  onSubmitEvaluation: (
    teamId: number,
    scores: EvaluationScore[],
    hasEvaluation: boolean,
  ) => Promise<void>;
}

export function ActiveHackathonMain({
  hackathon,
  stage,
  participant,
  myTeam,
  teams,
  submissions,
  onCreateTeam,
  onUpdateTeam,
  onDisbandTeam,
  onJoinRequest,
  onFetchJoinRequests,
  onApproveJoinRequest,
  onRejectJoinRequest,
  onSubmitProject,
  onFetchCriteria,
  onGetMyEvaluation,
  onSubmitEvaluation,
}: ActiveHackathonMainProps) {
  const now = hackathon.server_time
    ? new Date(hackathon.server_time)
    : new Date();
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [teamModalMode, setTeamModalMode] = useState<"create" | "edit" | null>(
    null,
  );
  const [teamForm, setTeamForm] = useState<TeamFormState>(EMPTY_TEAM_FORM);
  const [joinTarget, setJoinTarget] = useState<Team | null>(null);
  const [joinMessage, setJoinMessage] = useState("");
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [submissionOpen, setSubmissionOpen] = useState(false);
  const [submissionForm, setSubmissionForm] = useState<SubmissionFormState>(
    EMPTY_SUBMISSION_FORM,
  );
  const [presentation, setPresentation] = useState<File | null>(null);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [evaluationTarget, setEvaluationTarget] = useState<Team | null>(null);
  const [evaluationScores, setEvaluationScores] = useState<
    Record<number, string>
  >({});
  const [existingEvaluation, setExistingEvaluation] =
    useState<Evaluation | null>(null);

  const isRegistered = participant?.status === "REGISTERED";
  const isTeamBuilding = stage === "TEAM_BUILDING";
  const isJudging = stage === "JUDGING";
  const isLeader =
    !!myTeam && !!participant && myTeam.leader_id === participant.user_id;
  const mySubmission = myTeam
    ? (submissions.find((s) => s.team_id === myTeam.hackathon_team_id) ?? null)
    : null;

  const evaluableTeams = useMemo(() => {
    if (!myTeam) return [];
    const submittedTeamIds = new Set(submissions.map((s) => s.team_id));
    return teams.filter(
      (team) =>
        team.hackathon_team_id !== myTeam.hackathon_team_id &&
        submittedTeamIds.has(team.hackathon_team_id),
    );
  }, [myTeam, submissions, teams]);

  useEffect(() => {
    let ignore = false;
    if (!isLeader || !isTeamBuilding || !myTeam) {
      setJoinRequests([]);
      return;
    }

    const load = async () => {
      try {
        const list = await onFetchJoinRequests(
          myTeam.hackathon_team_id,
          "PENDING",
        );
        if (!ignore) setJoinRequests(list);
      } catch (error) {
        if (!ignore) setLocalError(await handleApiError(error));
      }
    };

    void load();
    return () => {
      ignore = true;
    };
  }, [isLeader, isTeamBuilding, myTeam, onFetchJoinRequests]);

  useEffect(() => {
    let ignore = false;
    if (!isJudging) {
      setCriteria([]);
      return;
    }

    const load = async () => {
      try {
        const list = await onFetchCriteria();
        if (!ignore) setCriteria(list);
      } catch (error) {
        if (!ignore) setLocalError(await handleApiError(error));
      }
    };

    void load();
    return () => {
      ignore = true;
    };
  }, [isJudging, onFetchCriteria]);

  const runModalAction = async (action: () => Promise<void>) => {
    try {
      setSubmitting(true);
      setLocalError(null);
      await action();
    } catch {
      // Page-level action error is already populated by the caller.
    } finally {
      setSubmitting(false);
    }
  };

  const openCreateTeam = () => {
    setTeamForm(EMPTY_TEAM_FORM);
    setTeamModalMode("create");
  };

  const openEditTeam = () => {
    if (!myTeam) return;
    setTeamForm({
      name: myTeam.name,
      topic: myTeam.topic ?? "",
      description: myTeam.description ?? "",
      maxMembers:
        typeof myTeam.max_members === "number"
          ? String(myTeam.max_members)
          : "",
    });
    setTeamModalMode("edit");
  };

  const submitTeamForm = async () => {
    const name = teamForm.name.trim();
    const maxMembers = teamForm.maxMembers
      ? Number(teamForm.maxMembers)
      : undefined;
    if (!name) {
      setLocalError("팀 이름을 입력해주세요.");
      return;
    }
    if (
      teamForm.maxMembers &&
      (Number.isNaN(maxMembers) || Number(maxMembers) < 1)
    ) {
      setLocalError("최대 인원은 1명 이상으로 입력해주세요.");
      return;
    }

    const body: CreateTeamRequest = {
      name,
      topic: teamForm.topic.trim() || undefined,
      description: teamForm.description.trim() || undefined,
      max_members: maxMembers,
    };

    await runModalAction(async () => {
      if (teamModalMode === "edit" && myTeam) {
        await onUpdateTeam(myTeam.hackathon_team_id, body);
      } else {
        await onCreateTeam(body);
      }
      setTeamModalMode(null);
    });
  };

  const submitJoinRequest = async () => {
    if (!joinTarget) return;
    await runModalAction(async () => {
      await onJoinRequest(joinTarget.hackathon_team_id, joinMessage);
      setJoinTarget(null);
      setJoinMessage("");
    });
  };

  const approveJoinRequest = async (requestId: number) => {
    await runModalAction(async () => {
      await onApproveJoinRequest(requestId);
      if (myTeam) {
        const list = await onFetchJoinRequests(
          myTeam.hackathon_team_id,
          "PENDING",
        );
        setJoinRequests(list);
      }
    });
  };

  const rejectJoinRequest = async (requestId: number) => {
    await runModalAction(async () => {
      await onRejectJoinRequest(requestId);
      setJoinRequests((prev) =>
        prev.filter((request) => request.join_request_id !== requestId),
      );
    });
  };

  const openSubmission = () => {
    setSubmissionForm(
      mySubmission
        ? {
            projectName: mySubmission.project_name,
            summary: mySubmission.summary,
            description: mySubmission.description ?? "",
            githubUrl: mySubmission.github_url,
            deployUrl: mySubmission.deploy_url ?? "",
            imageUrl: mySubmission.image_url ?? "",
            techStacks: mySubmission.tech_stacks.join(", "),
          }
        : EMPTY_SUBMISSION_FORM,
    );
    setPresentation(null);
    setSubmissionOpen(true);
  };

  const submitSubmission = async () => {
    if (!myTeam) return;
    const projectName = submissionForm.projectName.trim();
    const summary = submissionForm.summary.trim();
    const githubUrl = submissionForm.githubUrl.trim();
    if (!projectName || !summary || !githubUrl) {
      setLocalError("프로젝트명, 한 줄 소개, GitHub URL을 입력해주세요.");
      return;
    }

    const body: SubmissionRequest = {
      project_name: projectName,
      summary,
      description: submissionForm.description.trim() || undefined,
      github_url: githubUrl,
      deploy_url: submissionForm.deployUrl.trim() || undefined,
      image_url: submissionForm.imageUrl.trim() || undefined,
      tech_stacks: submissionForm.techStacks
        .split(",")
        .map((stack) => stack.trim())
        .filter(Boolean),
    };

    await runModalAction(async () => {
      await onSubmitProject(
        myTeam.hackathon_team_id,
        body,
        presentation,
        mySubmission ? "PUT" : "POST",
      );
      setSubmissionOpen(false);
    });
  };

  const openEvaluation = async (team: Team) => {
    setEvaluationTarget(team);
    setExistingEvaluation(null);
    setEvaluationScores(
      Object.fromEntries(criteria.map((c) => [c.criterion_id, ""])) as Record<
        number,
        string
      >,
    );

    try {
      const evaluation = await onGetMyEvaluation(team.hackathon_team_id);
      setExistingEvaluation(evaluation);
      if (evaluation) {
        setEvaluationScores(
          Object.fromEntries(
            criteria.map((criterion) => {
              const score = evaluation.scores.find(
                (item) => item.criterion_id === criterion.criterion_id,
              );
              return [criterion.criterion_id, score ? String(score.score) : ""];
            }),
          ) as Record<number, string>,
        );
      }
    } catch (error) {
      setLocalError(await handleApiError(error));
    }
  };

  const submitEvaluationForm = async () => {
    if (!evaluationTarget) return;
    const scores: EvaluationScore[] = [];
    for (const criterion of criteria) {
      const raw = evaluationScores[criterion.criterion_id];
      const value = Number(raw);
      if (!raw || Number.isNaN(value)) {
        setLocalError(`'${criterion.name}' 점수를 입력해주세요.`);
        return;
      }
      if (value < 1 || value > criterion.max_score) {
        setLocalError(
          `'${criterion.name}' 점수는 1~${criterion.max_score} 사이여야 합니다.`,
        );
        return;
      }
      scores.push({ criterion_id: criterion.criterion_id, score: value });
    }

    await runModalAction(async () => {
      await onSubmitEvaluation(
        evaluationTarget.hackathon_team_id,
        scores,
        !!existingEvaluation,
      );
      setEvaluationTarget(null);
    });
  };

  return (
    <section className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_308px]">
      <div className="flex flex-col gap-4">
        {localError && (
          <div className="bg-surface-danger-subtler border-border-danger-light rounded-3 text-text-danger text-body-s border p-4">
            {localError}
          </div>
        )}

        {myTeam ? (
          <TeamWorkspacePanel
            hackathon={hackathon}
            stage={stage}
            team={myTeam}
            mySubmission={mySubmission}
            now={now}
            isLeader={isLeader}
            joinRequests={joinRequests}
            onEditTeam={openEditTeam}
            onDisbandTeam={() =>
              void runModalAction(() => onDisbandTeam(myTeam.hackathon_team_id))
            }
            onApproveJoinRequest={approveJoinRequest}
            onRejectJoinRequest={rejectJoinRequest}
            onSubmit={openSubmission}
            submitting={submitting}
          />
        ) : (
          <TeamRecruitingPanel
            stage={stage}
            isRegistered={isRegistered}
            teams={teams}
            onCreateTeam={openCreateTeam}
            onJoinRequest={setJoinTarget}
          />
        )}

        {isJudging && (
          <EvaluationPanel
            criteria={criteria}
            teams={evaluableTeams}
            onEvaluate={(team) => void openEvaluation(team)}
          />
        )}

        <TeamStatusBoard
          teams={teams}
          submissions={submissions}
          myTeam={myTeam}
        />
      </div>
      <aside className="flex flex-col gap-4">
        <Panel>
          <Heading size="xxs" className="text-text-basic mb-2">
            공지
          </Heading>
          <Notice
            title="팀 구성"
            body="팀장은 가입 신청을 확인하고 승인할 수 있습니다."
          />
          <Notice
            title="제출"
            body="결과물 제출은 팀장만 가능하며 마감 전까지 수정할 수 있습니다."
          />
          <Notice
            title="평가"
            body="심사 상태가 되면 본인 팀을 제외한 다른 팀을 평가합니다."
          />
        </Panel>
        <Panel>
          <Heading size="xxs" className="text-text-basic mb-2">
            타임라인
          </Heading>
          <InfoRow
            label="팀 구성"
            value={statusValue(stage, "TEAM_BUILDING")}
          />
          <InfoRow label="개발" value={statusValue(stage, "IN_PROGRESS")} />
          <InfoRow label="평가" value={statusValue(stage, "JUDGING")} />
        </Panel>
      </aside>

      <TeamFormModal
        mode={teamModalMode}
        form={teamForm}
        setForm={setTeamForm}
        onClose={() => setTeamModalMode(null)}
        onConfirm={() => void submitTeamForm()}
      />

      <JoinRequestModal
        target={joinTarget}
        message={joinMessage}
        setMessage={setJoinMessage}
        onClose={() => setJoinTarget(null)}
        onConfirm={() => void submitJoinRequest()}
      />

      <SubmissionModal
        isOpen={submissionOpen}
        isEdit={!!mySubmission}
        form={submissionForm}
        setForm={setSubmissionForm}
        setPresentation={setPresentation}
        onClose={() => setSubmissionOpen(false)}
        onConfirm={() => void submitSubmission()}
      />

      <EvaluationModal
        target={evaluationTarget}
        criteria={criteria}
        scores={evaluationScores}
        setScores={setEvaluationScores}
        isEdit={!!existingEvaluation}
        onClose={() => setEvaluationTarget(null)}
        onConfirm={() => void submitEvaluationForm()}
      />
    </section>
  );
}
