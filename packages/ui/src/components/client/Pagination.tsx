"use client";
import React, { useState } from "react";
import { Button } from "./Button";

function generateSequence(current: number, count: number): number[] {
  const result: number[] = [];
  const start = current - Math.floor((count - 1) / 2);

  for (let i = 0; i < count; i++) {
    result.push(start + i);
  }

  return result;
}

function generateRangeGuaranteedSequence(
  current: number,
  count: number,
  min: number,
  max: number,
): (number | string)[] {
  const initialSequence = generateSequence(current, count);
  const filteredSequence = initialSequence.filter(
    (num) => num >= min && num <= max,
  );
  const result: (number | "ellipsis")[] = [...filteredSequence];

  if (!filteredSequence.includes(min)) {
    if (filteredSequence[0] - min > 1) {
      result.unshift(min, "ellipsis");
    } else {
      result.unshift(min);
    }
  }

  if (!filteredSequence.includes(max)) {
    if (max - filteredSequence[filteredSequence.length - 1] > 1) {
      result.push("ellipsis", max);
    } else {
      result.push(max);
    }
  }

  return result;
}

export const PrevIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 13.334L5 8.334L10 3.334"
      stroke="currentColor"
      strokeWidth="1.333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const NextIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.667 13.334L11.667 8.334L6.667 3.334"
      stroke="currentColor"
      strokeWidth="1.333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const EllipsisIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="5" cy="12" r="2" fill="currentColor" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <circle cx="19" cy="12" r="2" fill="currentColor" />
  </svg>
);

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  visiblePages?: number;
  allowDirectInput?: boolean;
  twoLines?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  visiblePages: propVisiblePages = 5,
  allowDirectInput = false,
  twoLines = false,
}) => {
  const [inputPage, setInputPage] = useState<number>(currentPage);
  const visiblePages = Math.max(
    propVisiblePages % 2 === 0 ? propVisiblePages + 1 : propVisiblePages,
    1,
  );
  const showTwoLines = twoLines && !allowDirectInput;
  const pageNumbers = generateRangeGuaranteedSequence(
    currentPage,
    visiblePages,
    1,
    totalPages,
  );

  const handleDirectInput = () => {
    if (inputPage >= 1 && inputPage <= totalPages) {
      onPageChange(inputPage);
    } else {
      onPageChange(currentPage);
    }
  };

  const renderPageNumbers = () => (
    <ul className="flex items-center gap-2">
      {pageNumbers.map((page, index) => (
        <li key={index}>
          {page === "ellipsis" ? (
            <span className="text-text-subtle flex h-10 w-10 items-center justify-center">
              <EllipsisIcon />
            </span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={`rounded-2 h-10 w-10 text-[17px] leading-[1.5] transition-colors ${
                currentPage === page
                  ? "bg-action-secondary-active font-bold text-black"
                  : "text-text-subtle hover:bg-gray-200"
              }`}
              aria-current={currentPage === page ? "page" : undefined}
              aria-label={`페이지 ${page}`}
            >
              {page}
            </button>
          )}
        </li>
      ))}
    </ul>
  );

  const prevButton = (
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className={`rounded-2 flex h-10 items-center justify-center gap-1 pl-1 pr-2 text-[17px] leading-[1.5] transition-colors ${
        currentPage === 1
          ? "text-text-disabled cursor-not-allowed"
          : "text-text-subtle hover:bg-gray-200"
      }`}
      aria-label="이전 페이지"
    >
      <PrevIcon />
      이전
    </button>
  );

  const nextButton = (
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`rounded-2 flex h-10 items-center justify-center gap-1 pl-2 pr-1 text-[17px] leading-[1.5] transition-colors ${
        currentPage === totalPages
          ? "text-text-disabled cursor-not-allowed"
          : "text-text-subtle hover:bg-gray-200"
      }`}
      aria-label="다음 페이지"
    >
      다음
      <NextIcon />
    </button>
  );

  const inputPageNumber = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onPageChange(inputPage);
      return;
    }
  };

  return (
    <nav
      aria-label={"페이지 네비게이션"}
      className={`${"flex flex-col items-center gap-6"}`}
    >
      {showTwoLines && (
        <div className={`flex items-center gap-2`}>
          {prevButton}
          {nextButton}
        </div>
      )}
      <div className={`flex items-center gap-2`}>
        {!showTwoLines && prevButton}
        {renderPageNumbers()}
        {!showTwoLines && nextButton}
      </div>
      {allowDirectInput && (
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <input
              type="number"
              value={inputPage}
              onChange={(e) => setInputPage(parseInt(e.target.value, 10))}
              onKeyDown={inputPageNumber}
              min={1}
              max={totalPages}
              className="border-input-border bg-input-surface rounded-2 focus:ring-primary-50 h-10 w-14 border px-4 text-center text-[15px] leading-[1.5] focus:outline-none focus:ring-2"
              aria-label="페이지 직접 입력"
            />
            <div className="text-text-subtle flex h-10 items-center justify-center px-2 text-[15px]">
              /{totalPages}
            </div>
          </div>
          <Button
            onClick={handleDirectInput}
            size="small"
            variant="secondary"
            className="h-10 min-w-[64px]"
          >
            이동
          </Button>
        </div>
      )}
    </nav>
  );
};
