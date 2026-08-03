"use client";

import { useState } from "react";
import { Select, Tabs } from "@ui/components/client";
import { ApplicantsPanel } from "./ApplicantsPanel";
import { AttendancePanel } from "./AttendancePanel";
import type { CreatedStudy } from "@core/study-manage/api";

interface StudyManageSectionProps {
  createdStudies: CreatedStudy[];
}

export function StudyManageSection({
  createdStudies,
}: StudyManageSectionProps) {
  const [selectedStudyId, setSelectedStudyId] = useState<number | null>(
    createdStudies[0]?.id ?? null,
  );

  if (createdStudies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <p className="text-lg">개설한 스터디가 없습니다</p>
      </div>
    );
  }

  return (
    <div>
      {/* Study selector */}
      <div className="mb-4">
        <Select
          id="manage-study"
          size="sm"
          value={selectedStudyId != null ? String(selectedStudyId) : ""}
          onChange={(v) => setSelectedStudyId(Number(v))}
          placeholder="스터디 선택"
          options={createdStudies.map((study) => ({
            value: String(study.id),
            label: `[${study.act_year}-${study.act_semester}] ${study.study_name}`,
          }))}
        />
      </div>

      <Tabs
        tabs={[
          {
            label: "신청자 관리",
            content: selectedStudyId != null && (
              <div className="pt-6 md:pt-8">
                <ApplicantsPanel studyId={selectedStudyId} />
              </div>
            ),
          },
          {
            label: "출석 관리",
            content: selectedStudyId != null && (
              <div className="pt-6 md:pt-8">
                <AttendancePanel studyId={selectedStudyId} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
