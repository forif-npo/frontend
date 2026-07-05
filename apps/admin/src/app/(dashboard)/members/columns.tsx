"use client";

import { ColumnDef } from "@tanstack/react-table";

import { SortableHeader } from "@/components/list/sortable-header";
import { Member } from "./types";

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "userId",
    header: ({ column }) => (
      <SortableHeader column={column}>학번</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("userId")}</div>
    ),
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <SortableHeader column={column}>학과</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("department")}</div>
    ),
  },
  {
    accessorKey: "userName",
    header: ({ column }) => (
      <SortableHeader column={column}>이름</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("userName")}</div>
    ),
  },
  {
    accessorKey: "phoneNum",
    header: () => <div className="w-full text-center text-sm">전화번호</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("phoneNum")}</div>
    ),
  },
  {
    accessorKey: "isMentor",
    header: () => <div className="w-full text-center text-sm">멘토 여부</div>,
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
    header: () => <div className="w-full text-center text-sm">운영진 여부</div>,
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
