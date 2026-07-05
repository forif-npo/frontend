"use client";

import { SortableHeader } from "@/components/list/sortable-header";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import type { AdminPost } from "./types";

function formatDate(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
}

export const postColumns: ColumnDef<AdminPost>[] = [
  {
    accessorKey: "postId",
    header: ({ column }) => <SortableHeader column={column}>ID</SortableHeader>,
    cell: ({ row }) => <div className="text-center">{row.original.postId}</div>,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <SortableHeader column={column}>제목</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="max-w-[360px] truncate font-medium">
        {row.original.title}
      </div>
    ),
  },
  {
    accessorKey: "tag",
    header: () => <div className="text-center text-sm">태그</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.tag ? (
          <Badge variant="outline">{row.original.tag}</Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "authorName",
    header: () => <div className="text-center text-sm">작성자</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.authorName || "-"}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader column={column}>작성일</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-center text-sm">
        {formatDate(row.original.createdAt)}
      </div>
    ),
  },
];
