"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertModal } from "@ui/components/client";
import { StudyCreateSkeleton } from "@/components/skeleton/StudyCreateSkeleton";
import {
  useStudyCreatePage,
  Step1InfoVerification,
  Step2StudyOverview,
  Step3WeeklyPlan,
  Step4TargetAndOperation,
  Step5ReviewAndSubmit,
  StudyCreateComplete,
  StudyCreatePreviewModal,
} from "@/features/study/create";

export default function StudyCreatePage() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const searchParams = useSearchParams();
  const parsedApplicationId = Number(searchParams.get("application_id"));
  const applicationId =
    Number.isInteger(parsedApplicationId) && parsedApplicationId > 0
      ? parsedApplicationId
      : undefined;
  const {
    step,
    form,
    userInfo,
    isLoading,
    studyCreateAlert,
    goToNext,
    goToPrevious,
    handleSubmit,
    isSubmitting,
    handleSaveDraft,
    closeStudyCreateAlert,
    goToStudyList,
    goToApplication,
  } = useStudyCreatePage(applicationId);

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
    <div className="relative pb-24 md:pb-32">
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
            onPreview={() => setIsPreviewOpen(true)}
          />
        )}
        {step === 3 && (
          <Step3WeeklyPlan
            form={form}
            onPrevious={goToPrevious}
            onNext={goToNext}
            onSaveDraft={handleSaveDraft}
            onPreview={() => setIsPreviewOpen(true)}
          />
        )}
        {step === 4 && (
          <Step4TargetAndOperation
            form={form}
            onPrevious={goToPrevious}
            onNext={goToNext}
            onSaveDraft={handleSaveDraft}
            onPreview={() => setIsPreviewOpen(true)}
            isEditing={Boolean(applicationId)}
          />
        )}
        {step === 5 && (
          <Step5ReviewAndSubmit
            form={form}
            userInfo={userInfo}
            onPrevious={goToPrevious}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isEditing={Boolean(applicationId)}
          />
        )}
      </div>
      <StudyCreatePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        form={form}
        userInfo={userInfo}
      />
      {studyCreateAlert && (
        <AlertModal
          isOpen
          description={studyCreateAlert.description}
          onClose={closeStudyCreateAlert}
          onConfirm={studyCreateAlert.onConfirm}
          onCancel={studyCreateAlert.onCancel}
        />
      )}
    </div>
  );
}
