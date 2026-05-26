"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StudyApplyValues } from "@core/schemas";
import { apiClient } from "@core/utils/api-client";
import { useStudyApplyData } from "./useStudyApplyData";
import { getStudyBadgeTags } from "./utils";

type ActionState = {
  errors: Record<string, { message: string }>;
  values: StudyApplyValues;
};

type Step = 1 | 2 | 3;

const EMPTY_VALUES: StudyApplyValues = {
  primaryStudyId: 0,
  primaryStudyApplyReason: "",
};

export function useStudyApplyPage(studyId: string) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submittedIntro, setSubmittedIntro] = useState<string>("");

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

    if (!primaryStudyApplyReason || primaryStudyApplyReason.length < 50) {
      return {
        values: {
          primaryStudyId: currentStudy.id,
          primaryStudyApplyReason: primaryStudyApplyReason || "",
        },
        errors: {
          primaryStudyApplyReason: {
            message: "지원 사유는 최소 50자 이상 작성해주세요.",
          },
        },
      };
    }

    try {
      await apiClient
        .post("api/v1/users/apply", {
          json: {
            study_id: currentStudy.id,
            apply_reason: primaryStudyApplyReason,
            priority: 1,
          },
        })
        .json();
    } catch {
      return {
        values: {
          primaryStudyId: currentStudy.id,
          primaryStudyApplyReason,
        },
        errors: {
          root: { message: "지원 중 오류가 발생했습니다. 다시 시도해주세요." },
        },
      };
    }

    setSubmittedIntro(primaryStudyApplyReason);
    setStep(3);

    return {
      values: {
        primaryStudyId: currentStudy.id,
        primaryStudyApplyReason,
      },
      errors: {},
    };
  };

  return {
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
  };
}
