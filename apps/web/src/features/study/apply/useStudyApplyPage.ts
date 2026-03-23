"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StudyApplyValues } from "@core/schemas";
import { useStudyApplyData } from "./useStudyApplyData";
import { getStudyBadgeTags } from "./utils";

type ActionState = {
  errors: Record<string, { message: string }>;
  values: StudyApplyValues;
};

type Step = 1 | 2 | 3;
type Priority = "1순위" | "2순위";

const EMPTY_VALUES: StudyApplyValues = {
  primaryStudyId: 0,
  primaryStudyApplyReason: "",
  secondaryStudyId: null,
  secondaryStudyApplyReason: null,
};

export function useStudyApplyPage(studyId: string) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submittedPriority, setSubmittedPriority] = useState<Priority>("1순위");

  const { currentStudy, userInfo, studyOptions, isLoading } =
    useStudyApplyData(studyId);

  const badgeTags = currentStudy ? getStudyBadgeTags(currentStudy) : [];

  const goToNext = () => setStep(2);
  const goToPrevious = () => setStep(1);
  const goToStudyList = () => router.push("/studies/list");
  const goToApplications = () => router.push("/my/applications");

  const handleSubmit = async (
    _: ActionState,
    formData: FormData,
  ): Promise<ActionState> => {
    if (!currentStudy) {
      return {
        values: EMPTY_VALUES,
        errors: { root: { message: "스터디 정보를 찾을 수 없습니다." } },
      };
    }

    const primaryStudyApplyReason = formData.get(
      "primaryStudyApplyReason",
    ) as string;
    const secondaryStudyId = formData.get("secondaryStudyId") as string;

    if (!primaryStudyApplyReason || primaryStudyApplyReason.length < 50) {
      return {
        values: {
          primaryStudyId: currentStudy.id,
          primaryStudyApplyReason: primaryStudyApplyReason || "",
          secondaryStudyId: secondaryStudyId ? Number(secondaryStudyId) : null,
          secondaryStudyApplyReason: null,
        },
        errors: {
          primaryStudyApplyReason: {
            message: "지원 사유는 최소 50자 이상 작성해주세요.",
          },
        },
      };
    }

    console.log("Form submitted", {
      primaryStudyId: currentStudy.id,
      primaryStudyApplyReason,
      secondaryStudyId,
    });

    setSubmittedPriority(secondaryStudyId ? "2순위" : "1순위");
    setStep(3);

    return {
      values: {
        primaryStudyId: currentStudy.id,
        primaryStudyApplyReason,
        secondaryStudyId: secondaryStudyId ? Number(secondaryStudyId) : null,
        secondaryStudyApplyReason: null,
      },
      errors: {},
    };
  };

  return {
    step,
    submittedPriority,
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
  };
}
