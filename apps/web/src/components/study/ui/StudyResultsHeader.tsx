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

const PAGE_SIZE_OPTIONS = [12, 24, 36, 48, 60];

export const StudyResultsHeader: React.FC<StudyResultsHeaderProps> = ({
  totalItems,
  pageSize,
  onPageSizeChange,
  sortBy,
  onSortChange,
  className = "",
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <p className="text-body-large-bold text-text-basic grow">
        <span>검색 결과 </span>
        <span className="text-primary-primary-50">{totalItems}</span>개
      </p>

      <div className="flex shrink-0 items-center gap-3">
        <div className="flex items-center gap-3">
          <p className="text-body-medium whitespace-nowrap font-bold">
            목록 표시 개수
          </p>
          <div className="relative flex items-center font-normal">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-action-secondary border-border-transparency text-label-medium cursor-pointer appearance-none rounded-sm border py-1 pr-5 focus:outline-none"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}개
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-0 flex items-center">
              <ArrowDropdownIcon width={16} height={16} />
            </div>
          </div>
        </div>

        <div className="h-4 w-[1px] bg-[#8A949E]" />

        <div className="flex items-center gap-3">
          <p className="text-body-medium-bold text-text-basic whitespace-nowrap">
            정렬기준
          </p>
          <div className="rounded-xlarge2 flex items-center">
            <button
              onClick={() => onSortChange("latest")}
              className="bg-action-secondary border-border-transparency rounded-small2 text-label-medium text-text-basic border px-[2px]"
            >
              최신순
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
