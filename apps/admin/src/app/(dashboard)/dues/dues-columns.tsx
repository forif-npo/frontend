"use client";
import { Badge } from "@/components/ui/badge";
import { SortableHeader } from "@/components/list/sortable-header";
import type { ColumnDef } from "@tanstack/react-table";
import type { DuesMember } from "./types";

function statusBadge(value: boolean, done: string, pending: string) {
  return (
    <div className="text-center">
      <Badge
        variant="outline"
        className={
          value
            ? "border-border-success bg-success-5 text-text-success"
            : "border-border-gray bg-surface-gray-subtler text-text-subtle"
        }
      >
        {value ? done : pending}
      </Badge>
    </div>
  );
}

export const duesColumns: ColumnDef<DuesMember>[] = [
  {
    accessorKey: "userName",
    header: ({ column }) => (
      <SortableHeader column={column}>이름</SortableHeader>
    ),
    cell: ({ row }) => row.getValue("userName"),
  },
  {
    accessorKey: "userId",
    header: ({ column }) => (
      <SortableHeader column={column}>학번</SortableHeader>
    ),
    cell: ({ row }) => row.getValue("userId"),
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
      statusBadge(
        row.getValue<boolean>("googleFormSubmitted"),
        "제출",
        "미제출",
      ),
  },
  {
    accessorKey: "duesPaid",
    header: ({ column }) => (
      <SortableHeader column={column}>입금 확인</SortableHeader>
    ),
    cell: ({ row }) =>
      statusBadge(row.getValue<boolean>("duesPaid"), "확인", "미확인"),
  },
];
