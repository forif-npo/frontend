"use client";
import { Badge } from "@/components/ui/badge";
import { SortableHeader } from "@/components/list/sortable-header";
import { ColumnDef } from "@tanstack/react-table";
import { HACKATHON_STATUS_LABELS, type Hackathon } from "./types";

const STATUS_BADGE_CLASS_NAMES: Record<Hackathon["status"], string> = {
  RECRUITING: "border-border-success bg-success-5 text-text-success",
  TEAM_BUILDING: "border-border-primary bg-primary-5 text-text-primary",
  IN_PROGRESS: "border-border-danger bg-danger-5 text-text-danger",
  JUDGING: "border-border-warning bg-warning-5 text-text-warning",
  ENDED: "border-border-gray bg-surface-gray-subtler text-text-subtle",
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
      <div className="text-center">
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
        <Badge
          variant="outline"
          className={STATUS_BADGE_CLASS_NAMES[row.original.status]}
        >
          {HACKATHON_STATUS_LABELS[row.original.status]}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "starts_at",
    header: ({ column }) => (
      <SortableHeader column={column}>기간</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {formatDate(row.original.starts_at)} ~{" "}
        {formatDate(row.original.ends_at)}
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: () => <div className="text-center text-xs">장소</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.location ?? "-"}</div>
    ),
  },
];
