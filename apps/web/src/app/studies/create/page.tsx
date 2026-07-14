"use client";

import { StudyCreateSkeleton } from "@/components/skeleton/StudyCreateSkeleton";
import {
  useStudyCreatePage,
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
    goToApplication,
  } = useStudyCreatePage();

  if (isLoading || !userInfo) {
    return <StudyCreateSkeleton />;
  }

  if (step === 6) {
    return (
      <div className="min-h-viewport max-w-main mx-auto px-4 pb-24 sm:px-6 md:pb-32">
        <StudyCreateComplete
          onGoToStudyList={goToStudyList}
          onGoToApplication={goToApplication}
        />
      </div>
    );
  }

  return (
    <div className="min-h-viewport relative pb-24 md:pb-32">
      <div className="mx-auto flex max-w-[792px] justify-center px-4 sm:px-6">
        {step === 1 && (
          <Step1InfoVerification
            form={form}
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
