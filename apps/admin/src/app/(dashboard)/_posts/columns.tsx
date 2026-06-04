"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
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
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto w-full justify-center p-0 text-sm hover:bg-transparent"
      >
        ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.original.postId}</div>,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto w-full justify-center p-0 text-sm hover:bg-transparent"
      >
        제목
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
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
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto w-full justify-center p-0 text-sm hover:bg-transparent"
      >
        작성일
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center text-sm">
        {formatDate(row.original.createdAt)}
      </div>
    ),
  },
];
