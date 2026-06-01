"use client";

import { useState, useTransition } from "react";
import { Select } from "@ui/components/client";
import { StudyCard } from "@/components/study/ui/StudyCard";
import type { UserStudiesResponse, StudyDetail } from "@core/my-page/api";

interface StudySectionProps {
  studiesData: UserStudiesResponse;
}

export function StudySection({ studiesData }: StudySectionProps) {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [isPending, startTransition] = useTransition();

  type FlatStudy = StudyDetail & {
    semester_label: string;
    is_current: boolean;
  };

  const sortedSemesters = [...studiesData].sort((a, b) => {
    const aKey = a.year * 10 + a.semester;
    const bKey = b.year * 10 + b.semester;
    return sortOrder === "newest" ? bKey - aKey : aKey - bKey;
  });

  const sortedStudies: FlatStudy[] = sortedSemesters.flatMap((sem) =>
    sem.studies.map((s) => ({
      ...s,
      semester_label: sem.semester_label,
      is_current: sem.is_current,
    })),
  );

  const totalCount = sortedStudies.length;

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
      <div className="mb-4 flex items-center justify-between">
        <p className="text-text-basic text-[19px] font-bold leading-[1.5]">
          스터디 <span className="text-[#0b50d0]">{totalCount}</span>개
        </p>

        <Select
          id="study-sort"
          variant="text"
          size="sm"
          value={sortOrder}
          onChange={(v) => setSortOrder(v as "newest" | "oldest")}
          placeholder="정렬기준"
          dropdownAlign="right"
          options={[
            { value: "newest", label: "최신순" },
            { value: "oldest", label: "오래된 순" },
          ]}
        />
      </div>

      {/* Study List */}
      {sortedStudies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg">등록된 스터디가 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedStudies.map((study) => (
            <StudyCard
              key={`${study.semester_label}-${study.study_id}`}
              variant="mypage"
              study={study}
              semesterLabel={study.semester_label}
              isCurrent={study.is_current}
              onDownloadCertificate={() =>
                handleDownloadCertificate(study.study_id)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
