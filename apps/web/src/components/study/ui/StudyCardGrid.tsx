import React from "react";
import { StudyCard } from "./StudyCard";
import { Study } from "@/types/study";

interface StudyCardGridProps {
  studies: Study[];
  onCardClick?: (study: Study) => void;
  onApplyClick?: (study: Study) => void;
  className?: string;
}

export const StudyCardGrid: React.FC<StudyCardGridProps> = ({
  studies,
  onCardClick,
  onApplyClick,
  className = "",
}) => {
  if (studies.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-gray-500">
        <p className="mb-2 text-lg">검색 결과가 없습니다</p>
        <p className="text-sm">다른 검색어나 필터를 시도해보세요</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}
    >
      {studies.map((study) => (
        <StudyCard
          key={study.id}
          variant="list"
          study={study}
          onDetailClick={() => onCardClick?.(study)}
          onApplyClick={() => onApplyClick?.(study)}
        />
      ))}
    </div>
  );
};
