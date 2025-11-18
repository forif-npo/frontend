"use client";
import React from "react";
import { getRecentSemesters, getSemesterLabel } from "@/constants/study";
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

const DIFFICULTY_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "EASY", label: "쉬움" },
  { value: "SEMI_EASY", label: "조금 쉬움" },
  { value: "NORMAL", label: "보통" },
  { value: "SEMI_HARD", label: "조금 어려움" },
  { value: "HARD", label: "어려움" },
];

const TAG_OPTIONS = [
  "데이터베이스",
  "프로그래밍 기초",
  "프론트엔드",
  "백엔드",
  "풀스택",
  "앱",
  "인공지능",
  "데이터",
  "보안",
  "게임",
  "디자인",
  "알고리즘",
  "블록체인",
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
            <span className="text-text-primary">{filterTags.length}</span>
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
