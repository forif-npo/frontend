"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { StudyApplyValues } from "@core/schemas";
import { StudyApplyInfoStep } from "@/features/study/apply/study-apply-info-step";
import { StudyApplyReasonStep } from "@/features/study/apply/study-apply-reason-step";
import { StudyApplySkeleton } from "@/features/study/apply/StudyApplySkeleton";
import { useStudyApplyData } from "@/features/study/apply/useStudyApplyData";
import { getStudyBadgeTags } from "@/features/study/apply/utils";

type ActionState = {
  errors: Record<string, { message: string }>;
  values: StudyApplyValues;
};

type Props = {
  params: Promise<{ study_id: string }>;
};

export default function StudyApplyPage({ params }: Props) {
  const router = useRouter();
  const { study_id } = use(params);
  const [step, setStep] = useState<1 | 2>(1);

  const { currentStudy, userInfo, studyOptions, isLoading } =
    useStudyApplyData(study_id);

  const handleNext = () => setStep(2);
  const handleCancel = () => router.push("/study/list");

  const handleSubmit = async (
    _: ActionState,
    formData: FormData,
  ): Promise<ActionState> => {
    if (!currentStudy) {
      return {
        values: {
          primaryStudyId: 0,
          primaryStudyApplyReason: "",
          secondaryStudyId: null,
          secondaryStudyApplyReason: null,
        },
        errors: { root: { message: "스터디 정보를 찾을 수 없습니다." } },
      };
    }

    console.log("Form submitted", formData);
    return {
      values: {
        primaryStudyId: currentStudy.id,
        primaryStudyApplyReason: "",
        secondaryStudyId: null,
        secondaryStudyApplyReason: null,
      },
      errors: {},
    };
  };

  if (isLoading || !currentStudy || !userInfo) {
    return <StudyApplySkeleton />;
  }

  const badgeTags = getStudyBadgeTags(currentStudy);

  if (step === 1) {
    return (
      <StudyApplyInfoStep
        studyName={currentStudy.study_name}
        tags={badgeTags}
        userInfo={userInfo}
        onNext={handleNext}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <StudyApplyReasonStep
      action={handleSubmit}
      studyOptions={studyOptions}
      currentStudy={currentStudy}
      studyName={currentStudy.study_name}
      tags={badgeTags}
      onPrevious={() => setStep(1)}
    />
  );
}
