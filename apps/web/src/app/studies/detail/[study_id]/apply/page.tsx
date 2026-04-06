"use client";

import { use } from "react";
import { StudyApplyInfoStep } from "@/features/study/apply/study-apply-info-step";
import { StudyApplyReasonStep } from "@/features/study/apply/study-apply-reason-step";
import { StudyApplyComplete } from "@/features/study/apply/StudyApplyComplete";
import { StudyApplySkeleton } from "@/features/study/apply/StudyApplySkeleton";
import { useStudyApplyPage } from "@/features/study/apply/useStudyApplyPage";

type Props = {
  params: Promise<{ study_id: string }>;
};

export default function StudyApplyPage({ params }: Props) {
  const { study_id } = use(params);
  const {
    step,
    submittedIntro,
    currentStudy,
    userInfo,
    studyOptions,
    badgeTags,
    isLoading,
    goToNext,
    goToPrevious,
    goToStudyList,
    goToApplications,
    handleSubmit,
  } = useStudyApplyPage(study_id);

  if (isLoading || !currentStudy || !userInfo) {
    return <StudyApplySkeleton />;
  }

  if (step === 3) {
    return (
      <div className="mx-auto min-h-screen max-w-[1200px] px-4 sm:px-6">
        <StudyApplyComplete
          studyName={currentStudy.study_name}
          userInfo={userInfo}
          priority="1순위"
          intro={submittedIntro}
          onGoToApplicationList={goToApplications}
          showSecondStudyButton={false}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="flex justify-center px-4 sm:px-6">
        {step === 1 ? (
          <StudyApplyInfoStep
            studyName={currentStudy.study_name}
            tags={badgeTags}
            userInfo={userInfo}
            onNext={goToNext}
            onCancel={goToStudyList}
          />
        ) : (
          <StudyApplyReasonStep
            action={handleSubmit}
            currentStudy={currentStudy}
            studyName={currentStudy.study_name}
            tags={badgeTags}
            onPrevious={goToPrevious}
            onCancel={goToStudyList}
          />
        )}
      </div>
    </div>
  );
}
