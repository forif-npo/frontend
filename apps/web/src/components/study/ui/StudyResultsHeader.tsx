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
const SORT_OPTIONS = ["latest", "popular"] as const;

const getSortLabel = (sort: "latest" | "popular"): string =>
  sort === "latest" ? "최신순" : "추천순";

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
      <p className="text-body-large-bold text-text-basic grow">
        <span>검색 결과 </span>
        <span className="text-primary-primary-50">{totalItems}</span>개
      </p>

      <div className="flex shrink-0 items-center gap-4">
        <div className="flex items-center gap-3">
          <p className="text-body-medium-bold text-text-basic whitespace-nowrap">
            목록 표시 개수
          </p>
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-action-secondary border-border-transparency text-label-medium text-text-basic cursor-pointer appearance-none rounded-sm border px-2 py-0 focus:outline-none"
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

        <div className="bg-divider-gray h-4 w-px" />

        <div className="flex items-center gap-3">
          <p className="text-body-medium-bold text-text-basic whitespace-nowrap">
            정렬기준
          </p>
          <div className="rounded-xlarge2 flex items-center gap-2">
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
