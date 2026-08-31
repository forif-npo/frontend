"use client";

import { SearchBar } from "@/components/list/search-bar";
import { DataTable } from "@/components/list/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@ui/components/server";
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

  const columns = useMemo<ColumnDef<Participant>[]>(
    () => [
      {
        accessorKey: "user_name",
        header: "이름",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.user_name ?? "-"}</span>
        ),
      },
      {
        accessorKey: "user_id",
        header: "학번",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.user_id}</span>
        ),
      },
      {
        id: "studies",
        header: "스터디",
        cell: ({ row }) => {
          const studies = row.original.studies ?? [];
          return studies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {studies.map((study) => (
                <Badge
                  key={`${study.role}-${study.study_id}`}
                  variant="outline"
                  className={
                    study.role === "MENTOR"
                      ? "border-border-primary bg-primary-5 text-text-primary"
                      : "border-border-gray bg-surface-gray-subtler text-text-subtle"
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
          );
        },
      },
      {
        accessorKey: "status",
        header: () => <div className="text-center">상태</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <Badge
              variant="outline"
              className={
                row.original.status === "REGISTERED"
                  ? "border-border-success bg-success-5 text-text-success"
                  : "border-border-gray bg-surface-gray-subtler text-text-subtle"
              }
            >
              {PARTICIPANT_STATUS_LABELS[row.original.status]}
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: "registered_at",
        header: () => <div className="text-right">등록일</div>,
        cell: ({ row }) => (
          <div className="text-muted-foreground text-right">
            {formatDate(row.original.registered_at)}
          </div>
        ),
      },
    ],
    [],
  );

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
        <EmptyState
          title="참가자가 없습니다."
          className="rounded-md border py-10"
          textClassName="text-muted-foreground"
        />
      ) : filteredParticipants.length === 0 ? (
        <EmptyState
          title="조건에 맞는 참가자가 없습니다."
          className="rounded-md border py-10"
          textClassName="text-muted-foreground"
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredParticipants}
          getRowId={(participant) => String(participant.participant_id)}
          showPagination={false}
        />
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
  const columns = useMemo<ColumnDef<Team>[]>(
    () => [
      {
        accessorKey: "name",
        header: "팀",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "topic",
        header: "주제",
        cell: ({ row }) => row.original.topic || "-",
      },
      { accessorKey: "leader_name", header: "팀장" },
      {
        accessorKey: "member_count",
        header: () => <div className="text-center">인원</div>,
        cell: ({ row }) => (
          <div className="text-center">{row.original.member_count}명</div>
        ),
      },
      {
        accessorKey: "status",
        header: () => <div className="text-center">상태</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <Badge variant="outline">
              {TEAM_STATUS_LABELS[row.original.status]}
            </Badge>
          </div>
        ),
      },
      {
        id: "members",
        header: "구성원",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1.5">
            {row.original.members.map((member) => (
              <Badge key={member.user_id} variant="secondary">
                {member.user_name}
                {member.role === "LEADER" && " (팀장)"}
              </Badge>
            ))}
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <>
      {teams.length === 0 ? (
        <EmptyState
          title="등록된 팀이 없습니다."
          className="rounded-md border py-10"
          textClassName="text-muted-foreground"
        />
      ) : (
        <DataTable
          columns={columns}
          data={teams}
          getRowId={(team) => String(team.hackathon_team_id)}
          renderActionCell={(team) => (
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive"
              aria-label={`${team.name} 팀 삭제`}
              onClick={() => onDeleteTeam(team)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          actionColumnSize={56}
          showPagination={false}
        />
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
  const columns = useMemo<ColumnDef<Criterion>[]>(
    () => [
      {
        accessorKey: "display_order",
        header: () => <div className="text-center">순서</div>,
        cell: ({ row }) => (
          <div className="text-center">{row.original.display_order}</div>
        ),
      },
      {
        accessorKey: "name",
        header: "평가 기준",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.name}</p>
            {row.original.description && (
              <p className="text-muted-foreground mt-1 text-sm">
                {row.original.description}
              </p>
            )}
          </div>
        ),
      },
      {
        accessorKey: "max_score",
        header: () => <div className="text-center">만점</div>,
        cell: ({ row }) => (
          <div className="text-center">{row.original.max_score}</div>
        ),
      },
      {
        accessorKey: "weight",
        header: () => <div className="text-center">가중치</div>,
        cell: ({ row }) => (
          <div className="text-center">{row.original.weight}</div>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          평가 기준 추가
        </Button>
      </div>

      {criteria.length === 0 ? (
        <EmptyState
          title="등록된 평가 기준이 없습니다."
          className="rounded-md border py-10"
          textClassName="text-muted-foreground"
        />
      ) : (
        <DataTable
          columns={columns}
          data={criteria}
          getRowId={(criterion) => String(criterion.criterion_id)}
          renderActionCell={(criterion) => (
            <>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`${criterion.name} 평가 기준 수정`}
                onClick={() => onEdit(criterion)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                aria-label={`${criterion.name} 평가 기준 삭제`}
                onClick={() => onDelete(criterion)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
          actionColumnSize={96}
          showPagination={false}
        />
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
  const columns = useMemo<ColumnDef<Team>[]>(
    () => [
      {
        accessorKey: "name",
        header: "팀",
        cell: ({ row }) => (
          <>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-muted-foreground text-xs">
              {row.original.leader_name} · {row.original.member_count}명
            </p>
          </>
        ),
      },
      {
        id: "evaluator_count",
        header: () => <div className="text-center">평가자</div>,
        cell: ({ row }) => (
          <div className="text-center">
            {summaryByTeam.get(row.original.hackathon_team_id)
              ?.evaluator_count ?? 0}
            명
          </div>
        ),
      },
      {
        id: "average_total_score",
        header: () => <div className="text-center">평균점수</div>,
        cell: ({ row }) => {
          const summary = summaryByTeam.get(row.original.hackathon_team_id);
          return (
            <div className="text-center">
              {summary ? summary.average_total_score.toFixed(2) : "-"}
            </div>
          );
        },
      },
      {
        id: "sum_total_score",
        header: () => <div className="text-center">합계</div>,
        cell: ({ row }) => {
          const summary = summaryByTeam.get(row.original.hackathon_team_id);
          return (
            <div className="text-center">
              {summary ? summary.sum_total_score.toFixed(1) : "-"}
            </div>
          );
        },
      },
    ],
    [summaryByTeam],
  );

  return teams.length === 0 ? (
    <EmptyState
      title="등록된 팀이 없습니다."
      className="rounded-md border py-10"
      textClassName="text-muted-foreground"
    />
  ) : (
    <DataTable
      columns={columns}
      data={teams}
      getRowId={(team) => String(team.hackathon_team_id)}
      renderActionCell={(team) => (
        <Button variant="outline" size="sm" onClick={() => onScore(team)}>
          점수 입력
        </Button>
      )}
      showPagination={false}
    />
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
  const columns = useMemo<ColumnDef<Award>[]>(
    () => [
      {
        accessorKey: "award_name",
        header: "수상명",
        cell: ({ row }) => (
          <p className="font-medium">{row.original.award_name}</p>
        ),
      },
      {
        accessorKey: "award_rank",
        header: () => <div className="text-center">순위</div>,
        cell: ({ row }) => (
          <div className="text-center">
            {typeof row.original.award_rank === "number"
              ? `${row.original.award_rank}위`
              : "-"}
          </div>
        ),
      },
      {
        id: "team_name",
        header: "수상 팀",
        cell: ({ row }) =>
          row.original.team_name || teamName(row.original.hackathon_team_id),
      },
    ],
    [teamName],
  );

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          수상 등록
        </Button>
      </div>

      {awards.length === 0 ? (
        <EmptyState
          title="등록된 수상 내역이 없습니다."
          className="rounded-md border py-10"
          textClassName="text-muted-foreground"
        />
      ) : (
        <DataTable
          columns={columns}
          data={awards}
          getRowId={(award) => String(award.award_id)}
          renderActionCell={(award) => (
            <>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`${award.award_name} 수상 수정`}
                onClick={() => onEdit(award)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                aria-label={`${award.award_name} 수상 삭제`}
                onClick={() => onDelete(award)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
          actionColumnSize={96}
          showPagination={false}
        />
      )}
    </>
  );
}
