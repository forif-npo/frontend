"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { SelectBox } from "@ui/components/client";
import { StudyApplyInfoStep } from "@/features/study/apply/study-apply-info-step";
import { StudyApplyReasonStep } from "@/features/study/apply/study-apply-reason-step";
import { StudyApplyComplete } from "@/features/study/apply/StudyApplyComplete";
import { StudyApplySkeleton } from "@/features/study/apply/StudyApplySkeleton";
import { useStudyApplyPage } from "@/features/study/apply/useStudyApplyPage";

export default function StudyApplyPage() {
  const searchParams = useSearchParams();
  const [selectedStudyId, setSelectedStudyId] = useState<string | null>(() =>
    searchParams.get("study_id"),
  );
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
  } = useStudyApplyPage(selectedStudyId ?? undefined);

  if (isLoading || !userInfo) {
    return <StudyApplySkeleton />;
  }

  if (!selectedStudyId) {
    return (
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
            required
            size="lg"
            placeholder="스터디를 선택해주세요"
            options={studyOptions}
            value={null}
            onChange={setSelectedStudyId}
            disabled={studyOptions.length === 0}
          />
          {studyOptions.length === 0 && (
            <p className="text-text-subtle text-[15px] leading-[1.5]">
              현재 신청 가능한 스터디가 없습니다.
            </p>
          )}
        </div>
      </div>
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
          priority="1순위"
          intro={submittedIntro}
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
