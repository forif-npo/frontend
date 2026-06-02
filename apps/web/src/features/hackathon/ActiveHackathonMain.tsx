"use client";

import type { Hackathon, Submission, Team } from "@core/types/hackathon";
import { Badge, Body, Heading, Label } from "@ui/components/server";
import { Button, Pagination } from "@ui/components/client";
import { useState } from "react";
import { formatDateTime, getRemainingLabel } from "./utils";
import { InfoRow, Notice, Panel, PanelHeader } from "./shared";

interface ActiveHackathonMainProps {
  hackathon: Hackathon;
  myTeam: Team | null;
  teams: Team[];
  submissions: Submission[];
  onCreateTeam: () => void;
  onJoinRequest: (teamId: number) => void;
  onSubmit: () => void;
}

export function ActiveHackathonMain({
  hackathon,
  myTeam,
  teams,
  submissions,
  onCreateTeam,
  onJoinRequest,
  onSubmit,
}: ActiveHackathonMainProps) {
  const now = hackathon.server_time
    ? new Date(hackathon.server_time)
    : new Date();

  return (
    <section className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_308px]">
      <div className="flex flex-col gap-4">
        {myTeam ? (
          <TeamSubmissionPanel
            hackathon={hackathon}
            team={myTeam}
            submissions={submissions}
            now={now}
            onSubmit={onSubmit}
          />
        ) : (
          <TeamRecruitingPanel
            teams={teams}
            onCreateTeam={onCreateTeam}
            onJoinRequest={onJoinRequest}
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
          <InfoRow label="팀 구성" value="진행 중" />
          <InfoRow label="개발" value="24시간" />
          <InfoRow label="제출" value="종료 전" />
          <InfoRow label="평가" value="제출 후" />
        </Panel>
      </aside>
    </section>
  );
}

const TEAMS_PAGE_SIZE = 5;

function TeamRecruitingPanel({
  teams,
  onCreateTeam,
  onJoinRequest,
}: {
  teams: Team[];
  onCreateTeam: () => void;
  onJoinRequest: (teamId: number) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(teams.length / TEAMS_PAGE_SIZE);
  const paginated = teams.slice(
    (currentPage - 1) * TEAMS_PAGE_SIZE,
    currentPage * TEAMS_PAGE_SIZE,
  );

  return (
    <Panel>
      <PanelHeader
        eyebrow="팀 모집"
        title="팀을 만들거나 합류할 팀을 선택하세요"
        count={`${teams.length}팀 모집중`}
      />
      <div className="border-divider-gray-light mt-2 border-t">
        {paginated.map((team) => (
          <article
            key={team.hackathon_team_id}
            className="border-divider-gray-light hover:bg-surface-gray-subtler group -mx-6 grid grid-cols-1 items-center gap-3 border-b px-6 py-4 transition-colors sm:grid-cols-[1fr_64px_auto]"
          >
            <div>
              <Label
                size="s"
                className="text-text-basic mb-0.5 block font-bold"
              >
                {team.name}
              </Label>
              <Body size="s" className="text-text-subtle">
                {team.topic}
              </Body>
            </div>
            <span className="text-text-primary text-label-xs font-bold">
              {team.member_count}/{team.max_members}
            </span>
            <Button
              variant="tertiary"
              size="x-small"
              onClick={() => onJoinRequest(team.hackathon_team_id)}
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
        <Button variant="primary" size="medium" onClick={onCreateTeam}>
          새 팀 만들기
        </Button>
      </div>
    </Panel>
  );
}

function TeamSubmissionPanel({
  hackathon,
  team,
  submissions,
  now,
  onSubmit,
}: {
  hackathon: Hackathon;
  team: Team;
  submissions: Submission[];
  now: Date;
  onSubmit: () => void;
}) {
  const mySubmission = submissions.find(
    (s) => s.team_id === team.hackathon_team_id,
  );

  return (
    <Panel>
      <PanelHeader
        eyebrow="내 팀"
        title={team.name}
        count={`${team.member_count}/${team.max_members}명`}
      />
      <Body size="m" className="text-text-subtle">
        {team.description}
      </Body>

      {/* Members */}
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

      {/* Submission box */}
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
              "프로젝트명, 한 줄 소개, GitHub, 배포 URL, 발표자료를 마감 전까지 제출합니다."}
          </Body>
        </div>
        <Button variant="primary" size="medium" onClick={onSubmit}>
          {mySubmission ? "제출 수정" : "제출하기"}
        </Button>
      </div>

      {/* Deadline */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InfoRow label="제출 마감" value={formatDateTime(hackathon.ends_at)} />
        <InfoRow
          label="남은 시간"
          value={getRemainingLabel(now, new Date(hackathon.ends_at))}
        />
      </div>
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
        {/* Header */}
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
        {/* Rows */}
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
                {team.member_count}/{team.max_members}
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
                {team.topic}
              </Body>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
