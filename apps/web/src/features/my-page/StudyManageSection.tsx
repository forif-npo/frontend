"use client";

import { useState, type ReactNode } from "react";
import { Button, Select, Tabs } from "@ui/components/client";
import { Badge } from "@ui/components/server";
import { ApplicantsPanel } from "./ApplicantsPanel";
import { AttendancePanel } from "./AttendancePanel";
import { StudyApplicationSection } from "./StudyApplicationSection";
import { StudyDetailContent } from "@/features/study/detail/StudyDetailContent";
import { useStudyDetail } from "@/hooks/useStudyDetail";
import type { CreatedStudy } from "@core/study-manage/api";
import {
  getMentorConfirmation,
  type IssuedMentorConfirmation,
} from "@core/study-manage/api";
import type { StudyApplicationSummary } from "@core/study-application/api";
import { useActiveSemester } from "@/hooks/useActiveSemester";

interface StudyManageSectionProps {
  createdStudies: CreatedStudy[];
  mentorConfirmations: IssuedMentorConfirmation[];
  studyApplications: StudyApplicationSummary[];
}

export function StudyManageSection({
  createdStudies,
  mentorConfirmations,
  studyApplications,
}: StudyManageSectionProps) {
  const sortedCreatedStudies = [...createdStudies].sort(
    (first, second) =>
      second.act_year - first.act_year ||
      second.act_semester - first.act_semester ||
      second.id - first.id,
  );
  const [selectedStudyId, setSelectedStudyId] = useState<number | null>(
    sortedCreatedStudies[0]?.id ?? null,
  );
  const activeSemester = useActiveSemester();
  const selectedStudy = sortedCreatedStudies.find(
    (study) => study.id === selectedStudyId,
  );
  const isPastSemester =
    selectedStudy != null &&
    (selectedStudy.act_year !== activeSemester.act_year ||
      selectedStudy.act_semester !== activeSemester.act_semester);
  const hasStudyApplications = studyApplications.length > 0;

  const operatingStudyContent = (content: ReactNode) => {
    if (sortedCreatedStudies.length === 0 || selectedStudyId === null) {
      return <EmptyOperatingStudies />;
    }

    return (
      <div>
        <StudySelector
          createdStudies={sortedCreatedStudies}
          selectedStudyId={selectedStudyId}
          onChange={setSelectedStudyId}
          isPastSemester={isPastSemester}
        />
        {content}
      </div>
    );
  };

  return (
    <>
      <Tabs
        tabs={[
          {
            label: hasStudyApplications ? "개설 신청서" : "운영 중인 스터디",
            content: hasStudyApplications ? (
              <StudyApplicationSection applications={studyApplications} />
            ) : (
              <OperatingStudyOverview
                createdStudies={sortedCreatedStudies}
                selectedStudyId={selectedStudyId}
                onChange={setSelectedStudyId}
                isPastSemester={isPastSemester}
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
      <IssuedMentorConfirmations confirmations={mentorConfirmations} />
    </>
  );
}

function IssuedMentorConfirmations({
  confirmations,
}: {
  confirmations: IssuedMentorConfirmation[];
}) {
  const [downloadingStudyId, setDownloadingStudyId] = useState<number | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (confirmations.length === 0) return null;

  const handleDownload = async (studyId: number) => {
    if (downloadingStudyId != null) return;

    const downloadWindow = window.open("", "_blank");
    if (downloadWindow == null) {
      setErrorMessage("팝업이 차단되어 멘토 확인서를 열 수 없습니다.");
      return;
    }

    setDownloadingStudyId(studyId);
    setErrorMessage(null);
    try {
      const confirmation = await getMentorConfirmation(studyId);
      if (confirmation.confirmation_url) {
        downloadWindow.location.href = confirmation.confirmation_url;
      } else {
        downloadWindow.close();
        setErrorMessage("발급된 멘토 확인서를 찾을 수 없습니다.");
      }
    } catch {
      downloadWindow.close();
      setErrorMessage("멘토 확인서를 불러오지 못했습니다. 다시 시도해주세요.");
    } finally {
      setDownloadingStudyId(null);
    }
  };

  return (
    <section className="mt-8 border-t pt-6">
      <h2 className="text-text-bolder text-body-l font-bold">
        발급된 멘토 확인서
      </h2>
      <p className="text-text-subtle text-body-s mt-1">
        멘토 변경 후에도 이미 발급된 확인서를 내려받을 수 있습니다.
      </p>
      <div className="mt-4 flex flex-col gap-2">
        {confirmations.map((confirmation) => (
          <div
            key={confirmation.study_id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-4"
          >
            <span className="text-text-basic text-body-m font-medium">
              [{confirmation.act_year}-{confirmation.act_semester}]{" "}
              {confirmation.study_name}
            </span>
            <Button
              variant="tertiary"
              size="medium"
              disabled={downloadingStudyId != null}
              onClick={() => handleDownload(confirmation.study_id)}
            >
              {downloadingStudyId === confirmation.study_id
                ? "다운로드 중..."
                : "멘토 확인서 다운로드"}
            </Button>
          </div>
        ))}
      </div>
      {errorMessage && (
        <p className="text-text-danger text-body-s mt-3">{errorMessage}</p>
      )}
    </section>
  );
}

function OperatingStudyOverview({
  createdStudies,
  selectedStudyId,
  onChange,
  isPastSemester,
}: {
  createdStudies: CreatedStudy[];
  selectedStudyId: number | null;
  onChange: (studyId: number) => void;
  isPastSemester: boolean;
}) {
  const { study, isLoading, error } = useStudyDetail(
    selectedStudyId ? String(selectedStudyId) : "",
  );

  if (createdStudies.length === 0 || selectedStudyId === null) {
    return <EmptyOperatingStudies />;
  }

  return (
    <div>
      <StudySelector
        createdStudies={createdStudies}
        selectedStudyId={selectedStudyId}
        onChange={onChange}
        isPastSemester={isPastSemester}
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
  isPastSemester,
}: {
  createdStudies: CreatedStudy[];
  selectedStudyId: number;
  onChange: (studyId: number) => void;
  isPastSemester: boolean;
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
        selectedSuffix={
          isPastSemester ? (
            <Badge
              label="종료"
              variant="disabled"
              appearance="solid-pastel"
              size="small"
            />
          ) : undefined
        }
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
