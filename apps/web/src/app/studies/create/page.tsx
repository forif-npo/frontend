"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertModal } from "@ui/components/client";
import { StudyCreateSkeleton } from "@/components/skeleton/StudyCreateSkeleton";
import { useActiveSemester } from "@/hooks/useActiveSemester";
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
  const router = useRouter();
  const activeSemester = useActiveSemester();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const {
    step,
    form,
    userInfo,
    isLoading,
    isMentorRecruitmentClosed,
    studyCreateAlert,
    goToNext,
    goToPrevious,
    handleSubmit,
    isSubmitting,
    handleSaveDraft,
    closeStudyCreateAlert,
    goToStudyList,
    goToApplication,
  } = useStudyCreatePage();

  if (isMentorRecruitmentClosed) {
    const goBack = () => router.back();

    return (
      <AlertModal
        isOpen
        description={
          <span className="block w-full text-center">
            {activeSemester.act_year}년 {activeSemester.act_semester}학기 스터디
            개설 신청 기간이 지났습니다.
            <br />
            인스타그램과 공지사항을 통해 소식을 확인해주세요.
          </span>
        }
        onClose={goBack}
        onConfirm={goBack}
        showCancelButton={false}
      />
    );
  }

  if (isLoading || !userInfo) {
    return <StudyCreateSkeleton />;
  }

  if (step === 6) {
    return (
      <div className="min-h-viewport max-w-main mx-auto px-4 pb-24 sm:px-6 md:pb-32">
        <StudyCreateComplete
          values={form.getValues()}
          userInfo={userInfo}
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
          />
        )}
        {step === 5 && (
          <Step5ReviewAndSubmit
            form={form}
            userInfo={userInfo}
            onPrevious={goToPrevious}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
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
