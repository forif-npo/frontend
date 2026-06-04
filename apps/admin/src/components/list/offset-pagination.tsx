"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OffsetPaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function OffsetPagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}: OffsetPaginationProps) {
  const safeTotalPages = Math.max(totalPages, 1);
  const safeCurrentPage = Math.min(
    Math.max(currentPage, 0),
    safeTotalPages - 1,
  );
  const from = totalElements === 0 ? 0 : safeCurrentPage * pageSize + 1;
  const to = Math.min((safeCurrentPage + 1) * pageSize, totalElements);

  return (
    <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-3 text-sm">
      <span>
        총 {totalElements}건
        {totalElements > 0 && (
          <>
            {" "}
            · {from}-{to}
          </>
        )}
      </span>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={safeCurrentPage <= 0}
          onClick={() => onPageChange(safeCurrentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          이전
        </Button>
        <span className="text-foreground min-w-20 text-center font-medium">
          {safeCurrentPage + 1} / {safeTotalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={safeCurrentPage >= safeTotalPages - 1}
          onClick={() => onPageChange(safeCurrentPage + 1)}
        >
          다음
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
