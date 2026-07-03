"use client";

import { useState } from "react";
import { Select } from "@ui/components/client";
import { ApplicantsPanel } from "./ApplicantsPanel";
import { AttendancePanel } from "./AttendancePanel";
import type { CreatedStudy } from "@core/study-manage/api";

interface StudyManageSectionProps {
  createdStudies: CreatedStudy[];
}

type ManageTab = "applicants" | "attendance";

export function StudyManageSection({
  createdStudies,
}: StudyManageSectionProps) {
  const [selectedStudyId, setSelectedStudyId] = useState<number | null>(
    createdStudies[0]?.id ?? null,
  );
  const [activeTab, setActiveTab] = useState<ManageTab>("applicants");

  const tabs: { id: ManageTab; label: string }[] = [
    { id: "applicants", label: "신청자 관리" },
    { id: "attendance", label: "출석 관리" },
  ];

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

      {/* Tabs */}
      <div className="mb-4 flex gap-4 border-b border-[#cdd1d5]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex h-[48px] min-w-[64px] items-center justify-center whitespace-nowrap border-b-[3px] px-2 text-[17px] font-bold leading-[1.5] transition-colors ${
                isActive
                  ? "border-[#063a74] text-[#052b57]"
                  : "border-transparent text-[#052b57] hover:border-[#063a74]/30"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      {selectedStudyId != null && (
        <>
          {activeTab === "applicants" && (
            <ApplicantsPanel studyId={selectedStudyId} />
          )}
          {activeTab === "attendance" && (
            <AttendancePanel studyId={selectedStudyId} />
          )}
        </>
      )}
    </div>
  );
}
