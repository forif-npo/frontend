"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StudyApplyValues } from "@core/schemas";
import { getStudyApplicationStatus } from "@core/my-page/api";
import { apiClient, handleApiError } from "@core/utils/api-client";
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
type ApplicationAvailability = "loading" | "available" | "blocked" | "error";

const EMPTY_VALUES: StudyApplyValues = {
  primaryStudyId: 0,
  isAutonomousStudy: false,
};

export function useStudyApplyPage(studyId?: string) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submittedIntro, setSubmittedIntro] = useState<string>("");
  const [submittedPriority, setSubmittedPriority] = useState<1 | 2>(1);
  const [submittedIsAutonomousStudy, setSubmittedIsAutonomousStudy] =
    useState(false);
  const [secondaryPriorityAvailability, setSecondaryPriorityAvailability] =
    useState<SecondaryPriorityAvailability>("loading");
  const [applicationAvailability, setApplicationAvailability] =
    useState<ApplicationAvailability>("loading");

  const {
    currentStudy,
    userInfo,
    studyOptions,
    isLoading,
    isMenteeRecruitmentClosed,
  } = useStudyApplyData(studyId);

  const badgeTags = currentStudy ? getStudyBadgeTags(currentStudy) : [];
  const isAutonomousStudy = currentStudy?.autonomous_study === true;

  useEffect(() => {
    if (!currentStudy) return;

    let isCancelled = false;
    setSecondaryPriorityAvailability("loading");
    setApplicationAvailability("loading");

    getStudyApplicationStatus()
      .then((status) => {
        if (isCancelled) return;

        setSecondaryPriorityAvailability(
          status.can_apply_secondary ? "available" : "unavailable",
        );
        setApplicationAvailability(
          status.has_autonomous_study_application ||
            (isAutonomousStudy && !status.can_apply_autonomous_study)
            ? "blocked"
            : "available",
        );
      })
      .catch(() => {
        if (!isCancelled) {
          setSecondaryPriorityAvailability("error");
          setApplicationAvailability("error");
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [currentStudy, isAutonomousStudy]);

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
    const values = {
      primaryStudyId: currentStudy.id,
      isAutonomousStudy,
      ...(isAutonomousStudy
        ? {}
        : {
            priority: priority as 1 | 2,
            primaryStudyApplyReason: primaryStudyApplyReason || "",
          }),
    };

    if (applicationAvailability === "blocked") {
      return {
        values,
        errors: {
          root: {
            message: "자율스터디는 정규스터디와 중복 신청할 수 없습니다.",
          },
        },
      };
    }

    if (isAutonomousStudy) {
      if (applicationAvailability !== "available") {
        return {
          values,
          errors: {
            root: {
              message:
                "신청 가능 여부를 확인할 수 없습니다. 다시 시도해주세요.",
            },
          },
        };
      }

      try {
        await apiClient
          .post("api/v1/users/apply", {
            json: { study_id: currentStudy.id },
          })
          .json();
      } catch (error) {
        return {
          values,
          errors: { root: { message: await handleApiError(error) } },
        };
      }

      setSubmittedIntro("");
      setSubmittedPriority(1);
      setSubmittedIsAutonomousStudy(true);
      setStep(3);

      return { values, errors: {} };
    }

    if (priority === 2 && secondaryPriorityAvailability !== "available") {
      return {
        values,
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
          isAutonomousStudy: false,
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
    } catch (error) {
      return {
        values,
        errors: {
          root: { message: await handleApiError(error) },
        },
      };
    }

    setSubmittedIntro(primaryStudyApplyReason);
    setSubmittedPriority(priority);
    setSubmittedIsAutonomousStudy(false);
    setStep(3);

    return {
      values,
      errors: {},
    };
  };

  return {
    step,
    submittedIntro,
    submittedPriority,
    submittedIsAutonomousStudy,
    secondaryPriorityAvailability,
    applicationAvailability,
    isAutonomousStudy,
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
