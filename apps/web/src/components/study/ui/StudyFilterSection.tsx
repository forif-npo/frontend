"use client";
import { getRecentSemesters, getSemesterLabel } from "@/constants/study";
import { ResetIcon, XCircleGrayIcon } from "@repo/assets/icons/krds";
import { SelectBox } from "@ui/components/client";
import clsx from "clsx";
import React from "react";
import { TAG_OPTIONS } from "@/constants/study-tags";
interface FilterTag {
  id: string;
  label: string;
  type: "semester" | "difficulty" | "tag";
  value: string;
}

interface StudyFilterSectionProps {
  selectedSemester: string;
  selectedDifficulty: string;
  selectedTag: string;
  onSemesterChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onClearAll: () => void;
  variant?: "default" | "compact";
  className?: string;
}

const DIFFICULTY_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "EASY", label: "쉬움" },
  { value: "SEMI_EASY", label: "조금 쉬움" },
  { value: "NORMAL", label: "보통" },
  { value: "SEMI_HARD", label: "조금 어려움" },
  { value: "HARD", label: "어려움" },
];

const DIFFICULTY_LABEL_MAP: Record<string, string> = {
  EASY: "쉬움",
  SEMI_EASY: "조금 쉬움",
  NORMAL: "보통",
  SEMI_HARD: "조금 어려움",
  HARD: "어려움",
};

const createFilterTag = (
  type: FilterTag["type"],
  value: string,
  label: string,
): FilterTag => ({
  id: type,
  label,
  type,
  value,
});

const buildFilterTags = (
  selectedSemester: string,
  selectedDifficulty: string,
  selectedTag: string,
): FilterTag[] => {
  const tags: FilterTag[] = [];

  if (selectedSemester) {
    const [year, semester] = selectedSemester.split("-").map(Number);
    tags.push(
      createFilterTag(
        "semester",
        selectedSemester,
        getSemesterLabel(year, semester),
      ),
    );
  }

  if (selectedDifficulty) {
    const label = DIFFICULTY_LABEL_MAP[selectedDifficulty];
    tags.push(createFilterTag("difficulty", selectedDifficulty, label));
  }

  if (selectedTag) {
    tags.push(createFilterTag("tag", selectedTag, selectedTag));
  }

  return tags;
};

export const getActiveFilterCount = (
  semester: string,
  difficulty: string,
  tag: string,
) => {
  return [semester, difficulty, tag].filter(Boolean).length;
};

export const StudyFilterSection: React.FC<StudyFilterSectionProps> = ({
  selectedSemester,
  selectedDifficulty,
  selectedTag,
  onSemesterChange,
  onDifficultyChange,
  onTagChange,
  onClearAll,
  variant = "default",
  className,
}) => {
  const semesters = getRecentSemesters(5);
  const isCompact = variant === "compact";

  const filterTags = React.useMemo(
    () => buildFilterTags(selectedSemester, selectedDifficulty, selectedTag),
    [selectedSemester, selectedDifficulty, selectedTag],
  );

  const removeFilterTag = React.useCallback(
    (tag: FilterTag) => {
      if (tag.type === "semester") {
        onSemesterChange("");
      } else if (tag.type === "difficulty") {
        onDifficultyChange("");
      } else if (tag.type === "tag") {
        onTagChange("");
      }
    },
    [onSemesterChange, onDifficultyChange, onTagChange],
  );

  const semesterOptions = [
    { value: "", label: "전체" },
    ...semesters.map((sem) => ({
      value: `${sem.value.year}-${sem.value.semester}`,
      label: sem.label,
    })),
  ];

  const difficultyOptions = [
    { value: "", label: "전체" },
    ...DIFFICULTY_OPTIONS.map((diff) => ({
      value: diff.value,
      label: diff.label,
    })),
  ];

  const tagOptions = [
    { value: "", label: "전체" },
    ...TAG_OPTIONS.map((tag) => ({
      value: tag,
      label: tag,
    })),
  ];

  return (
    <div
      className={clsx(
        "bg-surface-secondary-subtler rounded-xl",
        isCompact ? "px-4 py-4" : "p-10",
        className,
      )}
    >
      <div
        className={clsx(
          "flex items-start gap-14 max-md:flex-col",
          filterTags.length > 0 && "pb-6",
        )}
      >
        <div className="flex items-center gap-3 max-md:w-full">
          <span className="whitespace-nowrap text-[17px] font-bold text-gray-900 max-md:w-20">
            학기
          </span>
          <div className={isCompact ? "min-w-0 flex-1" : "w-[208px]"}>
            <SelectBox
              id={isCompact ? "mobile-semester-filter" : "semester-filter"}
              value={selectedSemester}
              onChange={(value) => onSemesterChange(value || "")}
              placeholder="전체"
              options={semesterOptions}
              size="md"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 max-md:w-full">
          <div className="flex items-center gap-1">
            <span className="flex gap-4 whitespace-nowrap text-[17px] font-bold text-gray-900 max-md:w-20">
              난이도
            </span>
          </div>
          <div className={isCompact ? "min-w-0 flex-1" : "w-[208px]"}>
            <SelectBox
              id={isCompact ? "mobile-difficulty-filter" : "difficulty-filter"}
              value={selectedDifficulty}
              onChange={(value) => onDifficultyChange(value || "")}
              placeholder="전체"
              options={difficultyOptions}
              size="md"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 max-md:w-full">
          <span className="whitespace-nowrap text-[17px] font-bold text-gray-900 max-md:w-20">
            주제
          </span>
          <div className={isCompact ? "min-w-0 flex-1" : "w-[208px]"}>
            <SelectBox
              id={isCompact ? "mobile-tag-filter" : "tag-filter"}
              value={selectedTag}
              onChange={(value) => onTagChange(value || "")}
              placeholder="전체"
              options={tagOptions}
              size="md"
            />
          </div>
        </div>
      </div>

      {filterTags.length > 0 && (
        <div
          className={clsx(
            "flex flex-wrap items-center gap-2 border-t border-gray-200",
            isCompact ? "mt-3 pt-3" : "mt-0 gap-4 pt-6",
          )}
        >
          {!isCompact && (
            <span className="whitespace-nowrap text-[17px] font-bold text-gray-900">
              선택된 필터{" "}
              <span className="text-text-primary">{filterTags.length}</span>
            </span>
          )}

          <button
            onClick={onClearAll}
            className={clsx(
              "border-border-gray-light rounded-full border bg-white transition-colors hover:bg-gray-50",
              isCompact ? "p-2" : "p-3",
            )}
            aria-label="필터 초기화"
          >
            <ResetIcon className={isCompact ? "h-3.5 w-3.5" : "h-4 w-4"} />
          </button>
          {filterTags.map((tag) => (
            <span
              key={tag.id}
              className={clsx(
                "inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white text-gray-900",
                isCompact ? "px-2.5 py-1 text-[13px]" : "px-3 py-2 text-[17px]",
              )}
            >
              {tag.label}
              <button
                onClick={() => removeFilterTag(tag)}
                className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-gray-100"
                aria-label={`${tag.label} 필터 제거`}
              >
                <XCircleGrayIcon
                  className={isCompact ? "h-3.5 w-3.5" : "h-4 w-4"}
                />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
