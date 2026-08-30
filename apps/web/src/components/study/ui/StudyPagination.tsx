"use client";
import { Pagination } from "@ui/components/client";

interface StudyPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const StudyPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: StudyPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className={className}>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};
