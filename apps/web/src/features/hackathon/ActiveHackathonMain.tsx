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
import { Badge, Body, Heading, Label } from "@ui/components/server";
import {
  Button,
  Modal,
  Pagination,
  TextArea,
  TextInput,
} from "@ui/components/client";
import { useEffect, useMemo, useState } from "react";
import { formatDateTime, getRemainingLabel, type MainStage } from "./utils";
import { InfoRow, Notice, Panel, PanelHeader } from "./shared";

interface ActiveHackathonMainProps {
  hackathon: Hackathon;
  stage: Extract<MainStage, "TEAM_BUILDING" | "IN_PROGRESS" | "JUDGING">;
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

type TeamFormState = {
  name: string;
  topic: string;
  description: string;
  maxMembers: string;
};

type SubmissionFormState = {
  projectName: string;
  summary: string;
  description: string;
  githubUrl: string;
  deployUrl: string;
  imageUrl: string;
  techStacks: string;
};

const EMPTY_TEAM_FORM: TeamFormState = {
  name: "",
  topic: "",
  description: "",
  maxMembers: "4",
};

const EMPTY_SUBMISSION_FORM: SubmissionFormState = {
  projectName: "",
  summary: "",
  description: "",
  githubUrl: "",
  deployUrl: "",
  imageUrl: "",
  techStacks: "",
};

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
            onEvaluate={openEvaluation}
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

      <Modal
        isOpen={teamModalMode !== null}
        onClose={() => setTeamModalMode(null)}
        onConfirm={() => void submitTeamForm()}
        title={teamModalMode === "edit" ? "팀 정보 수정" : "새 팀 만들기"}
        confirmLabel={teamModalMode === "edit" ? "저장" : "생성"}
        width="m"
      >
        <div className="flex flex-col gap-4 pb-6">
          <TextInput
            id="hackathon-team-name"
            title="팀 이름"
            length="full"
            value={teamForm.name}
            onChange={(e) =>
              setTeamForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <TextInput
            id="hackathon-team-topic"
            title="주제"
            length="full"
            value={teamForm.topic}
            onChange={(e) =>
              setTeamForm((prev) => ({ ...prev, topic: e.target.value }))
            }
          />
          <TextInput
            id="hackathon-team-max"
            title="최대 인원"
            type="number"
            min={1}
            length="full"
            value={teamForm.maxMembers}
            onChange={(e) =>
              setTeamForm((prev) => ({
                ...prev,
                maxMembers: e.target.value,
              }))
            }
          />
          <TextArea
            id="hackathon-team-description"
            title="소개"
            size="medium"
            value={teamForm.description}
            onChange={(e) =>
              setTeamForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </div>
      </Modal>

      <Modal
        isOpen={joinTarget !== null}
        onClose={() => setJoinTarget(null)}
        onConfirm={() => void submitJoinRequest()}
        title="가입 신청"
        confirmLabel="신청"
        width="m"
      >
        <div className="flex flex-col gap-4 pb-6">
          <Body size="s" className="text-text-subtle">
            {joinTarget?.name} 팀에 보낼 메시지를 입력합니다.
          </Body>
          <TextArea
            id="hackathon-join-message"
            title="메시지"
            size="medium"
            value={joinMessage}
            onChange={(e) => setJoinMessage(e.target.value)}
          />
        </div>
      </Modal>

      <Modal
        isOpen={submissionOpen}
        onClose={() => setSubmissionOpen(false)}
        onConfirm={() => void submitSubmission()}
        title={mySubmission ? "결과물 수정" : "결과물 제출"}
        confirmLabel={mySubmission ? "수정" : "제출"}
        width="l"
      >
        <div className="grid grid-cols-1 gap-4 pb-6 md:grid-cols-2">
          <TextInput
            id="submission-project"
            title="프로젝트명"
            length="full"
            value={submissionForm.projectName}
            onChange={(e) =>
              setSubmissionForm((prev) => ({
                ...prev,
                projectName: e.target.value,
              }))
            }
          />
          <TextInput
            id="submission-github"
            title="GitHub URL"
            length="full"
            value={submissionForm.githubUrl}
            onChange={(e) =>
              setSubmissionForm((prev) => ({
                ...prev,
                githubUrl: e.target.value,
              }))
            }
          />
          <div className="md:col-span-2">
            <TextInput
              id="submission-summary"
              title="한 줄 소개"
              length="full"
              value={submissionForm.summary}
              onChange={(e) =>
                setSubmissionForm((prev) => ({
                  ...prev,
                  summary: e.target.value,
                }))
              }
            />
          </div>
          <TextInput
            id="submission-deploy"
            title="배포 URL"
            length="full"
            value={submissionForm.deployUrl}
            onChange={(e) =>
              setSubmissionForm((prev) => ({
                ...prev,
                deployUrl: e.target.value,
              }))
            }
          />
          <TextInput
            id="submission-image"
            title="이미지 URL"
            length="full"
            value={submissionForm.imageUrl}
            onChange={(e) =>
              setSubmissionForm((prev) => ({
                ...prev,
                imageUrl: e.target.value,
              }))
            }
          />
          <div className="md:col-span-2">
            <TextInput
              id="submission-tech"
              title="기술 스택"
              description="쉼표로 구분"
              length="full"
              value={submissionForm.techStacks}
              onChange={(e) =>
                setSubmissionForm((prev) => ({
                  ...prev,
                  techStacks: e.target.value,
                }))
              }
            />
          </div>
          <div className="md:col-span-2">
            <TextArea
              id="submission-description"
              title="설명"
              size="large"
              value={submissionForm.description}
              onChange={(e) =>
                setSubmissionForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>
          <label className="flex flex-col gap-1 md:col-span-2">
            <Label size="s" className="text-text-basic">
              발표 자료
            </Label>
            <input
              type="file"
              onChange={(e) => setPresentation(e.target.files?.[0] ?? null)}
              className="rounded-2 border-input-border bg-input-surface text-text-basic text-body-s border px-4 py-3"
            />
          </label>
        </div>
      </Modal>

      <Modal
        isOpen={evaluationTarget !== null}
        onClose={() => setEvaluationTarget(null)}
        onConfirm={() => void submitEvaluationForm()}
        title="팀 평가"
        confirmLabel={existingEvaluation ? "수정" : "제출"}
        width="m"
      >
        <div className="flex flex-col gap-4 pb-6">
          <Body size="s" className="text-text-subtle">
            {evaluationTarget?.name} 팀의 결과물을 평가합니다.
          </Body>
          {criteria.map((criterion) => (
            <TextInput
              key={criterion.criterion_id}
              id={`criterion-${criterion.criterion_id}`}
              title={`${criterion.name} (1~${criterion.max_score})`}
              type="number"
              min={1}
              max={criterion.max_score}
              length="full"
              value={evaluationScores[criterion.criterion_id] ?? ""}
              onChange={(e) =>
                setEvaluationScores((prev) => ({
                  ...prev,
                  [criterion.criterion_id]: e.target.value,
                }))
              }
            />
          ))}
        </div>
      </Modal>
    </section>
  );
}

const TEAMS_PAGE_SIZE = 5;

function TeamRecruitingPanel({
  stage,
  isRegistered,
  teams,
  onCreateTeam,
  onJoinRequest,
}: {
  stage: ActiveHackathonMainProps["stage"];
  isRegistered: boolean;
  teams: Team[];
  onCreateTeam: () => void;
  onJoinRequest: (team: Team) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(teams.length / TEAMS_PAGE_SIZE);
  const paginated = teams.slice(
    (currentPage - 1) * TEAMS_PAGE_SIZE,
    currentPage * TEAMS_PAGE_SIZE,
  );
  const canManageTeam = stage === "TEAM_BUILDING" && isRegistered;

  return (
    <Panel>
      <PanelHeader
        eyebrow="팀 모집"
        title={
          canManageTeam
            ? "팀을 만들거나 합류할 팀을 선택하세요"
            : "팀 구성 단계가 아닙니다"
        }
        count={`${teams.length}팀`}
      />
      <div className="border-divider-gray-light mt-2 border-t">
        {paginated.map((team) => (
          <article
            key={team.hackathon_team_id}
            className="border-divider-gray-light hover:bg-surface-gray-subtler group -mx-6 grid grid-cols-1 items-center gap-3 border-b px-6 py-4 transition-colors sm:grid-cols-[1fr_80px_auto]"
          >
            <div>
              <Label
                size="s"
                className="text-text-basic mb-0.5 block font-bold"
              >
                {team.name}
              </Label>
              <Body size="s" className="text-text-subtle">
                {team.topic || "주제 미정"}
              </Body>
            </div>
            <span className="text-text-primary text-label-xs font-bold">
              {team.member_count}/{team.max_members ?? "-"}
            </span>
            <Button
              variant="tertiary"
              size="x-small"
              disabled={!canManageTeam}
              onClick={() => onJoinRequest(team)}
            >
              가입 신청
            </Button>
          </article>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          variant="primary"
          size="medium"
          disabled={!canManageTeam}
          onClick={onCreateTeam}
        >
          새 팀 만들기
        </Button>
      </div>
    </Panel>
  );
}

function TeamWorkspacePanel({
  hackathon,
  stage,
  team,
  mySubmission,
  now,
  isLeader,
  joinRequests,
  onEditTeam,
  onDisbandTeam,
  onApproveJoinRequest,
  onRejectJoinRequest,
  onSubmit,
  submitting,
}: {
  hackathon: Hackathon;
  stage: ActiveHackathonMainProps["stage"];
  team: Team;
  mySubmission: Submission | null;
  now: Date;
  isLeader: boolean;
  joinRequests: JoinRequest[];
  onEditTeam: () => void;
  onDisbandTeam: () => void;
  onApproveJoinRequest: (requestId: number) => Promise<void>;
  onRejectJoinRequest: (requestId: number) => Promise<void>;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const canEditTeam = stage === "TEAM_BUILDING" && isLeader;
  const canSubmit = stage === "IN_PROGRESS" && isLeader;

  return (
    <Panel>
      <PanelHeader
        eyebrow="내 팀"
        title={team.name}
        count={`${team.member_count}/${team.max_members ?? "-"}명`}
      />
      <Body size="m" className="text-text-subtle">
        {team.description || "팀 소개가 없습니다."}
      </Body>

      <div className="my-4 flex flex-wrap gap-2">
        {team.members.map((member) => (
          <span
            key={member.user_id}
            className="bg-surface-primary-subtler text-text-primary text-label-xs inline-flex h-7 items-center rounded-full px-3 font-semibold"
          >
            {member.user_name}
            {member.role === "LEADER" && (
              <span className="text-primary-30 ml-1">*</span>
            )}
          </span>
        ))}
      </div>

      {canEditTeam && (
        <div className="mb-4 flex flex-wrap gap-2">
          <Button variant="tertiary" size="small" onClick={onEditTeam}>
            팀 정보 수정
          </Button>
          <Button
            variant="tertiary"
            size="small"
            disabled={submitting}
            onClick={onDisbandTeam}
          >
            팀 해산
          </Button>
        </div>
      )}

      {stage === "TEAM_BUILDING" && isLeader && (
        <JoinRequestPanel
          requests={joinRequests}
          submitting={submitting}
          onApprove={onApproveJoinRequest}
          onReject={onRejectJoinRequest}
        />
      )}

      {(stage === "IN_PROGRESS" || stage === "JUDGING") && (
        <div className="bg-surface-gray-subtler border-border-gray-light rounded-3 flex flex-col items-start justify-between gap-4 border p-5 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Label
              size="xs"
              className="text-text-primary mb-1 block font-bold uppercase tracking-[0.15em]"
            >
              결과물 제출
            </Label>
            <Heading size="xxs" className="text-text-basic">
              {mySubmission?.project_name ?? "아직 제출 전입니다"}
            </Heading>
            <Body size="s" className="text-text-subtle mt-1">
              {mySubmission?.summary ??
                "팀장이 GitHub, 배포 URL, 발표자료를 마감 전까지 제출합니다."}
            </Body>
          </div>
          <Button
            variant="primary"
            size="medium"
            disabled={!canSubmit}
            onClick={onSubmit}
          >
            {mySubmission ? "제출 수정" : "제출하기"}
          </Button>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InfoRow label="현재 단계" value={phaseLabel(stage)} />
        <InfoRow
          label={stage === "TEAM_BUILDING" ? "팀 구성 마감" : "제출 마감"}
          value={formatDateTime(
            stage === "TEAM_BUILDING"
              ? (hackathon.team_building_ends_at ?? hackathon.starts_at)
              : hackathon.ends_at,
          )}
        />
        {stage !== "JUDGING" && (
          <InfoRow
            label="남은 시간"
            value={getRemainingLabel(
              now,
              new Date(
                stage === "TEAM_BUILDING"
                  ? (hackathon.team_building_ends_at ?? hackathon.starts_at)
                  : hackathon.ends_at,
              ),
            )}
          />
        )}
      </div>
    </Panel>
  );
}

function JoinRequestPanel({
  requests,
  submitting,
  onApprove,
  onReject,
}: {
  requests: JoinRequest[];
  submitting: boolean;
  onApprove: (requestId: number) => Promise<void>;
  onReject: (requestId: number) => Promise<void>;
}) {
  return (
    <div className="border-divider-gray-light mb-4 border-t pt-4">
      <Label size="s" className="text-text-basic mb-2 block font-bold">
        가입 신청
      </Label>
      {requests.length === 0 ? (
        <Body size="s" className="text-text-subtle">
          대기 중인 가입 신청이 없습니다.
        </Body>
      ) : (
        <div className="flex flex-col gap-2">
          {requests.map((request) => (
            <div
              key={request.join_request_id}
              className="border-border-gray-light rounded-2 flex flex-col gap-3 border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <Label size="s" className="text-text-basic font-bold">
                  {request.user_name}
                </Label>
                {request.message && (
                  <Body size="s" className="text-text-subtle mt-1">
                    {request.message}
                  </Body>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="x-small"
                  disabled={submitting}
                  onClick={() => void onApprove(request.join_request_id)}
                >
                  승인
                </Button>
                <Button
                  variant="tertiary"
                  size="x-small"
                  disabled={submitting}
                  onClick={() => void onReject(request.join_request_id)}
                >
                  거절
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EvaluationPanel({
  criteria,
  teams,
  onEvaluate,
}: {
  criteria: Criterion[];
  teams: Team[];
  onEvaluate: (team: Team) => void;
}) {
  return (
    <Panel>
      <PanelHeader
        eyebrow="심사"
        title="제출 완료 팀 평가"
        count={`${teams.length}팀`}
      />
      {criteria.length === 0 ? (
        <Body size="s" className="text-text-subtle">
          등록된 평가 기준이 없습니다.
        </Body>
      ) : teams.length === 0 ? (
        <Body size="s" className="text-text-subtle">
          평가할 제출물이 없습니다.
        </Body>
      ) : (
        <div className="border-divider-gray-light mt-2 border-t">
          {teams.map((team) => (
            <article
              key={team.hackathon_team_id}
              className="border-divider-gray-light -mx-6 flex flex-col gap-3 border-b px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <Label size="s" className="text-text-basic block font-bold">
                  {team.name}
                </Label>
                <Body size="s" className="text-text-subtle mt-1">
                  {team.topic || "주제 미정"}
                </Body>
              </div>
              <Button
                variant="primary"
                size="x-small"
                onClick={() => onEvaluate(team)}
              >
                평가하기
              </Button>
            </article>
          ))}
        </div>
      )}
    </Panel>
  );
}

function TeamStatusBoard({
  teams,
  submissions,
  myTeam,
}: {
  teams: Team[];
  submissions: Submission[];
  myTeam: Team | null;
}) {
  return (
    <Panel>
      <PanelHeader
        eyebrow="팀 현황"
        title="다른 팀 진행 상태"
        count={`${teams.length}팀`}
      />
      <div className="border-border-gray-light rounded-2 overflow-hidden border">
        <div className="bg-surface-gray-subtler hidden min-h-[44px] grid-cols-[1.1fr_80px_110px_minmax(0,1.6fr)] items-center gap-3 px-4 sm:grid">
          <Label size="xs" className="text-text-subtle font-bold">
            팀
          </Label>
          <Label size="xs" className="text-text-subtle font-bold">
            인원
          </Label>
          <Label size="xs" className="text-text-subtle font-bold">
            제출
          </Label>
          <Label size="xs" className="text-text-subtle font-bold">
            주제
          </Label>
        </div>
        {teams.map((team) => {
          const submitted = submissions.some(
            (s) => s.team_id === team.hackathon_team_id,
          );
          const isMine = myTeam?.hackathon_team_id === team.hackathon_team_id;
          return (
            <div
              key={team.hackathon_team_id}
              className={`border-divider-gray-light text-body-s grid min-h-[44px] grid-cols-1 items-center gap-2 border-t px-4 py-3 sm:grid-cols-[1.1fr_80px_110px_minmax(0,1.6fr)] sm:gap-3 sm:py-0 ${isMine ? "bg-surface-primary-subtler" : ""}`}
            >
              <Label size="s" className="text-text-basic font-bold">
                {team.name}
              </Label>
              <Body size="s" className="text-text-subtle">
                {team.member_count}/{team.max_members ?? "-"}
              </Body>
              <div>
                <Badge
                  label={submitted ? "제출 완료" : "진행 중"}
                  variant={submitted ? "success" : "disabled"}
                  appearance="solid-pastel"
                  size="small"
                />
              </div>
              <Body size="s" className="text-text-subtle">
                {team.topic || "주제 미정"}
              </Body>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function statusValue(
  current: ActiveHackathonMainProps["stage"],
  target: ActiveHackathonMainProps["stage"],
) {
  const order = ["TEAM_BUILDING", "IN_PROGRESS", "JUDGING"];
  const currentIndex = order.indexOf(current);
  const targetIndex = order.indexOf(target);
  if (currentIndex === targetIndex) return "진행 중";
  if (currentIndex > targetIndex) return "완료";
  return "예정";
}

function phaseLabel(stage: ActiveHackathonMainProps["stage"]) {
  switch (stage) {
    case "TEAM_BUILDING":
      return "팀 구성";
    case "IN_PROGRESS":
      return "개발/제출";
    case "JUDGING":
      return "심사";
  }
}
