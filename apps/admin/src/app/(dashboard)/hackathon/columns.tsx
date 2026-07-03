"use client";

import { SortableHeader } from "@/components/list/sortable-header";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { HACKATHON_STATUS_LABELS, type Hackathon } from "./types";

const STATUS_BADGE_CLASS: Record<Hackathon["status"], string> = {
  RECRUITING: "border-blue-500 bg-blue-50 text-blue-700",
  TEAM_BUILDING: "border-indigo-500 bg-indigo-50 text-indigo-700",
  IN_PROGRESS: "border-green-500 bg-green-50 text-green-700",
  JUDGING: "border-yellow-500 bg-yellow-50 text-yellow-700",
  ENDED: "border-gray-500 bg-gray-50 text-gray-700",
};

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
    header: () => <div className="text-center text-sm">기수</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.held_year}-{row.original.held_semester} /{" "}
        {row.original.event_round}회
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center text-sm">상태</div>,
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="text-center">
          <Badge variant="outline" className={STATUS_BADGE_CLASS[status]}>
            {HACKATHON_STATUS_LABELS[status]}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "starts_at",
    header: ({ column }) => (
      <SortableHeader column={column}>기간</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-center text-sm">
        {formatDate(row.original.starts_at)} ~{" "}
        {formatDate(row.original.ends_at)}
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: () => <div className="text-center text-sm">장소</div>,
    cell: ({ row }) => (
      <div className="text-center text-sm">{row.original.location ?? "-"}</div>
    ),
  },
];
