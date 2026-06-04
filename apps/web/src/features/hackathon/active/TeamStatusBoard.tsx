import type { Submission, Team } from "@core/types/hackathon";
import { Badge, Body, Label } from "@ui/components/server";
import { Panel, PanelHeader } from "../shared";

export function TeamStatusBoard({
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
