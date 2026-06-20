"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Team } from "@core/types/hackathon";
import { Trash2 } from "lucide-react";
import type { AwardResult } from "../types";

const SPECIAL_VALUE = "special";
const RANK_OPTIONS = [1, 2, 3, 4, 5];

interface ResultRowProps {
  result: AwardResult;
  index: number;
  teams: Team[];
  showTeamError: boolean;
  onChange: (patch: Partial<AwardResult>) => void;
  onDelete: () => void;
}

export function ResultRow({
  result,
  index,
  teams,
  showTeamError,
  onChange,
  onDelete,
}: ResultRowProps) {
  const teamFieldId = `team-${result.id}`;
  const rankFieldId = `rank-${result.id}`;

  const handleSelectTeam = (value: string) => {
    const teamId = Number(value);
    const team = teams.find((t) => t.hackathon_team_id === teamId);
    if (!team) return;
    onChange({
      hackathonTeamId: team.hackathon_team_id,
      teamName: team.name,
      members: team.members.map((m) => m.user_name),
    });
  };

  return (
    <div className="space-y-4 rounded-md border p-4">
      <div className="flex items-start justify-between gap-2">
        <span className="text-muted-foreground text-sm">#{index + 1}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="행 삭제"
          className="text-destructive shrink-0"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_8rem]">
        <div className="space-y-2">
          <Label htmlFor={teamFieldId}>
            팀 <span className="text-destructive">*</span>
          </Label>
          {teams.length === 0 ? (
            <Input
              id={teamFieldId}
              value={result.teamName}
              aria-invalid={showTeamError}
              placeholder="등록된 팀이 없어 직접 입력합니다"
              onChange={(e) =>
                onChange({ teamName: e.target.value, hackathonTeamId: null })
              }
            />
          ) : (
            <Select
              value={
                result.hackathonTeamId !== null
                  ? String(result.hackathonTeamId)
                  : undefined
              }
              onValueChange={handleSelectTeam}
            >
              <SelectTrigger id={teamFieldId} aria-invalid={showTeamError}>
                <SelectValue placeholder="팀 선택" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem
                    key={team.hackathon_team_id}
                    value={String(team.hackathon_team_id)}
                  >
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {showTeamError && (
            <p className="text-destructive text-sm">팀을 선택해주세요.</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={rankFieldId}>순위</Label>
          <Select
            value={result.rank === null ? SPECIAL_VALUE : String(result.rank)}
            onValueChange={(value) =>
              onChange({
                rank: value === SPECIAL_VALUE ? null : Number(value),
              })
            }
          >
            <SelectTrigger id={rankFieldId}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SPECIAL_VALUE}>특별상</SelectItem>
              {RANK_OPTIONS.map((rank) => (
                <SelectItem key={rank} value={String(rank)}>
                  {rank}위
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-muted-foreground text-xs">팀원</Label>
        {result.members.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {result.members.map((member, i) => (
              <li
                key={`${result.id}-${i}`}
                className="bg-muted rounded-full px-2.5 py-1 text-xs"
              >
                {member}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">
            팀을 선택하면 팀원이 자동으로 표시됩니다.
          </p>
        )}
      </div>
    </div>
  );
}
