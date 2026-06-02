"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Study } from "../types";

const STATUS_LABELS: Record<Study["study_status"], string> = {
  PENDING: "승인 대기",
  APPROVED: "승인 완료",
  REJECTED: "반려",
  RE_APPLIED: "재신청",
};

const STATUS_BADGE_CLASS_NAMES: Record<Study["study_status"], string> = {
  PENDING: "border-yellow-500 bg-yellow-50 text-yellow-700",
  APPROVED: "border-green-500 bg-green-50 text-green-700",
  REJECTED: "border-red-500 bg-red-50 text-red-700",
  RE_APPLIED: "border-blue-500 bg-blue-50 text-blue-700",
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
    header: () => <div className="text-center text-sm">상태</div>,
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
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto w-full justify-center p-0 text-sm hover:bg-transparent"
      >
        스터디명
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
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
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto w-full justify-center p-0 text-sm hover:bg-transparent"
      >
        멘토
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
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
    header: () => <div className="text-center text-sm">태그</div>,
    cell: ({ row }) => {
      const tags = row.getValue("tags") as string[];

      if (!tags || tags.length === 0) return null;

      return (
        <div className="flex flex-wrap justify-center gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto w-full justify-center p-0 text-sm hover:bg-transparent"
      >
        신청일
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
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
