"use client";

import { ColumnDef } from "@tanstack/react-table";

import { SortableHeader } from "@/components/list/sortable-header";
import { Mentor } from "./types";

export const columns: ColumnDef<Mentor>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader column={column}>이름</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("name")}</div>
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
    accessorKey: "studyName",
    header: () => <div className="w-full text-center text-sm">스터디명</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("studyName")}</div>
    ),
  },
];
