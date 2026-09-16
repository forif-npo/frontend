"use client";
import { SearchBar } from "@/components/list/search-bar";
import { DataTable } from "@/components/list/data-table";
import { DropdownMenuItem } from "@/components/list/dropdown-menu";
import { SortableHeader } from "@/components/list/sortable-header";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@ui/components/server";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Award, Criterion, EvaluationSummary, Participant, ParticipantStatus, Team } from "@core/types/hackathon";
import { Plus, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { PARTICIPANT_STATUS_LABELS, TEAM_STATUS_LABELS, formatDate } from "./types";

function getSortedTeamMembers(members: Team["members"]) {
  return [...members].sort((left, right) => {
    if (left.role === "LEADER" && right.role !== "LEADER") return -1;
    if (left.role !== "LEADER" && right.role === "LEADER") return 1;

    return left.user_name.localeCompare(right.user_name, "ko");
  });
}

function formatTeamMembers(members: Team["members"]) {
  return getSortedTeamMembers(members)
    .map(
      (member) =>
        `${member.user_name}${member.role === "LEADER" ? "(팀장)" : ""}`,
    )
    .join(", ");
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

  const columns = useMemo<ColumnDef<Participant>[]>(
    () => [
      {
        accessorKey: "user_name",
        header: ({ column }) => (
          <SortableHeader column={column}>이름</SortableHeader>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.original.user_name ?? "-"}</div>
        ),
      },
      {
        accessorKey: "user_id",
        header: ({ column }) => (
          <SortableHeader column={column}>학번</SortableHeader>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.original.user_id}</div>
        ),
      },
      {
        id: "studies",
        accessorFn: (participant) =>
          (participant.studies ?? [])
            .map((study) => study.study_name ?? "")
            .join(" "),
        header: ({ column }) => (
          <SortableHeader column={column}>스터디</SortableHeader>
        ),
        size: 360,
        minSize: 300,
        cell: ({ row }) => {
          const studies = row.original.studies ?? [];
          return studies.length > 0 ? (
            <div className="text-center">
              {studies
                .map(
                  (study) =>
                    `${study.study_name ?? "-"}${study.role === "MENTOR" ? "(멘토)" : ""}`,
                )
                .join(", ")}
            </div>
          ) : (
            <div className="text-center">-</div>
          );
        },
      },
      {
        id: "status",
        accessorFn: (participant) =>
          PARTICIPANT_STATUS_LABELS[participant.status],
        header: ({ column }) => (
          <SortableHeader column={column}>상태</SortableHeader>
        ),
        size: 112,
        minSize: 112,
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
        header: ({ column }) => (
          <SortableHeader column={column}>등록일</SortableHeader>
        ),
        size: 160,
        minSize: 160,
        cell: ({ row }) => (
          <div className="text-center">
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
        header: ({ column }) => (
          <SortableHeader column={column}>팀</SortableHeader>
        ),
        cell: ({ row }) => row.original.name,
      },
      {
        accessorKey: "topic",
        header: ({ column }) => (
          <SortableHeader column={column}>주제</SortableHeader>
        ),
        cell: ({ row }) => (
          <div className="text-left">{row.original.topic || "-"}</div>
        ),
      },
      {
        accessorKey: "leader_name",
        header: ({ column }) => (
          <SortableHeader column={column}>팀장</SortableHeader>
        ),
      },
      {
        accessorKey: "member_count",
        header: ({ column }) => (
          <SortableHeader column={column}>인원</SortableHeader>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.original.member_count}명</div>
        ),
      },
      {
        id: "status",
        accessorFn: (team) => TEAM_STATUS_LABELS[team.status],
        header: ({ column }) => (
          <SortableHeader column={column}>상태</SortableHeader>
        ),
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
        accessorFn: (team) => formatTeamMembers(team.members),
        header: ({ column }) => (
          <SortableHeader column={column}>구성원</SortableHeader>
        ),
        cell: ({ row }) => formatTeamMembers(row.original.members),
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
          renderRowActions={(team) => (
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDeleteTeam(team)}
            >
              삭제
            </DropdownMenuItem>
          )}
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
        header: ({ column }) => (
          <SortableHeader column={column}>순서</SortableHeader>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.original.display_order}</div>
        ),
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <SortableHeader column={column}>평가 기준</SortableHeader>
        ),
        cell: ({ row }) => (
          <div>
            <p>{row.original.name}</p>
            {row.original.description && (
              <p className="mt-1 text-left">{row.original.description}</p>
            )}
          </div>
        ),
      },
      {
        accessorKey: "max_score",
        header: ({ column }) => (
          <SortableHeader column={column}>만점</SortableHeader>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.original.max_score}</div>
        ),
      },
      {
        accessorKey: "weight",
        header: ({ column }) => (
          <SortableHeader column={column}>가중치</SortableHeader>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.original.weight}</div>
        ),
      },
    ],
    [],
  );

  return (
    <>
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
          renderRowActions={(criterion) => (
            <>
              <DropdownMenuItem onClick={() => onEdit(criterion)}>
                수정
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(criterion)}
              >
                삭제
              </DropdownMenuItem>
            </>
          )}
          showPagination={false}
        />
      )}
      <div className="flex justify-end">
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          평가 기준 추가
        </Button>
      </div>
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
        header: ({ column }) => (
          <SortableHeader column={column}>팀</SortableHeader>
        ),
        cell: ({ row }) => (
          <>
            <p>{row.original.name}</p>
            <p>
              {row.original.leader_name} · {row.original.member_count}명
            </p>
          </>
        ),
      },
      {
        id: "evaluator_count",
        accessorFn: (team) =>
          summaryByTeam.get(team.hackathon_team_id)?.evaluator_count ?? 0,
        header: ({ column }) => (
          <SortableHeader column={column}>평가자</SortableHeader>
        ),
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
        accessorFn: (team) =>
          summaryByTeam.get(team.hackathon_team_id)?.average_total_score ?? -1,
        header: ({ column }) => (
          <SortableHeader column={column}>평균점수</SortableHeader>
        ),
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
        accessorFn: (team) =>
          summaryByTeam.get(team.hackathon_team_id)?.sum_total_score ?? -1,
        header: ({ column }) => (
          <SortableHeader column={column}>합계</SortableHeader>
        ),
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
      renderRowActions={(team) => (
        <DropdownMenuItem onClick={() => onScore(team)}>
          점수 입력
        </DropdownMenuItem>
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
        header: ({ column }) => (
          <SortableHeader column={column}>수상명</SortableHeader>
        ),
        cell: ({ row }) => <p>{row.original.award_name}</p>,
      },
      {
        accessorKey: "award_rank",
        header: ({ column }) => (
          <SortableHeader column={column}>순위</SortableHeader>
        ),
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
        accessorFn: (award) =>
          award.team_name || teamName(award.hackathon_team_id),
        header: ({ column }) => (
          <SortableHeader column={column}>수상 팀</SortableHeader>
        ),
        cell: ({ row }) =>
          row.original.team_name || teamName(row.original.hackathon_team_id),
      },
    ],
    [teamName],
  );

  return (
    <>
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
          renderRowActions={(award) => (
            <>
              <DropdownMenuItem onClick={() => onEdit(award)}>
                수정
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(award)}
              >
                삭제
              </DropdownMenuItem>
            </>
          )}
          showPagination={false}
        />
      )}
      <div className="flex justify-end">
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          수상 등록
        </Button>
      </div>
    </>
  );
}
