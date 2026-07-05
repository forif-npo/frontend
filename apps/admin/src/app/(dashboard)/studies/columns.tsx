"use client";

import { Badge } from "@/components/ui/badge";
import { SortableHeader } from "@/components/list/sortable-header";
import { ColumnDef } from "@tanstack/react-table";
import { Study } from "./types";

export const columns: ColumnDef<Study>[] = [
  {
    accessorKey: "study_name",
    header: ({ column }) => (
      <SortableHeader column={column}>스터디명</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("study_name")}</div>
    ),
  },
  {
    accessorKey: "primary_mentor_name",
    header: ({ column }) => (
      <SortableHeader column={column}>멘토</SortableHeader>
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
        <div className="flex flex-wrap justify-center gap-1">
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
    header: ({ column }) => (
      <SortableHeader column={column}>멘티수</SortableHeader>
    ),
    cell: ({ row }) => {
      const count = row.getValue("mentee_count") as number;
      return <div className="text-center">{count}명</div>;
    },
  },
  {
    accessorKey: "recruit_status",
    header: () => <div className="text-center text-sm">모집상태</div>,
    cell: ({ row }) => {
      const status = row.getValue("recruit_status") as string;
      const isOpen = status === "APPLICABLE";

      return (
        <div className="text-center">
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
        </div>
      );
    },
  },
  {
    accessorKey: "one_liner",
    header: () => <div className="text-center text-sm">한 줄 소개</div>,
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate" title={row.getValue("one_liner")}>
        {row.getValue("one_liner")}
      </div>
    ),
  },
];
