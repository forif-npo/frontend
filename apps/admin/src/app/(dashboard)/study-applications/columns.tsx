"use client";

import { SortableHeader } from "@/components/list/sortable-header";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import type { StudyApplication } from "./types";

export const STUDY_APPLICATION_STATUS_LABELS: Record<
  StudyApplication["status"],
  string
> = {
  PENDING: "대기",
  ACCEPT: "합격",
  REJECT: "불합격",
};

const STATUS_BADGE_CLASS_NAMES: Record<StudyApplication["status"], string> = {
  PENDING: "border-border-warning bg-warning-5 text-text-warning",
  ACCEPT: "border-border-success bg-success-5 text-text-success",
  REJECT: "border-border-danger bg-danger-5 text-text-danger",
};

export const applicationColumns: ColumnDef<StudyApplication>[] = [
  {
    accessorKey: "userName",
    header: ({ column }) => (
      <SortableHeader column={column}>이름</SortableHeader>
    ),
  },
  {
    accessorKey: "userId",
    header: ({ column }) => (
      <SortableHeader column={column}>학번</SortableHeader>
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.getValue("userId")}</span>
    ),
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <SortableHeader column={column}>학과</SortableHeader>
    ),
    cell: ({ row }) => row.getValue("department") || "-",
  },
  {
    accessorKey: "studyName",
    header: ({ column }) => (
      <SortableHeader column={column}>스터디</SortableHeader>
    ),
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <SortableHeader column={column}>순위</SortableHeader>
    ),
    cell: ({ row }) => `${row.getValue<number>("priority")}순위`,
  },
  {
    accessorKey: "status",
    header: "처리 상태",
    cell: ({ row }) => {
      const status = row.getValue<StudyApplication["status"]>("status");
      return (
        <Badge variant="outline" className={STATUS_BADGE_CLASS_NAMES[status]}>
          {STUDY_APPLICATION_STATUS_LABELS[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "appliedAt",
    header: ({ column }) => (
      <SortableHeader column={column}>신청일자</SortableHeader>
    ),
    cell: ({ row }) =>
      row.getValue<string>("appliedAt").replace("T", " ").slice(0, 16) || "-",
  },
];
