"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MentorsActions } from "./mentors-actions";
import { Mentor } from "./types";

export const columns: ColumnDef<Mentor>[] = [
  {
    accessorKey: "mentorId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          멘토 ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("mentorId")}</div>
    ),
  },
  {
    accessorKey: "mentorName",
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
      <div className="font-medium">{row.getValue("mentorName")}</div>
    ),
  },
  {
    accessorKey: "mentorNum",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          멘토 번호
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("mentorNum")}</div>
    ),
  },
  {
    id: "actions",
    header: "직업",
    cell: ({ row }) => {
      const mentor = row.original;
      return (
        <MentorsActions
          mentorId={mentor.mentorId}
          mentorName={mentor.mentorName}
        />
      );
    },
  },
];
