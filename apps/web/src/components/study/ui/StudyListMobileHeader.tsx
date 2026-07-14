"use client";
import React, { useState } from "react";
import clsx from "clsx";
import { StudySearchBar } from "./StudySearchBar";
import { StudyFilterSection, getActiveFilterCount } from "./StudyFilterSection";
import { StudyActionButtons } from "./StudyActionButtons";

interface StudyListMobileHeaderProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  selectedSemester: string;
  selectedDifficulty: string;
  selectedTag: string;
  onSemesterChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onClearAllFilters: () => void;
  totalItems: number;
  loading?: boolean;
}

const MobileFilterSkeleton: React.FC = () => (
  <div className="bg-surface-secondary-subtler animate-pulse rounded-xl px-4 py-4">
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-4 w-14 shrink-0 rounded bg-gray-200" />
          <div className="h-10 flex-1 rounded-lg bg-gray-200" />
        </div>
      ))}
    </div>
  </div>
);

export const StudyListMobileHeader: React.FC<StudyListMobileHeaderProps> = ({
  searchInput,
  onSearchChange,
  onSearchSubmit,
  selectedSemester,
  selectedDifficulty,
  selectedTag,
  onSemesterChange,
  onDifficultyChange,
  onTagChange,
  onClearAllFilters,
  totalItems,
  loading = false,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filterCount = getActiveFilterCount(
    selectedSemester,
    selectedDifficulty,
    selectedTag,
  );

  return (
    <div className="z-[9999] md:hidden">
      <div className="mb-4">
        <StudySearchBar
          value={searchInput}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
          size="compact"
        />
      </div>

      <div className="mb-4">
        <StudyActionButtons size="medium" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsFilterOpen((prev) => !prev)}
          className="bg-surface-secondary-subtler flex items-center gap-2 rounded-lg px-3 py-2"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="16" y2="12" />
            <line x1="4" y1="18" x2="12" y2="18" />
          </svg>
          <span className="text-[14px] font-bold text-gray-900">필터</span>
          {filterCount > 0 && (
            <span className="bg-primary-primary-50 flex h-5 w-5 items-center justify-center rounded-full text-[11px] text-white">
              {filterCount}
            </span>
          )}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={clsx(
              "transition-transform duration-200",
              isFilterOpen && "rotate-180",
            )}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <p className="text-[14px] font-bold text-gray-700">
          {loading ? (
            <span className="inline-block h-4 w-16 animate-pulse rounded bg-gray-200" />
          ) : (
            <>
              결과 <span className="text-text-primary">{totalItems}</span>개
            </>
          )}
        </p>
      </div>

      <div
        className={clsx(
          "transition-all duration-200",
          isFilterOpen
            ? "mb-4 max-h-[600px] overflow-visible opacity-100"
            : "max-h-0 overflow-hidden opacity-0",
        )}
      >
        {loading ? (
          <MobileFilterSkeleton />
        ) : (
          <StudyFilterSection
            selectedSemester={selectedSemester}
            selectedDifficulty={selectedDifficulty}
            selectedTag={selectedTag}
            onSemesterChange={onSemesterChange}
            onDifficultyChange={onDifficultyChange}
            onTagChange={onTagChange}
            onClearAll={onClearAllFilters}
            variant="compact"
          />
        )}
      </div>
    </div>
  );
};
