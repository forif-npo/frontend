import React from "react";
import { ApplyCard } from "@/components/ApplyCard";
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
        <ApplyCard
          key={study.id}
          title={study.study_name}
          description={study.one_liner}
          status={
            study.recruit_status === "APPLICABLE" ? "신청중" : "신청 종료"
          }
          language={study.tags[0]}
          level={study.tags[1]}
          difficulty={study.difficulty}
          schedule={`${study.start_time}-${study.end_time}`}
          instructors={
            study.secondary_mentor_name
              ? `${study.primary_mentor_name}·${study.secondary_mentor_name}`
              : study.primary_mentor_name
          }
          imageUrl={study.img_url}
          disabled={study.recruit_status === "CLOSED"}
          onDetailClick={() => onCardClick?.(study)}
          onApplyClick={() => onApplyClick?.(study)}
        />
      ))}
    </div>
  );
};
