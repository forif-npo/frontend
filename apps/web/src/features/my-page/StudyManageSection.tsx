"use client";

import { useState, type ReactNode } from "react";
import { Select, Tabs } from "@ui/components/client";
import { ApplicantsPanel } from "./ApplicantsPanel";
import { AttendancePanel } from "./AttendancePanel";
import { StudyApplicationSection } from "./StudyApplicationSection";
import { StudyDetailContent } from "@/features/study/detail/StudyDetailContent";
import { useStudyDetail } from "@/hooks/useStudyDetail";
import type { CreatedStudy } from "@core/study-manage/api";
import type { StudyApplicationSummary } from "@core/study-application/api";
import { useActiveSemester } from "@/hooks/useActiveSemester";

interface StudyManageSectionProps {
  createdStudies: CreatedStudy[];
  studyApplications: StudyApplicationSummary[];
}

export function StudyManageSection({
  createdStudies,
  studyApplications,
}: StudyManageSectionProps) {
  const [selectedStudyId, setSelectedStudyId] = useState<number | null>(
    createdStudies[0]?.id ?? null,
  );
  const activeSemester = useActiveSemester();
  const selectedStudy = createdStudies.find(
    (study) => study.id === selectedStudyId,
  );
  const isPastSemester =
    selectedStudy != null &&
    (selectedStudy.act_year !== activeSemester.act_year ||
      selectedStudy.act_semester !== activeSemester.act_semester);
  const isMentorRecruitOpen = studyApplications.some(
    (application) => application.can_modify,
  );

  const operatingStudyContent = (content: ReactNode) => {
    if (createdStudies.length === 0 || selectedStudyId === null) {
      return <EmptyOperatingStudies />;
    }

    return (
      <div className="pt-6">
        <StudySelector
          createdStudies={createdStudies}
          selectedStudyId={selectedStudyId}
          onChange={setSelectedStudyId}
        />
        {isPastSemester && <PastSemesterNotice />}
        {content}
      </div>
    );
  };

  return (
    <Tabs
      tabs={[
        {
          label: isMentorRecruitOpen ? "개설 신청서" : "운영 중인 스터디",
          content: isMentorRecruitOpen ? (
            <StudyApplicationSection applications={studyApplications} />
          ) : (
            <OperatingStudyOverview
              createdStudies={createdStudies}
              selectedStudyId={selectedStudyId}
              onChange={setSelectedStudyId}
            />
          ),
        },
        {
          label: "신청자 관리",
          content: operatingStudyContent(
            <ApplicantsPanel
              studyId={selectedStudyId ?? 0}
              readOnly={isPastSemester}
            />,
          ),
        },
        {
          label: "출석 관리",
          content: operatingStudyContent(
            <AttendancePanel
              studyId={selectedStudyId ?? 0}
              readOnly={isPastSemester}
            />,
          ),
        },
      ]}
    />
  );
}

function OperatingStudyOverview({
  createdStudies,
  selectedStudyId,
  onChange,
}: {
  createdStudies: CreatedStudy[];
  selectedStudyId: number | null;
  onChange: (studyId: number) => void;
}) {
  const { study, isLoading, error } = useStudyDetail(
    selectedStudyId ? String(selectedStudyId) : "",
  );

  if (createdStudies.length === 0 || selectedStudyId === null) {
    return <EmptyOperatingStudies />;
  }

  return (
    <div className="pt-6">
      <StudySelector
        createdStudies={createdStudies}
        selectedStudyId={selectedStudyId}
        onChange={onChange}
      />
      {isLoading ? (
        <p className="text-text-subtle py-12 text-center">
          스터디 정보를 불러오는 중입니다.
        </p>
      ) : error || !study ? (
        <p className="text-text-danger py-12 text-center">
          스터디 정보를 불러오지 못했습니다.
        </p>
      ) : (
        <StudyDetailContent study={study} />
      )}
    </div>
  );
}

function StudySelector({
  createdStudies,
  selectedStudyId,
  onChange,
}: {
  createdStudies: CreatedStudy[];
  selectedStudyId: number;
  onChange: (studyId: number) => void;
}) {
  return (
    <div className="mb-4">
      <Select
        id="manage-study"
        size="sm"
        value={String(selectedStudyId)}
        onChange={(value) => onChange(Number(value))}
        placeholder="스터디 선택"
        options={createdStudies.map((study) => ({
          value: String(study.id),
          label: `[${study.act_year}-${study.act_semester}] ${study.study_name}`,
        }))}
      />
    </div>
  );
}

function EmptyOperatingStudies() {
  return (
    <div className="text-text-subtle flex flex-col items-center justify-center py-20">
      <p className="text-lg">승인된 운영 스터디가 없습니다.</p>
    </div>
  );
}

function PastSemesterNotice() {
  return (
    <div className="rounded-3 mb-4 border border-amber-200 bg-amber-50 px-4 py-3">
      <p className="text-sm font-semibold text-amber-900">
        지난 학기 스터디입니다
      </p>
      <p className="mt-0.5 text-xs text-amber-800">
        신청자 명단과 출석 기록은 볼 수 있지만, 합격·불합격 처리와 출석 변경은
        할 수 없습니다.
      </p>
    </div>
  );
}
