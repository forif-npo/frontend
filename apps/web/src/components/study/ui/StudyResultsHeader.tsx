"use client";
import React from "react";
import { Select } from "@ui/components/client/Select";
import { StudySortControl } from "./StudySortControl";

interface StudyResultsHeaderProps {
  totalItems: number;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  sortBy: "latest" | "oldest";
  onSortChange: (sort: "latest" | "oldest") => void;
  className?: string;
}

const PAGE_SIZE_OPTIONS = [12, 24, 36, 48];

export const StudyResultsHeader: React.FC<StudyResultsHeaderProps> = ({
  totalItems,
  pageSize,
  onPageSizeChange,
  sortBy,
  onSortChange,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-7 ${className}`}>
      <p className="text-body-large grow font-bold">
        <span>검색 결과 </span>
        <span className="text-text-primary">{totalItems}</span>개
      </p>

      <div className="flex shrink-0 items-center gap-3">
        <div className="flex items-center gap-3">
          <p className="text-body-medium whitespace-nowrap font-bold">
            목록 표시 개수
          </p>
          <Select
            id="page-size-select"
            variant="text"
            size="sm"
            noPadding
            placeholder={`${pageSize}개`}
            value={String(pageSize)}
            onChange={(val) => onPageSizeChange(Number(val))}
            options={PAGE_SIZE_OPTIONS.map((size) => ({
              value: String(size),
              label: `${size}개`,
            }))}
            dropdownAlign="right"
          />
        </div>

        <div className="bg-divider-gray h-4 w-[1px]" />

        <StudySortControl value={sortBy} onChange={onSortChange} />
      </div>
    </div>
  );
};
