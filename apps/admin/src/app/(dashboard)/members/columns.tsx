"use client";

import { ColumnDef } from "@tanstack/react-table";

import { SortableHeader } from "@/components/list/sortable-header";
import { formatPhoneNumber } from "@core/utils/phone-number";
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
    header: () => <div className="w-full text-center text-xs">전화번호</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {formatPhoneNumber(row.getValue("phoneNum"))}
      </div>
    ),
  },
  {
    accessorKey: "isMentor",
    header: () => <div className="w-full text-center text-xs">멘토 이력</div>,
    cell: ({ row }) => (
      <HistoryIndicator exists={Boolean(row.getValue("isMentor"))} />
    ),
  },
  {
    accessorKey: "isAdmin",
    header: () => <div className="w-full text-center text-xs">운영진 이력</div>,
    cell: ({ row }) => (
      <HistoryIndicator exists={Boolean(row.getValue("isAdmin"))} />
    ),
  },
];

function HistoryIndicator({ exists }: { exists: boolean }) {
  return (
    <div className="flex items-center justify-center">
      {exists ? (
        <span className="text-sm">있음</span>
      ) : (
        <span className="text-muted-foreground" aria-label="이력 없음">
          —
        </span>
      )}
    </div>
  );
}
