"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { StudyActions } from "./study-actions";
import { Study } from "./types";

export const columns: ColumnDef<Study>[] = [
  {
    accessorKey: "study_name",
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
      <div className="font-medium">{row.getValue("study_name")}</div>
    ),
  },
  {
    accessorKey: "primary_mentor_name",
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
      const primary = row.original.primary_mentor_name;
      const secondary = row.original.secondary_mentor_name;
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
    accessorKey: "tags",
    header: "태그",
    cell: ({ row }) => {
      const tags = row.getValue("tags") as string[];
      if (!tags || tags.length === 0) return null;

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

      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, idx) => {
            const index =
              tag.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
              colors.length;
            const colorClass = colors[index];

            return (
              <Badge
                key={idx}
                variant="outline"
                className={`border-0 ${colorClass}`}
              >
                {tag}
              </Badge>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "mentee_count",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          멘티수
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const count = row.getValue("mentee_count") as number;
      return <div>{count}명</div>;
    },
  },
  {
    accessorKey: "recruit_status",
    header: "모집상태",
    cell: ({ row }) => {
      const status = row.getValue("recruit_status") as string;
      const isOpen = status === "APPLICABLE";

      return (
        <Badge
          variant="outline"
          className={
            isOpen
              ? "border-green-500 bg-green-50 text-green-700"
              : "border-gray-500 bg-gray-50 text-gray-700"
          }
        >
          {isOpen ? "모집중" : "마감"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "one_liner",
    header: "한 줄 소개",
    cell: ({ row }) => (
      <div
        className="text-muted-foreground max-w-[300px] truncate"
        title={row.getValue("one_liner")}
      >
        {row.getValue("one_liner")}
      </div>
    ),
  },
  {
    id: "actions",
    header: "작업",
    cell: ({ row }) => {
      const study = row.original;
      return <StudyActions studyId={study.id} studyName={study.study_name} />;
    },
  },
];
