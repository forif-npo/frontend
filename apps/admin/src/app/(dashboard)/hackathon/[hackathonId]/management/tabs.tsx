"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  Award,
  Criterion,
  EvaluationSummary,
  Participant,
  Team,
} from "@core/types/hackathon";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  PARTICIPANT_STATUS_LABELS,
  TEAM_STATUS_LABELS,
  formatDate,
} from "./types";

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-muted-foreground rounded-md border py-10 text-center text-sm">
      {children}
    </div>
  );
}

export function ParticipantsTab({
  participants,
}: {
  participants: Participant[];
}) {
  return (
    <>
      {participants.length === 0 ? (
        <EmptyState>참가자가 없습니다.</EmptyState>
      ) : (
        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">이름</th>
                <th className="px-4 py-3 text-left font-medium">학번</th>
                <th className="px-4 py-3 text-center font-medium">상태</th>
                <th className="px-4 py-3 text-right font-medium">등록일</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {participants.map((participant) => (
                <tr key={participant.participant_id}>
                  <td className="px-4 py-3 font-medium">
                    {participant.user_name}
                  </td>
                  <td className="text-muted-foreground px-4 py-3">
                    {participant.user_id}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      variant="outline"
                      className={
                        participant.status === "REGISTERED"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-400 bg-gray-50 text-gray-600"
                      }
                    >
                      {PARTICIPANT_STATUS_LABELS[participant.status]}
                    </Badge>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-right">
                    {formatDate(participant.registered_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="text-muted-foreground text-sm">
        총 {participants.length}명
      </div>
    </>
  );
}

export function TeamsTab({
  teams,
  onDeleteTeam,
}: {
  teams: Team[];
  onDeleteTeam: (team: Team) => void;
}) {
  return (
    <>
      {teams.length === 0 ? (
        <EmptyState>등록된 팀이 없습니다.</EmptyState>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {teams.map((team) => (
            <div
              key={team.hackathon_team_id}
              className="space-y-3 rounded-md border p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{team.name}</p>
                    <Badge variant="outline">
                      {TEAM_STATUS_LABELS[team.status]}
                    </Badge>
                  </div>
                  {team.topic && (
                    <p className="text-muted-foreground mt-1 text-sm">
                      {team.topic}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive shrink-0"
                  onClick={() => onDeleteTeam(team)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-muted-foreground text-sm">
                팀장 {team.leader_name} · {team.member_count}명
              </div>

              <ul className="flex flex-wrap gap-1.5">
                {team.members.map((member) => (
                  <li
                    key={member.user_id}
                    className="bg-muted rounded-full px-2.5 py-1 text-xs"
                  >
                    {member.user_name}
                    {member.role === "LEADER" && (
                      <span className="text-muted-foreground"> (팀장)</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <div className="text-muted-foreground text-sm">총 {teams.length}팀</div>
    </>
  );
}

export function CriteriaTab({
  criteria,
  onCreate,
  onEdit,
  onDelete,
}: {
  criteria: Criterion[];
  onCreate: () => void;
  onEdit: (criterion: Criterion) => void;
  onDelete: (criterion: Criterion) => void;
}) {
  return (
    <>
      <div className="flex justify-end">
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          평가 기준 추가
        </Button>
      </div>

      {criteria.length === 0 ? (
        <EmptyState>등록된 평가 기준이 없습니다.</EmptyState>
      ) : (
        <div className="divide-border divide-y rounded-md border">
          {criteria.map((criterion) => (
            <div
              key={criterion.criterion_id}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">
                    #{criterion.display_order}
                  </span>
                  <p className="font-medium">{criterion.name}</p>
                  <Badge variant="outline">
                    만점 {criterion.max_score} · 가중치 {criterion.weight}
                  </Badge>
                </div>
                {criterion.description && (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {criterion.description}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(criterion)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => onDelete(criterion)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export function EvaluationTab({
  teams,
  summaryByTeam,
  onScore,
}: {
  teams: Team[];
  summaryByTeam: Map<number, EvaluationSummary>;
  onScore: (team: Team) => void;
}) {
  return teams.length === 0 ? (
    <EmptyState>등록된 팀이 없습니다.</EmptyState>
  ) : (
    <div className="overflow-hidden rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium">팀</th>
            <th className="px-4 py-3 text-center font-medium">평가자</th>
            <th className="px-4 py-3 text-center font-medium">평균점수</th>
            <th className="px-4 py-3 text-center font-medium">합계</th>
            <th className="px-4 py-3 text-right font-medium">심사</th>
          </tr>
        </thead>
        <tbody className="divide-border divide-y">
          {teams.map((team) => {
            const s = summaryByTeam.get(team.hackathon_team_id);
            return (
              <tr key={team.hackathon_team_id}>
                <td className="px-4 py-3">
                  <p className="font-medium">{team.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {team.leader_name} · {team.member_count}명
                  </p>
                </td>
                <td className="px-4 py-3 text-center">
                  {s?.evaluator_count ?? 0}명
                </td>
                <td className="px-4 py-3 text-center">
                  {s ? s.average_total_score.toFixed(2) : "-"}
                </td>
                <td className="px-4 py-3 text-center">
                  {s ? s.sum_total_score.toFixed(1) : "-"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onScore(team)}
                  >
                    점수 입력
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function AwardsTab({
  awards,
  teamName,
  onCreate,
  onEdit,
  onDelete,
}: {
  awards: Award[];
  teamName: (teamId: number) => string;
  onCreate: () => void;
  onEdit: (award: Award) => void;
  onDelete: (award: Award) => void;
}) {
  return (
    <>
      <div className="flex justify-end">
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          수상 등록
        </Button>
      </div>

      {awards.length === 0 ? (
        <EmptyState>등록된 수상 내역이 없습니다.</EmptyState>
      ) : (
        <div className="divide-border divide-y rounded-md border">
          {awards.map((award) => (
            <div
              key={award.award_id}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{award.award_name}</p>
                  {typeof award.award_rank === "number" && (
                    <Badge variant="outline">{award.award_rank}위</Badge>
                  )}
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {award.team_name || teamName(award.hackathon_team_id)}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(award)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => onDelete(award)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
