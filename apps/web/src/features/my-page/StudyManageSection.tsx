"use client";

import { useState } from "react";
import { Select, Tabs } from "@ui/components/client";
import { ApplicantsPanel } from "./ApplicantsPanel";
import { AttendancePanel } from "./AttendancePanel";
import type { CreatedStudy } from "@core/study-manage/api";
import { useActiveSemester } from "@/hooks/useActiveSemester";

interface StudyManageSectionProps {
  createdStudies: CreatedStudy[];
}

export function StudyManageSection({
  createdStudies,
}: StudyManageSectionProps) {
  const [selectedStudyId, setSelectedStudyId] = useState<number | null>(
    createdStudies[0]?.id ?? null,
  );
  const activeSemester = useActiveSemester();

  const selectedStudy = createdStudies.find(
    (study) => study.id === selectedStudyId,
  );
  // 지난 학기 스터디는 조회만 된다. 서버도 변경을 거부하므로(FOR127-403)
  // 버튼을 눌러 실패하기 전에 미리 알린다.
  const isPastSemester =
    selectedStudy != null &&
    (selectedStudy.act_year !== activeSemester.act_year ||
      selectedStudy.act_semester !== activeSemester.act_semester);

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

      {isPastSemester && (
        <div className="rounded-3 mb-4 border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm font-semibold text-amber-900">
            지난 학기 스터디입니다
          </p>
          <p className="mt-0.5 text-xs text-amber-800">
            신청자 명단과 출석 기록은 볼 수 있지만, 합격·불합격 처리와 출석
            변경은 할 수 없습니다.
          </p>
        </div>
      )}

      <Tabs
        tabs={[
          {
            label: "신청자 관리",
            content: selectedStudyId != null && (
              <div className="pt-6 md:pt-8">
                <ApplicantsPanel studyId={selectedStudyId} readOnly={isPastSemester} />
              </div>
            ),
          },
          {
            label: "출석 관리",
            content: selectedStudyId != null && (
              <div className="pt-6 md:pt-8">
                <AttendancePanel studyId={selectedStudyId} readOnly={isPastSemester} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
