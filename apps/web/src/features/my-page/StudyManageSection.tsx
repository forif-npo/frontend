"use client";

import { useState, type ReactNode } from "react";
import { Button, Select, Tabs } from "@ui/components/client";
import {
  Badge,
  EmptyState,
  InlineErrorState,
  InlineLoadingState,
} from "@ui/components/server";
import { ApplicantsPanel } from "./ApplicantsPanel";
import { AttendancePanel } from "./AttendancePanel";
import { StudyApplicationSection } from "./StudyApplicationSection";
import { StudyDetailContent } from "@/features/study/detail/StudyDetailContent";
import { useStudyDetail } from "@/hooks/useStudyDetail";
import type { CreatedStudy } from "@/features/study-manage/api";
import {
  getMentorConfirmation,
  type IssuedMentorConfirmation,
} from "@/features/study-manage/api";
import type { StudyApplicationSummary } from "@/features/study-application/api";
import { useActiveSemester } from "@/hooks/useActiveSemester";

interface StudyManageSectionProps {
  createdStudies: CreatedStudy[];
  mentorConfirmations: IssuedMentorConfirmation[];
  studyApplications: StudyApplicationSummary[];
}

type StudySelectOption = Pick<
  CreatedStudy,
  "id" | "study_name" | "act_year" | "act_semester"
>;

type ApplicantManagementStudy = StudySelectOption & {
  /** STARTED 스터디의 신청자 이력은 조회만 가능하다. */
  readOnly: boolean;
};

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
  const [selectedStartedStudyId, setSelectedStartedStudyId] = useState<
    number | null
  >(sortedCreatedStudies[0]?.id ?? null);
  const activeSemester = useActiveSemester();
  const applicantManagementStudies: ApplicantManagementStudy[] = [
    ...studyApplications
      .filter((application) => application.study_status === "APPROVED")
      .map((application) => ({
        id: application.id,
        study_name: application.study_name,
        act_year: activeSemester.act_year,
        act_semester: activeSemester.act_semester,
        readOnly: false,
      })),
    ...sortedCreatedStudies.map((study) => ({ ...study, readOnly: true })),
  ].filter(
    (study, index, studies) =>
      studies.findIndex((candidate) => candidate.id === study.id) === index,
  );
  const [selectedApplicantStudyId, setSelectedApplicantStudyId] = useState<
    number | null
  >(applicantManagementStudies[0]?.id ?? null);
  const selectedApplicantStudy = applicantManagementStudies.find(
    (study) => study.id === selectedApplicantStudyId,
  );
  const isApplicantStudyPastSemester =
    selectedApplicantStudy != null &&
    (selectedApplicantStudy.act_year !== activeSemester.act_year ||
      selectedApplicantStudy.act_semester !== activeSemester.act_semester);
  const isApplicantStudyReadOnly =
    selectedApplicantStudy?.readOnly === true || isApplicantStudyPastSemester;
  const selectedStudy = sortedCreatedStudies.find(
    (study) => study.id === selectedStartedStudyId,
  );
  const isPastSemester =
    selectedStudy != null &&
    (selectedStudy.act_year !== activeSemester.act_year ||
      selectedStudy.act_semester !== activeSemester.act_semester);
  const startedStudyContent = (content: ReactNode) => {
    if (sortedCreatedStudies.length === 0 || selectedStartedStudyId === null) {
      return (
        <EmptyState
          title="개설된 스터디가 없습니다."
          className="py-20"
          titleClassName="text-lg"
        />
      );
    }

    return (
      <div>
        <StudySelector
          studies={sortedCreatedStudies}
          selectedStudyId={selectedStartedStudyId}
          onChange={setSelectedStartedStudyId}
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
            label: "개설 신청서",
            content: (
              <StudyApplicationSection applications={studyApplications} />
            ),
          },
          {
            label: "개설 스터디",
            content: (
              <OperatingStudyOverview
                createdStudies={sortedCreatedStudies}
                selectedStudyId={selectedStartedStudyId}
                onChange={setSelectedStartedStudyId}
                isPastSemester={isPastSemester}
              />
            ),
          },
          {
            label: "신청자 관리",
            content:
              applicantManagementStudies.length === 0 ||
              selectedApplicantStudyId === null ? (
                <EmptyState
                  title="신청자를 관리할 스터디가 없습니다."
                  className="py-20"
                  titleClassName="text-lg"
                />
              ) : (
                <div>
                  <StudySelector
                    studies={applicantManagementStudies}
                    selectedStudyId={selectedApplicantStudyId}
                    onChange={setSelectedApplicantStudyId}
                    isPastSemester={isApplicantStudyPastSemester}
                  />
                  <ApplicantsPanel
                    studyId={selectedApplicantStudyId}
                    readOnly={isApplicantStudyReadOnly}
                  />
                </div>
              ),
          },
          {
            label: "출석 관리",
            content: startedStudyContent(
              <AttendancePanel
                studyId={selectedStartedStudyId ?? 0}
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
    return (
      <EmptyState
        title="개설된 스터디가 없습니다."
        className="py-20"
        titleClassName="text-lg"
      />
    );
  }

  return (
    <div>
      <StudySelector
        studies={createdStudies}
        selectedStudyId={selectedStudyId}
        onChange={onChange}
        isPastSemester={isPastSemester}
      />
      {isLoading ? (
        <InlineLoadingState
          message="스터디 정보를 불러오는 중입니다."
          textClassName="text-base"
        />
      ) : error || !study ? (
        <InlineErrorState message="스터디 정보를 불러오지 못했습니다." />
      ) : (
        <StudyDetailContent study={study} />
      )}
    </div>
  );
}

function StudySelector({
  studies,
  selectedStudyId,
  onChange,
  isPastSemester,
}: {
  studies: StudySelectOption[];
  selectedStudyId: number;
  onChange: (studyId: number) => void;
  isPastSemester: boolean;
}) {
  return (
    <div className="mb-6">
      <Select
        id="manage-study"
        size="sm"
        value={String(selectedStudyId)}
        onChange={(value) => onChange(Number(value))}
        placeholder="스터디 선택"
        options={studies.map((study) => ({
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
