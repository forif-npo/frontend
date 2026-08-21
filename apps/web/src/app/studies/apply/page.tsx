"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertModal, SelectBox } from "@ui/components/client";
import { getStudyApplicationStatus } from "@core/my-page/api";
import { StudyApplyInfoStep } from "@/features/study/apply/study-apply-info-step";
import { StudyApplyReasonStep } from "@/features/study/apply/study-apply-reason-step";
import { StudyApplyComplete } from "@/features/study/apply/StudyApplyComplete";
import { StudyApplySkeleton } from "@/features/study/apply/StudyApplySkeleton";
import { useStudyApplyPage } from "@/features/study/apply/useStudyApplyPage";
import { useActiveSemester } from "@/hooks/useActiveSemester";
import { getStudyApplicationBlockMessage } from "@/features/study/apply/application-availability";

export default function StudyApplyPage() {
  const router = useRouter();
  const activeSemester = useActiveSemester();
  const searchParams = useSearchParams();
  const [selectedStudyId, setSelectedStudyId] = useState<string | null>(() =>
    searchParams.get("study_id"),
  );
  const [applicationBlockedMessage, setApplicationBlockedMessage] = useState<
    string | null
  >(null);
  const {
    step,
    submittedIntro,
    submittedPriority,
    submittedIsAutonomousStudy,
    secondaryPriorityAvailability,
    applicationAvailability,
    applicationAlert,
    entryBlockMessage,
    isAutonomousStudy,
    currentStudy,
    userInfo,
    studyOptions,
    badgeTags,
    isLoading,
    isMenteeRecruitmentClosed,
    goToNext,
    goToPrevious,
    goToApplications,
    handleSubmit,
    dismissApplicationAlert,
  } = useStudyApplyPage(
    selectedStudyId ?? undefined,
    searchParams.has("study_id"),
  );

  const handleStudySelection = async (studyId: string) => {
    const selectedStudy = studyOptions.find(({ value }) => value === studyId);

    try {
      const status = await getStudyApplicationStatus();
      const blockMessage = getStudyApplicationBlockMessage(
        status,
        selectedStudy?.isAutonomousStudy === true,
        Number(studyId),
      );
      if (blockMessage) {
        setApplicationBlockedMessage(blockMessage);
        return;
      }
    } catch {
      // 신청 페이지에서 상태 확인을 다시 시도한다.
    }

    setSelectedStudyId(studyId);
  };

  if (isMenteeRecruitmentClosed) {
    const goBack = () => router.back();

    return (
      <AlertModal
        isOpen
        description={
          <>
            {activeSemester.act_year}년 {activeSemester.act_semester}학기 스터디
            신청 기간이 지났습니다.
            <br />
            인스타그램과 공지사항을 통해 소식을 확인해주세요.
          </>
        }
        descriptionClassName="w-full text-center"
        onClose={goBack}
        onConfirm={goBack}
        showCancelButton={false}
      />
    );
  }

  if (applicationAlert) {
    return (
      <AlertModal
        isOpen
        description={applicationAlert}
        descriptionClassName="w-full text-center"
        onClose={dismissApplicationAlert}
        onConfirm={dismissApplicationAlert}
        showCancelButton={false}
      />
    );
  }

  if (entryBlockMessage) {
    const goToApplications = () => router.replace("/my?tab=applications");

    return (
      <AlertModal
        isOpen
        description={entryBlockMessage}
        descriptionClassName="w-full text-center"
        onClose={goToApplications}
        onConfirm={goToApplications}
        showCancelButton={false}
      />
    );
  }

  if (isLoading || !userInfo) {
    return <StudyApplySkeleton />;
  }

  if (!selectedStudyId) {
    return (
      <>
        <div className="min-h-viewport max-w-main mx-auto px-4 sm:px-6">
          <div className="mx-auto flex w-full max-w-[792px] flex-col gap-8 pt-10 sm:pt-16">
            <div className="flex flex-col gap-3">
              <h1 className="text-text-bolder text-[28px] font-bold leading-[1.5] tracking-[1px] sm:text-[40px]">
                스터디 신청
              </h1>
              <p className="text-text-subtle text-[17px] leading-[1.5]">
                지원할 스터디를 선택해주세요.
              </p>
            </div>
            <SelectBox
              id="study-apply-select"
              title="지원 스터디"
              titleClassName="text-[19px] font-bold leading-[1.5]"
              required
              size="lg"
              placeholder="스터디를 선택해주세요"
              options={studyOptions}
              value={null}
              onChange={handleStudySelection}
              disabled={studyOptions.length === 0}
            />
            {studyOptions.length === 0 && (
              <p className="text-text-subtle text-[15px] leading-[1.5]">
                현재 신청 가능한 스터디가 없습니다.
              </p>
            )}
          </div>
        </div>
        <AlertModal
          isOpen={applicationBlockedMessage !== null}
          description={applicationBlockedMessage ?? ""}
          descriptionClassName="w-full text-center"
          onClose={() => setApplicationBlockedMessage(null)}
          onConfirm={() => setApplicationBlockedMessage(null)}
          showCancelButton={false}
        />
      </>
    );
  }

  if (!currentStudy) {
    return <StudyApplySkeleton />;
  }

  if (step === 3) {
    return (
      <div className="min-h-viewport max-w-main mx-auto px-4 sm:px-6">
        <StudyApplyComplete
          studyName={currentStudy.study_name}
          userInfo={userInfo}
          priority={`${submittedPriority}순위`}
          intro={submittedIntro}
          isAutonomousStudy={submittedIsAutonomousStudy}
          onGoToApplicationList={goToApplications}
          showSecondStudyButton={false}
        />
      </div>
    );
  }

  return (
    <div className="min-h-viewport relative">
      <div className="flex justify-center px-4 sm:px-6">
        {step === 1 ? (
          <StudyApplyInfoStep
            studyName={currentStudy.study_name}
            tags={badgeTags}
            userInfo={userInfo}
            isAutonomousStudy={isAutonomousStudy}
            isSubmitting={applicationAvailability === "loading"}
            onNext={goToNext}
          />
        ) : (
          <StudyApplyReasonStep
            action={handleSubmit}
            currentStudy={currentStudy}
            studyName={currentStudy.study_name}
            tags={badgeTags}
            isAutonomousStudy={isAutonomousStudy}
            secondaryPriorityAvailability={secondaryPriorityAvailability}
            applicationAvailability={applicationAvailability}
            onPrevious={goToPrevious}
          />
        )}
      </div>
      <AlertModal
        isOpen={applicationBlockedMessage !== null}
        description={applicationBlockedMessage ?? ""}
        descriptionClassName="w-full text-center"
        onClose={() => setApplicationBlockedMessage(null)}
        onConfirm={() => setApplicationBlockedMessage(null)}
        showCancelButton={false}
      />
    </div>
  );
}
