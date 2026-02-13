"use client";
import React from "react";
import { ArrowDropdownIcon } from "@repo/assets/icons/krds";

interface StudyResultsHeaderProps {
  totalItems: number;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  sortBy: "latest" | "popular";
  onSortChange: (sort: "latest" | "popular") => void;
  className?: string;
}

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

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
        <div className="flex items-center gap-0.5">
          <p className="text-body-medium whitespace-nowrap font-bold">
            목록 표시 개수
          </p>
          <div className="relative font-normal">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-action-secondary border-border-transparency text-label-medium cursor-pointer appearance-none rounded-sm border px-2 py-0 focus:outline-none"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}개
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2">
              <ArrowDropdownIcon width={16} height={16} />
            </div>
          </div>
        </div>

        <div className="bg-text-divider-gray h-4 w-[1px]" />

        <div className="flex items-center gap-3">
          <p className="text-body-medium whitespace-nowrap font-bold">
            정렬기준
          </p>
          <div className="rounded-xlarge2 flex items-center gap-2 font-normal">
            <button
              onClick={() => onSortChange("latest")}
              className="bg-action-secondary border-border-transparency rounded-small2 text-label-medium text-text-basic border px-2 py-0"
            >
              최신순
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
