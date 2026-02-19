"use client";

import {
  useStudyCreatePage,
  StudyHelpPanel,
  Step1InfoVerification,
  Step2StudyOverview,
  Step3WeeklyPlan,
  Step4TargetAndOperation,
  Step5ReviewAndSubmit,
  StudyCreateComplete,
} from "@/features/study/create";

export default function StudyCreatePage() {
  const {
    step,
    form,
    userInfo,
    isLoading,
    goToNext,
    goToPrevious,
    handleSubmit,
    handleSaveDraft,
    goToStudyList,
  } = useStudyCreatePage();

  if (isLoading || !userInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-text-subtle text-[17px]">로딩 중...</div>
      </div>
    );
  }

  if (step === 6) {
    return (
      <div className="mx-auto min-h-screen max-w-[1200px] px-4 sm:px-6">
        <StudyCreateComplete onGoToStudyList={goToStudyList} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <StudyHelpPanel title="스터디 개설 중 어려움이 있으신가요?" />
      <div className="mx-auto flex max-w-[792px] justify-center px-4 sm:px-6">
        {step === 1 && (
          <Step1InfoVerification
            userInfo={userInfo}
            onNext={goToNext}
            onCancel={goToStudyList}
          />
        )}
        {step === 2 && (
          <Step2StudyOverview
            form={form}
            onPrevious={goToPrevious}
            onNext={goToNext}
            onSaveDraft={handleSaveDraft}
          />
        )}
        {step === 3 && (
          <Step3WeeklyPlan
            form={form}
            onPrevious={goToPrevious}
            onNext={goToNext}
            onSaveDraft={handleSaveDraft}
          />
        )}
        {step === 4 && (
          <Step4TargetAndOperation
            form={form}
            onPrevious={goToPrevious}
            onNext={goToNext}
            onSaveDraft={handleSaveDraft}
          />
        )}
        {step === 5 && (
          <Step5ReviewAndSubmit
            form={form}
            onPrevious={goToPrevious}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
