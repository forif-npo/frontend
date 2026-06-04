import type { Team } from "@core/types/hackathon";
import { Body, Label } from "@ui/components/server";
import { Button, Pagination } from "@ui/components/client";
import { useState } from "react";
import { Panel, PanelHeader } from "../shared";
import type { ActiveStage } from "./types";

const TEAMS_PAGE_SIZE = 5;

export function TeamRecruitingPanel({
  stage,
  isRegistered,
  teams,
  onCreateTeam,
  onJoinRequest,
}: {
  stage: ActiveStage;
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
