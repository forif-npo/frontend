"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Member } from "./types";

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "userId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          학번
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("userId")}</div>
    ),
  },
  {
    accessorKey: "department",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          학과
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("department")}</div>
    ),
  },
  {
    accessorKey: "userName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          이름
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("userName")}</div>
    ),
  },
  {
    accessorKey: "phoneNum",
    header: "전화번호",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("phoneNum")}</div>
    ),
  },
  {
    accessorKey: "currentStudyName",
    header: "스터디명",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.getValue("currentStudyName")}
      </div>
    ),
  },
  {
    accessorKey: "isMentor",
    header: "멘토 여부",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          checked={Boolean(row.getValue("isMentor"))}
          readOnly
          tabIndex={-1}
          className="pointer-events-none h-4 w-4"
        />
      </div>
    ),
  },
  {
    accessorKey: "isAdmin",
    header: "운영진 여부",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          checked={Boolean(row.getValue("isAdmin"))}
          readOnly
          tabIndex={-1}
          className="pointer-events-none h-4 w-4"
        />
      </div>
    ),
  },
];
