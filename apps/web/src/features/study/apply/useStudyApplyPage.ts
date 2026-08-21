"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StudyApplyValues } from "@core/schemas";
import type { ApiResponse } from "@core/types/api";
import type { StudyApplicationsResponse } from "@core/my-page/api";
import { apiClient } from "@core/utils/api-client";
import { useStudyApplyData } from "./useStudyApplyData";
import { getStudyBadgeTags } from "./utils";

type ActionState = {
  errors: Record<string, { message: string }>;
  values: StudyApplyValues;
};

type Step = 1 | 2 | 3;
type SecondaryPriorityAvailability =
  | "loading"
  | "available"
  | "unavailable"
  | "error";

const EMPTY_VALUES: StudyApplyValues = {
  primaryStudyId: 0,
  priority: 1,
  primaryStudyApplyReason: "",
};

export function useStudyApplyPage(studyId?: string) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submittedIntro, setSubmittedIntro] = useState<string>("");
  const [submittedPriority, setSubmittedPriority] = useState<1 | 2>(1);
  const [secondaryPriorityAvailability, setSecondaryPriorityAvailability] =
    useState<SecondaryPriorityAvailability>("loading");

  const {
    currentStudy,
    userInfo,
    studyOptions,
    isLoading,
    isMenteeRecruitmentClosed,
  } = useStudyApplyData(studyId);

  const badgeTags = currentStudy ? getStudyBadgeTags(currentStudy) : [];

  useEffect(() => {
    if (!currentStudy) return;

    let isCancelled = false;
    setSecondaryPriorityAvailability("loading");

    apiClient
      .get("api/v1/users/me/study-applications")
      .json<ApiResponse<StudyApplicationsResponse>>()
      .then((response) => {
        if (isCancelled) return;

        const hasPrimaryApplication = (response.data?.applications ?? []).some(
          (application) =>
            application.apply_year === currentStudy.act_year &&
            application.apply_semester === currentStudy.act_semester &&
            application.primary_application !== null,
        );

        setSecondaryPriorityAvailability(
          hasPrimaryApplication ? "available" : "unavailable",
        );
      })
      .catch(() => {
        if (!isCancelled) setSecondaryPriorityAvailability("error");
      });

    return () => {
      isCancelled = true;
    };
  }, [currentStudy]);

  const goToNext = () => setStep(2);
  const goToPrevious = () => setStep(1);
  const goToStudyList = () => router.push("/studies/list");
  const goToApplications = () =>
    router.push(`/my?tab=applications&study_id=${studyId ?? ""}`);

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
    const priority = Number(formData.get("priority"));

    if (priority === 2 && secondaryPriorityAvailability !== "available") {
      return {
        values: {
          primaryStudyId: currentStudy.id,
          priority: 1,
          primaryStudyApplyReason,
        },
        errors: {
          priority: {
            message:
              secondaryPriorityAvailability === "unavailable"
                ? "1순위 스터디부터 신청해주세요."
                : "지원 순위를 확인할 수 없습니다. 다시 시도해주세요.",
          },
        },
      };
    }

    if (
      !primaryStudyApplyReason ||
      primaryStudyApplyReason.length < 50 ||
      (priority !== 1 && priority !== 2)
    ) {
      return {
        values: {
          primaryStudyId: currentStudy.id,
          priority: priority === 2 ? 2 : 1,
          primaryStudyApplyReason: primaryStudyApplyReason || "",
        },
        errors: {
          ...(primaryStudyApplyReason?.length < 50
            ? {
                primaryStudyApplyReason: {
                  message: "지원 사유는 최소 50자 이상 작성해주세요.",
                },
              }
            : {}),
          ...(priority !== 1 && priority !== 2
            ? { priority: { message: "지원순위를 선택해주세요." } }
            : {}),
        },
      };
    }

    try {
      await apiClient
        .post("api/v1/users/apply", {
          json: {
            study_id: currentStudy.id,
            apply_reason: primaryStudyApplyReason,
            priority,
          },
        })
        .json();
    } catch {
      return {
        values: {
          primaryStudyId: currentStudy.id,
          priority: priority as 1 | 2,
          primaryStudyApplyReason,
        },
        errors: {
          root: { message: "지원 중 오류가 발생했습니다. 다시 시도해주세요." },
        },
      };
    }

    setSubmittedIntro(primaryStudyApplyReason);
    setSubmittedPriority(priority);
    setStep(3);

    return {
      values: {
        primaryStudyId: currentStudy.id,
        priority: priority as 1 | 2,
        primaryStudyApplyReason,
      },
      errors: {},
    };
  };

  return {
    step,
    submittedIntro,
    submittedPriority,
    secondaryPriorityAvailability,
    currentStudy,
    userInfo,
    studyOptions,
    badgeTags,
    isLoading,
    isMenteeRecruitmentClosed,
    goToNext,
    goToPrevious,
    goToStudyList,
    goToApplications,
    handleSubmit,
  };
}
