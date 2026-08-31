"use client";

import { SortableHeader } from "@/components/list/sortable-header";
import type { ColumnDef } from "@tanstack/react-table";
import type { DuesMember } from "./types";

function statusLabel(value: boolean, done: string, pending: string) {
  return (
    <span className={value ? "text-text-success" : "text-muted-foreground"}>
      {value ? done : pending}
    </span>
  );
}

export const duesColumns: ColumnDef<DuesMember>[] = [
  {
    accessorKey: "userName",
    header: ({ column }) => (
      <SortableHeader column={column}>이름</SortableHeader>
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("userName")}</span>
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
    accessorKey: "googleFormSubmitted",
    header: ({ column }) => (
      <SortableHeader column={column}>구글폼 제출</SortableHeader>
    ),
    cell: ({ row }) =>
      statusLabel(
        row.getValue<boolean>("googleFormSubmitted"),
        "제출",
        "미제출",
      ),
  },
  {
    accessorKey: "duesPaid",
    header: ({ column }) => (
      <SortableHeader column={column}>회비 납부</SortableHeader>
    ),
    cell: ({ row }) =>
      statusLabel(row.getValue<boolean>("duesPaid"), "납부", "미납"),
  },
];
