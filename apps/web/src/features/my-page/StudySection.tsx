"use client";

import { useState, useTransition } from "react";
import { Heading, Label } from "@ui/components/server";
import { MyPageStudyCard } from "./MyPageStudyCard";
import type { StudyBySemester } from "@core/my-page/api";

interface StudySectionProps {
  studiesData: { semesters: StudyBySemester[] };
}

export function StudySection({ studiesData }: StudySectionProps) {
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [isPending, startTransition] = useTransition();

  // Generate semester tabs
  const semesterTabs = [
    { id: "all", label: "전체 학기" },
    ...studiesData.semesters.map((sem) => ({
      id: `${sem.year}-${sem.semester}`,
      label: sem.semester_label,
    })),
  ];

  // Filter studies by selected semester
  const filteredStudies =
    selectedSemester === "all"
      ? studiesData.semesters
      : studiesData.semesters.filter(
          (sem) => `${sem.year}-${sem.semester}` === selectedSemester,
        );

  const handleDownloadCertificate = async (studyId: number) => {
    startTransition(async () => {
      try {
        const { getCertificate } = await import("@core/my-page/api");
        const certificateUrl = await getCertificate(studyId);

        // Open certificate in new tab
        window.open(certificateUrl, "_blank");
      } catch (error) {
        console.error("Failed to download certificate:", error);
        alert("인증서 다운로드에 실패했습니다.");
      }
    });
  };

  return (
    <div className="flex-1 px-16 py-8">
      {/* Page Header */}
      <Heading size="l" className="mb-8">
        내 스터디
      </Heading>

      {/* Semester Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {semesterTabs.map((tab) => {
          const isSelected = selectedSemester === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedSemester(tab.id)}
              className={`rounded-t-lg border-b-4 px-6 py-3 transition-all ${
                isSelected
                  ? "border-blue-600 font-semibold text-blue-600"
                  : "border-transparent text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Label size="l">{tab.label}</Label>
            </button>
          );
        })}
      </div>

      {/* Study Grid */}
      {filteredStudies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg">등록된 스터디가 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudies.map((semesterData) => (
            <MyPageStudyCard
              key={`${semesterData.year}-${semesterData.semester}-${semesterData.study.study_id}`}
              study={semesterData.study}
              semesterLabel={semesterData.semester_label}
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
