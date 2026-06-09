import type { Criterion, Team } from "@core/types/hackathon";
import { Body, Label } from "@ui/components/server";
import { Button } from "@ui/components/client";
import { Panel, PanelHeader } from "../shared";

export function EvaluationPanel({
  criteria,
  teams,
  evaluatedTeamIds,
  onEvaluate,
}: {
  criteria: Criterion[];
  teams: Team[];
  evaluatedTeamIds: Set<number>;
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
          {teams.map((team) => {
            const isEvaluated = evaluatedTeamIds.has(team.hackathon_team_id);

            return (
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
                  variant={isEvaluated ? "secondary" : "primary"}
                  size="x-small"
                  disabled={isEvaluated}
                  onClick={() => onEvaluate(team)}
                >
                  {isEvaluated ? "평가 완료" : "평가하기"}
                </Button>
              </article>
            );
          })}
        </div>
      )}
    </Panel>
  );
}
