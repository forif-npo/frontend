"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Mentor } from "./types";

export const columns: ColumnDef<Mentor>[] = [
  {
    accessorKey: "userId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto w-full justify-center p-0 text-sm hover:bg-transparent"
        >
          학번
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("userId")}</div>
    ),
  },
  {
    accessorKey: "department",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto w-full justify-center p-0 text-sm hover:bg-transparent"
        >
          학과
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("department")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto w-full justify-center p-0 text-sm hover:bg-transparent"
        >
          이름
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
