"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Study } from "./types";

export const columns: ColumnDef<Study>[] = [
  {
    accessorKey: "studyName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          스터디명
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("studyName")}</div>
    ),
  },
  {
    accessorKey: "primaryMentorName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          멘토
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const primary = row.original.primaryMentorName;
      const secondary = row.original.secondaryMentorName;
      return (
        <div>
          <span>{primary}</span>
          {secondary && (
            <span className="text-muted-foreground ml-1 text-xs">
              ({secondary})
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "tag",
    header: "태그",
    cell: ({ row }) => {
      const tag = row.getValue("tag") as string;
      const colors = [
        "bg-blue-100 text-blue-800 hover:bg-blue-200",
        "bg-green-100 text-green-800 hover:bg-green-200",
        "bg-purple-100 text-purple-800 hover:bg-purple-200",
        "bg-pink-100 text-pink-800 hover:bg-pink-200",
        "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
        "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        "bg-red-100 text-red-800 hover:bg-red-200",
        "bg-orange-100 text-orange-800 hover:bg-orange-200",
      ];
      // Deterministic color assignment based on tag string
      const index =
        tag.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
        colors.length;
      const colorClass = colors[index];

      return (
        <Badge variant="outline" className={`border-0 ${colorClass}`}>
          {tag}
        </Badge>
      );
    },
  },
  {
    accessorKey: "difficulty",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          난이도
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const diff = row.getValue("difficulty") as number;
      return (
        <div>
          {"★".repeat(diff)}
          {"☆".repeat(5 - diff)}
        </div>
      );
    },
  },
  {
    accessorKey: "weekDay",
    header: "시간",
    cell: ({ row }) => {
      const days = ["일", "월", "화", "수", "목", "금", "토"];
      // JS Date: 0=Sun, 1=Mon. API said 1-7. Let's assume 1=Mon.
      // If 1=Mon, then array index should be 1.
      // Let's stick to a safe mapping:
      const dayMap: Record<number, string> = {
        1: "월",
        2: "화",
        3: "수",
        4: "목",
        5: "금",
        6: "토",
        7: "일",
      };

      return (
        <div>
          {dayMap[row.original.weekDay] || ""} {row.original.startTime} ~{" "}
          {row.original.endTime}
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: "장소",
  },
  {
    accessorKey: "oneLiner",
    header: "한 줄 소개",
    cell: ({ row }) => (
      <div
        className="text-muted-foreground max-w-[300px] truncate"
        title={row.getValue("oneLiner")}
      >
        {row.getValue("oneLiner")}
      </div>
    ),
  },
];
