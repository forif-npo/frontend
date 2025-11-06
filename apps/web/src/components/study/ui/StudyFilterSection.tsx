"use client";
import React from "react";
import {
  TAG_OPTIONS,
  DIFFICULTY_OPTIONS,
  getRecentSemesters,
  getSemesterLabel,
  getDifficultyLabel,
} from "@/constants/study";
import clsx from "clsx";
import {
  QuestionBubble,
  ResetIcon,
  XCircleGrayIcon,
} from "@repo/assets/icons/krds";
import { SelectBox } from "@ui/components/client";

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
  className?: string;
}

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
    tags.push(
      createFilterTag(
        "difficulty",
        selectedDifficulty,
        getDifficultyLabel(selectedDifficulty),
      ),
    );
  }

  if (selectedTag) {
    const tagOption = TAG_OPTIONS.find((t) => t.value === selectedTag);
    tags.push(
      createFilterTag("tag", selectedTag, tagOption?.label || selectedTag),
    );
  }

  return tags;
};

export const StudyFilterSection: React.FC<StudyFilterSectionProps> = ({
  selectedSemester,
  selectedDifficulty,
  selectedTag,
  onSemesterChange,
  onDifficultyChange,
  onTagChange,
  onClearAll,
  className,
}) => {
  const semesters = getRecentSemesters(5);

  const filterTags = React.useMemo(
    () => buildFilterTags(selectedSemester, selectedDifficulty, selectedTag),
    [selectedSemester, selectedDifficulty, selectedTag],
  );

  const removeFilterTag = React.useCallback(
    (tag: FilterTag) => {
      const handlers = {
        semester: onSemesterChange,
        difficulty: onDifficultyChange,
        tag: onTagChange,
      };
      handlers[tag.type]("");
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
      value: tag.value,
      label: tag.label,
    })),
  ];

  return (
    <div
      className={clsx(
        "bg-surface-secondary-subtler rounded-xl p-10",
        className,
      )}
    >
      <div className="flex items-center gap-6 pb-6">
        <div className="flex items-center gap-3">
          <span className="whitespace-nowrap text-[17px] font-bold text-gray-900">
            진행 학기
          </span>
          <div className="w-[208px]">
            <SelectBox
              id="semester-filter"
              value={selectedSemester || null}
              onChange={(value) => onSemesterChange(value || "")}
              placeholder="전체"
              options={semesterOptions}
              size="md"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="whitespace-nowrap text-[17px] font-bold text-gray-900">
              난이도
            </span>
            <QuestionBubble />
          </div>
          <div className="w-[208px]">
            <SelectBox
              id="difficulty-filter"
              value={selectedDifficulty || null}
              onChange={(value) => onDifficultyChange(value || "")}
              placeholder="전체"
              options={difficultyOptions}
              size="md"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="whitespace-nowrap text-[17px] font-bold text-gray-900">
            주제
          </span>
          <div className="w-[208px]">
            <SelectBox
              id="tag-filter"
              value={selectedTag || null}
              onChange={(value) => onTagChange(value || "")}
              placeholder="전체"
              options={tagOptions}
              size="md"
            />
          </div>
        </div>
      </div>

      {filterTags.length > 0 && (
        <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
          <span className="whitespace-nowrap text-[17px] font-bold text-gray-900">
            선택된 필터{" "}
            <span className="text-blue-600">{filterTags.length}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearAll}
              className="border-border-gray-light rounded-full border bg-white p-3 transition-colors hover:bg-gray-50"
              aria-label="필터 초기화"
            >
              <ResetIcon className="h-4 w-4" />
            </button>
            {filterTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-2 text-[17px] text-gray-900"
              >
                {tag.label}
                <button
                  onClick={() => removeFilterTag(tag)}
                  className="ml-1 rounded-full p-0.5 transition-colors hover:bg-gray-100"
                  aria-label={`${tag.label} 필터 제거`}
                >
                  <XCircleGrayIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
