import type {
  Hackathon,
  JoinRequest,
  Submission,
  Team,
} from "@core/types/hackathon";
import { Body, Heading, Label } from "@ui/components/server";
import { Button } from "@ui/components/client";
import { formatDateTime, getRemainingLabel } from "../utils";
import { InfoRow, Panel, PanelHeader } from "../shared";
import { JoinRequestPanel } from "./JoinRequestPanel";
import { phaseLabel, type ActiveStage } from "./types";

export function TeamWorkspacePanel({
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
  stage: ActiveStage;
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
  const canEditTeam =
    (stage === "TEAM_BUILDING" || stage === "IN_PROGRESS") && isLeader;
  const canDisbandTeam = stage === "TEAM_BUILDING" && isLeader;
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

      {(canEditTeam || canDisbandTeam) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {canEditTeam && (
            <Button variant="tertiary" size="small" onClick={onEditTeam}>
              팀 정보 수정
            </Button>
          )}
          {canDisbandTeam && (
            <Button
              variant="tertiary"
              size="small"
              disabled={submitting}
              onClick={onDisbandTeam}
            >
              팀 해산
            </Button>
          )}
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
