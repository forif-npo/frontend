"use client";

import { useState, useTransition } from "react";
import { MyPageStudyCard } from "./MyPageStudyCard";
import type { StudyBySemester } from "@core/my-page/api";

interface StudySectionProps {
  studiesData: { semesters: StudyBySemester[] };
}

export function StudySection({ studiesData }: StudySectionProps) {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [isPending, startTransition] = useTransition();

  const sortedSemesters = [...studiesData.semesters].sort((a, b) => {
    const aKey = a.year * 10 + a.semester;
    const bKey = b.year * 10 + b.semester;
    return sortOrder === "newest" ? bKey - aKey : aKey - bKey;
  });

  const totalCount = sortedSemesters.length;

  const handleDownloadCertificate = async (studyId: number) => {
    startTransition(async () => {
      try {
        const { getCertificate } = await import("@core/my-page/api");
        const certificateUrl = await getCertificate(studyId);
        window.open(certificateUrl, "_blank");
      } catch (error) {
        console.error("Failed to download certificate:", error);
        alert("인증서 다운로드에 실패했습니다.");
      }
    });
  };

  return (
    <div>
      {/* Sort and Count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-text-basic text-[19px] font-bold leading-[1.5]">
          스터디 <span className="text-[#0b50d0]">{totalCount}</span>개
        </p>

        <div className="flex items-center gap-3">
          <p className="text-[17px] font-bold leading-[1.5]">정렬기준</p>
          <div className="flex gap-2">
            <button
              onClick={() => setSortOrder("newest")}
              className={`rounded-[4px] px-1 text-[17px] leading-[1.5] transition-colors ${
                sortOrder === "newest"
                  ? "text-text-basic bg-[#d6e0eb]"
                  : "text-text-basic hover:bg-[#d6e0eb]/50"
              }`}
            >
              최신순
            </button>
            <button
              onClick={() => setSortOrder("oldest")}
              className={`rounded-[4px] px-1 text-[17px] leading-[1.5] transition-colors ${
                sortOrder === "oldest"
                  ? "text-text-basic bg-[#d6e0eb]"
                  : "text-text-basic hover:bg-[#d6e0eb]/50"
              }`}
            >
              오래된 순
            </button>
          </div>
        </div>
      </div>

      {/* Study List */}
      {sortedSemesters.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg">등록된 스터디가 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-[24px]">
          {sortedSemesters.map((semesterData) => (
            <MyPageStudyCard
              key={`${semesterData.year}-${semesterData.semester}-${semesterData.study.study_id}`}
              study={semesterData.study}
              semesterLabel={semesterData.semester_label}
              isCurrent={semesterData.is_current}
              onDownloadCertificate={() =>
                handleDownloadCertificate(semesterData.study.study_id)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
