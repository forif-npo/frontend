"use client";

import { SortableHeader } from "@/components/list/sortable-header";
import { ColumnDef } from "@tanstack/react-table";
import { HACKATHON_STATUS_LABELS, type Hackathon } from "./types";

function formatDate(value?: string) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}

export const columns: ColumnDef<Hackathon>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <SortableHeader column={column}>해커톤</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.original.title || `${row.original.event_round}회 해커톤`}
      </div>
    ),
  },
  {
    accessorKey: "held_year",
    header: () => <div className="text-center text-xs">기수</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.held_year}-{row.original.held_semester} /{" "}
        {row.original.event_round}회
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center text-xs">상태</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {HACKATHON_STATUS_LABELS[row.original.status]}
      </div>
    ),
  },
  {
    accessorKey: "starts_at",
    header: ({ column }) => (
      <SortableHeader column={column}>기간</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-center text-xs">
        {formatDate(row.original.starts_at)} ~{" "}
        {formatDate(row.original.ends_at)}
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: () => <div className="text-center text-xs">장소</div>,
    cell: ({ row }) => (
      <div className="text-center text-xs">{row.original.location ?? "-"}</div>
    ),
  },
];
