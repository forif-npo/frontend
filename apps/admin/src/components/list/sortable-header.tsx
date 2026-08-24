"use client";

import { Button } from "@/components/ui/button";
import type { Column } from "@tanstack/react-table";

interface SortableHeaderProps<TData> {
  column: Column<TData, unknown>;
  children: React.ReactNode;
}

export function SortableHeader<TData>({
  column,
  children,
}: SortableHeaderProps<TData>) {
  const sortDirection = column.getIsSorted();
  const isAscending = sortDirection === "asc";
  const isDescending = sortDirection === "desc";

  const handleSort = () => {
    if (sortDirection === "desc") {
      column.clearSorting();
      return;
    }

    // 이미 선택한 정렬 기준을 유지한 채, 클릭한 열을 다음 기준으로 추가한다.
    column.toggleSorting(sortDirection === "asc", true);
  };

  return (
    <Button
      variant="ghost"
      type="button"
      onClick={handleSort}
      className="h-auto w-full justify-center p-0 text-sm hover:bg-transparent"
    >
      {children}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="ml-2 h-4 w-4"
      >
        <g
          className={isAscending ? "text-foreground" : "text-muted-foreground"}
          stroke="currentColor"
          strokeWidth={isAscending ? 3 : 2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 15V3" />
          <path d="m3 7 4-4 4 4" />
        </g>
        <g
          className={isDescending ? "text-foreground" : "text-muted-foreground"}
          stroke="currentColor"
          strokeWidth={isDescending ? 3 : 2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21V9" />
          <path d="m21 17-4 4-4-4" />
        </g>
      </svg>
    </Button>
  );
}
