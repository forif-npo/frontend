"use client";

import { SortableHeader } from "@/components/list/sortable-header";
import type { ColumnDef } from "@tanstack/react-table";
import type { StudyApplication } from "./types";

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
    accessorKey: "appliedAt",
    header: ({ column }) => (
      <SortableHeader column={column}>신청일자</SortableHeader>
    ),
    cell: ({ row }) =>
      row.getValue<string>("appliedAt").replace("T", " ").slice(0, 16) || "-",
  },
];
