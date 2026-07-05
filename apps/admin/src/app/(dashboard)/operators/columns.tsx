"use client";

import { ColumnDef } from "@tanstack/react-table";

import { SortableHeader } from "@/components/list/sortable-header";
import { Operator } from "./types";

export const columns: ColumnDef<Operator>[] = [
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
      <SortableHeader column={column}>부서</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("department")}</div>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <SortableHeader column={column}>직급</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("title")}</div>
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
    header: () => (
      <div className="text-center text-sm hover:bg-transparent">전화번호</div>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("phoneNum")}</div>
    ),
  },
];
