"use client";
import React from "react";
import { Select } from "@ui/components/client/Select";

interface StudyResultsHeaderProps {
  totalItems: number;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  sortBy: "latest" | "popular";
  onSortChange: (sort: "latest" | "popular") => void;
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
        <span className="text-primary-primary-50">{totalItems}</span>개
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

        <div className="flex items-center gap-3">
          <p className="text-body-medium whitespace-nowrap font-bold">
            정렬기준
          </p>
          <div className="flex items-center font-normal">
            <button
              onClick={() =>
                onSortChange(sortBy === "latest" ? "popular" : "latest")
              }
              className="bg-action-secondary border-border-transparency rounded-small2 text-label-medium text-text-basic border px-2 py-0"
            >
              {sortBy === "latest" ? "최신순" : "오래된 순"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
