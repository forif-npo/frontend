"use client";

import { SearchBar } from "@/components/list/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Award,
  Criterion,
  EvaluationSummary,
  Participant,
  ParticipantStatus,
  Team,
} from "@core/types/hackathon";
import { Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import {
  PARTICIPANT_STATUS_LABELS,
  PARTICIPANT_STUDY_ROLE_LABELS,
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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ParticipantStatus | "ALL">(
    "ALL",
  );
  const [studyFilter, setStudyFilter] = useState<string>("ALL");

  const studyOptions = useMemo(() => {
    const optionMap = new Map<number, string>();

    participants.forEach((participant) => {
      participant.studies?.forEach((study) => {
        optionMap.set(study.study_id, study.study_name ?? "이름 없는 스터디");
      });
    });

    return Array.from(optionMap.entries())
      .map(([studyId, studyName]) => ({ studyId, studyName }))
      .sort((a, b) => a.studyName.localeCompare(b.studyName, "ko"));
  }, [participants]);

  const filteredParticipants = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return participants.filter((participant) => {
      const studies = participant.studies ?? [];
      const userName = participant.user_name ?? "";
      const matchesSearch =
        keyword.length === 0 ||
        userName.toLowerCase().includes(keyword) ||
        String(participant.user_id).includes(keyword) ||
        studies.some((study) =>
          (study.study_name ?? "").toLowerCase().includes(keyword),
        );

      const matchesStatus =
        statusFilter === "ALL" || participant.status === statusFilter;

      const matchesStudy =
        studyFilter === "ALL" ||
        studies.some((study) => String(study.study_id) === studyFilter);

      return matchesSearch && matchesStatus && matchesStudy;
    });
  }, [participants, search, statusFilter, studyFilter]);

  const hasFilter =
    search.trim().length > 0 || statusFilter !== "ALL" || studyFilter !== "ALL";

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setStudyFilter("ALL");
  };

  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="이름, 학번, 스터디 검색"
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select
            value={studyFilter}
            onValueChange={(value) => setStudyFilter(value)}
          >
            <SelectTrigger className="h-10 w-full sm:w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">전체 스터디</SelectItem>
              {studyOptions.map((study) => (
                <SelectItem key={study.studyId} value={String(study.studyId)}>
                  {study.studyName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as ParticipantStatus | "ALL")
            }
          >
            <SelectTrigger className="h-10 w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">전체 상태</SelectItem>
              <SelectItem value="REGISTERED">참가</SelectItem>
              <SelectItem value="CANCELED">취소</SelectItem>
            </SelectContent>
          </Select>
          {hasFilter && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-10"
              onClick={resetFilters}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              초기화
            </Button>
          )}
        </div>
      </div>

      {participants.length === 0 ? (
        <EmptyState>참가자가 없습니다.</EmptyState>
      ) : filteredParticipants.length === 0 ? (
        <EmptyState>조건에 맞는 참가자가 없습니다.</EmptyState>
      ) : (
        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">이름</th>
                <th className="px-4 py-3 text-left font-medium">학번</th>
                <th className="px-4 py-3 text-left font-medium">스터디</th>
                <th className="px-4 py-3 text-center font-medium">상태</th>
                <th className="px-4 py-3 text-right font-medium">등록일</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {filteredParticipants.map((participant) => (
                <tr key={participant.participant_id}>
                  <td className="px-4 py-3 font-medium">
                    {participant.user_name ?? "-"}
                  </td>
                  <td className="text-muted-foreground px-4 py-3">
                    {participant.user_id}
                  </td>
                  <td className="px-4 py-3">
                    {(participant.studies?.length ?? 0) > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {participant.studies?.map((study) => (
                          <Badge
                            key={`${study.role}-${study.study_id}`}
                            variant="outline"
                            className={
                              study.role === "MENTOR"
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-slate-300 bg-slate-50 text-slate-700"
                            }
                          >
                            {study.study_name ?? "-"}
                            <span className="ml-1 text-[11px] opacity-70">
                              {PARTICIPANT_STUDY_ROLE_LABELS[study.role]}
                            </span>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
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
        총 {filteredParticipants.length}명 / 전체 {participants.length}명
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
