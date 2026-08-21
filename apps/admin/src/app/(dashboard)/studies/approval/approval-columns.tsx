"use client";

import { SortableHeader } from "@/components/list/sortable-header";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { getStudyTagLabel, WEEK_DAY_OPTIONS } from "../constants";
import { Study } from "../types";

const STATUS_LABELS: Record<Study["study_status"], string> = {
  PENDING: "승인 대기",
  APPROVED: "승인 완료",
  STARTED: "개설됨",
  REJECTED: "반려",
  RE_APPLIED: "재신청",
};

const STATUS_BADGE_CLASS_NAMES: Record<Study["study_status"], string> = {
  PENDING: "border-yellow-500 bg-yellow-50 text-yellow-700",
  APPROVED: "border-green-500 bg-green-50 text-green-700",
  STARTED: "border-emerald-600 bg-emerald-50 text-emerald-800",
  REJECTED: "border-red-500 bg-red-50 text-red-700",
  RE_APPLIED: "border-blue-500 bg-blue-50 text-blue-700",
};

const DIFFICULTY_LABELS = {
  EASY: "쉬움",
  SEMI_EASY: "조금 쉬움",
  NORMAL: "보통",
  SEMI_HARD: "조금 어려움",
  HARD: "어려움",
} as const;

const DIFFICULTY_ORDER: Record<NonNullable<Study["difficulty"]>, number> = {
  EASY: 1,
  SEMI_EASY: 2,
  NORMAL: 3,
  SEMI_HARD: 4,
  HARD: 5,
};

function formatDateTime(value: string) {
  if (!value) return "-";

  const [date, time] = value.split("T");
  const formattedDate = date?.replaceAll("-", ".") ?? "-";
  const formattedTime = time?.slice(0, 5);

  return formattedTime ? `${formattedDate} ${formattedTime}` : formattedDate;
}

export const approvalColumns: ColumnDef<Study>[] = [
  {
    accessorKey: "study_status",
    header: ({ column }) => (
      <SortableHeader column={column}>개설 상태</SortableHeader>
    ),
    cell: ({ row }) => {
      const status = row.getValue("study_status") as Study["study_status"];

      return (
        <div className="text-center">
          <Badge variant="outline" className={STATUS_BADGE_CLASS_NAMES[status]}>
            {STATUS_LABELS[status]}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "study_name",
    header: ({ column }) => (
      <SortableHeader column={column}>스터디명</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("study_name")}
      </div>
    ),
  },
  {
    accessorKey: "primary_mentor_name",
    header: ({ column }) => (
      <SortableHeader column={column}>멘토</SortableHeader>
    ),
    cell: ({ row }) => {
      const primary = row.original.primary_mentor_name;
      const secondary = row.original.secondary_mentor_name;

      return (
        <div className="text-center">
          <span>{primary}</span>
          {secondary && <span className="ml-1">({secondary})</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "tags",
    header: ({ column }) => (
      <SortableHeader column={column}>태그</SortableHeader>
    ),
    cell: ({ row }) => {
      const tags = row.getValue("tags") as string[];

      if (!tags || tags.length === 0) return null;

      return (
        <div className="text-center text-sm">
          {tags.map(getStudyTagLabel).join(", ")}
        </div>
      );
    },
  },
  {
    accessorKey: "difficulty",
    sortingFn: (rowA, rowB, columnId) => {
      const difficultyA = rowA.getValue<Study["difficulty"]>(columnId);
      const difficultyB = rowB.getValue<Study["difficulty"]>(columnId);
      const orderA = difficultyA ? DIFFICULTY_ORDER[difficultyA] : 0;
      const orderB = difficultyB ? DIFFICULTY_ORDER[difficultyB] : 0;

      return orderA - orderB;
    },
    header: ({ column }) => (
      <SortableHeader column={column}>난이도</SortableHeader>
    ),
    cell: ({ row }) => {
      const difficulty = row.getValue("difficulty") as Study["difficulty"];

      return (
        <div className="text-center text-sm">
          {difficulty ? DIFFICULTY_LABELS[difficulty] : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "week_day",
    header: ({ column }) => (
      <SortableHeader column={column}>요일</SortableHeader>
    ),
    cell: ({ row }) => {
      const weekDay = row.getValue("week_day") as Study["week_day"];
      const label = WEEK_DAY_OPTIONS.find(
        (option) => option.value === String(weekDay),
      )?.label;

      return <div className="text-center text-sm">{label ?? "-"}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <SortableHeader column={column}>신청일</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-center text-sm">
        {formatDateTime(row.getValue("created_at"))}
      </div>
    ),
  },
  {
    accessorKey: "one_liner",
    header: () => <div className="text-center text-sm">한 줄 소개</div>,
    cell: ({ row }) => (
      <div className="max-w-[320px] truncate" title={row.getValue("one_liner")}>
        {row.getValue("one_liner")}
      </div>
    ),
  },
];
