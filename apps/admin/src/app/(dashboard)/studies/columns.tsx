"use client";

import { Badge } from "@/components/ui/badge";
import { SortableHeader } from "@/components/list/sortable-header";
import { ColumnDef } from "@tanstack/react-table";
import { WEEK_DAY_OPTIONS } from "./constants";
import { Study } from "./types";

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

export const columns: ColumnDef<Study>[] = [
  {
    accessorKey: "recruit_status",
    size: 112,
    minSize: 112,
    header: ({ column }) => (
      <SortableHeader column={column}>모집 상태</SortableHeader>
    ),
    cell: ({ row }) => {
      const status = row.getValue("recruit_status") as string;
      const isOpen = status === "APPLICABLE";

      return (
        <div className="text-center">
          <Badge
            variant="outline"
            className={
              isOpen
                ? "border-green-500 bg-green-50 text-green-700"
                : "border-gray-500 bg-gray-50 text-gray-700"
            }
          >
            {isOpen ? "모집중" : "마감"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "study_name",
    size: 360,
    minSize: 300,
    header: ({ column }) => (
      <SortableHeader column={column}>스터디명</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("study_name")}</div>
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

      return <div className="text-center text-sm">{tags.join(", ")}</div>;
    },
  },
  {
    accessorKey: "difficulty",
    size: 96,
    minSize: 96,
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
    accessorKey: "mentee_count",
    header: ({ column }) => (
      <SortableHeader column={column}>멘티수</SortableHeader>
    ),
    cell: ({ row }) => {
      const count = row.getValue("mentee_count") as number;
      return <div className="text-center">{count}명</div>;
    },
  },
];
