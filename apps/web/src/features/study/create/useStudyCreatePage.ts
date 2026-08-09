"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { studyOpenSchema, StudyOpenValues } from "@core/schemas";
import { apiClient, handleApiError } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import type { StudyApplicationDetail } from "@core/study-application/api";
import { useStudyCreateData } from "./useStudyCreateData";
import { submitStudyCreate } from "./actions";
import {
  clearStudyCreateDraft,
  loadStudyCreateDraft,
  saveStudyCreateDraft,
} from "./draft-storage";
import { DEFAULT_CURRICULUM } from "./constants";
import type { StudyCreateStep } from "./types";
import { getStudyTagLabel } from "@/constants/study-tags";

export interface StudyCreateAlert {
  description: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const DEFAULT_VALUES: StudyOpenValues = {
  mentorIds: [],
  studyName: "",
  oneLiner: "",
  tags: [],
  thumbnail: null,
  introduction: "",
  isOnline: false,
  location: "",
  room: "",
  weekDay: "",
  startTime: "",
  endTime: "",
  curriculum: DEFAULT_CURRICULUM,
  difficulty: "",
  hasInterview: false,
  interviewDate: null,
  references: [],
};

// Fields to validate per step
const STEP_FIELDS: Record<number, (keyof StudyOpenValues)[]> = {
  1: [],
  2: [
    "studyName",
    "oneLiner",
    "tags",
    "introduction",
    "location",
    "room",
    "weekDay",
    "startTime",
    "endTime",
  ],
  3: ["curriculum"],
  4: ["difficulty"],
  5: [],
};

export function useStudyCreatePage(applicationId?: number) {
  const router = useRouter();
  const hasCheckedDraftRef = useRef(false);
  const isSubmittedRef = useRef(false);
  const [step, setStep] = useState<StudyCreateStep>(1);
  const [studyCreateAlert, setStudyCreateAlert] =
    useState<StudyCreateAlert | null>(null);
  const [createdStudyId, setCreatedStudyId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApplicationLoading, setIsApplicationLoading] = useState(
    Boolean(applicationId),
  );
  const { userInfo, isLoading } = useStudyCreateData();

  const form: UseFormReturn<StudyOpenValues> = useForm<StudyOpenValues>({
    resolver: standardSchemaResolver(studyOpenSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    if (applicationId || hasCheckedDraftRef.current) return;
    hasCheckedDraftRef.current = true;

    const draft = loadStudyCreateDraft();
    if (!draft) return;

    setStudyCreateAlert({
      description: "임시저장된 스터디 개설 내용이 있습니다. 불러오시겠습니까?",
      onConfirm: () => {
        form.reset({
          ...DEFAULT_VALUES,
          ...draft,
          thumbnail: null,
        });
      },
      onCancel: clearStudyCreateDraft,
    });
  }, [applicationId, form]);

  useEffect(() => {
    if (!applicationId) return;

    let isCancelled = false;
    setIsApplicationLoading(true);

    apiClient
      .get(`api/v1/study-apply/${applicationId}`)
      .json<ApiResponse<StudyApplicationDetail>>()
      .then((response) => {
        if (isCancelled || !response.data) return;

        const application = response.data;
        if (!application.can_modify) {
          router.replace(`/my/study-applications/${applicationId}`);
          return;
        }
        form.reset(toStudyOpenValues(application));
        setCreatedStudyId(application.study.id);
      })
      .catch(async (error) => {
        if (!isCancelled) {
          setStudyCreateAlert({ description: await handleApiError(error) });
        }
      })
      .finally(() => {
        if (!isCancelled) setIsApplicationLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [applicationId, form, router]);

  // 작성 중 세션 만료 등으로 페이지를 벗어나도 내용이 남도록 자동 임시저장 (디바운스)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const subscription = form.watch(() => {
      if (!form.formState.isDirty) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (isSubmittedRef.current) return;
        saveStudyCreateDraft(form.getValues());
      }, 1000);
    });

    return () => {
      subscription.unsubscribe();
      if (timer) clearTimeout(timer);
    };
  }, [form]);

  const goToNext = useCallback(async () => {
    const fields = STEP_FIELDS[step];
    if (fields && fields.length > 0) {
      const isValid = await form.trigger(fields);
      if (!isValid) {
        const firstErrorField = Object.keys(form.formState.errors)[0];
        if (firstErrorField) {
          document.getElementById(firstErrorField)?.focus();
        }
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 6) as StudyCreateStep);
  }, [step, form]);

  const goToPrevious = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 1) as StudyCreateStep);
  }, []);

  const goToStep = useCallback((target: StudyCreateStep) => {
    setStep(target);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    const isValid = await form.trigger();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const values = form.getValues();
      const response = await submitStudyCreate(values, applicationId);
      setCreatedStudyId(response.data?.study_id ?? null);
      isSubmittedRef.current = true;
      clearStudyCreateDraft();
      setStep(6);
    } catch (err) {
      console.error("Failed to submit study:", err);
      // 실패 시 작성 내용을 보존해 재로그인/재시도 후 이어서 작성할 수 있게 한다
      saveStudyCreateDraft(form.getValues());

      const { HTTPError } = await import("ky");
      if (err instanceof HTTPError && err.response.status === 401) {
        setStudyCreateAlert({
          description:
            "세션이 만료되어 제출하지 못했습니다. 작성 내용은 임시저장되었으니 다시 로그인한 뒤 이어서 작성해주세요.",
        });
        return;
      }
      const errorMessage = await handleApiError(err);
      setStudyCreateAlert({
        description: `${errorMessage} 작성 내용은 임시저장되었습니다.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [applicationId, form, isSubmitting]);

  const handleSaveDraft = useCallback(() => {
    const values = form.getValues();
    const isSaved = saveStudyCreateDraft(values);

    if (isSaved) {
      setStudyCreateAlert({
        description: "임시저장되었습니다.",
      });
      return;
    }

    setStudyCreateAlert({
      description: "임시저장을 사용할 수 없는 환경입니다.",
    });
  }, [form]);

  const goToStudyList = useCallback(() => {
    router.push("/studies/list");
  }, [router]);

  const goToApplication = useCallback(() => {
    if (createdStudyId) {
      router.push(`/my/study-applications/${createdStudyId}`);
      return;
    }
    router.push("/my?section=study-applications");
  }, [createdStudyId, router]);

  return {
    step,
    form,
    userInfo,
    isLoading: isLoading || isApplicationLoading,
    studyCreateAlert,
    goToNext,
    goToPrevious,
    goToStep,
    handleSubmit,
    isSubmitting,
    handleSaveDraft,
    closeStudyCreateAlert: () => setStudyCreateAlert(null),
    goToStudyList,
    goToApplication,
  };
}

function toStudyOpenValues(
  application: StudyApplicationDetail,
): StudyOpenValues {
  const { study } = application;

  return {
    mentorIds:
      study.mentors
        ?.filter((mentor) => mentor.mentor_num !== 1)
        .map((mentor) => mentor.mentor_id) ?? [],
    studyName: study.study_name,
    oneLiner: study.one_liner ?? "",
    tags: study.tags.map(getStudyTagLabel),
    thumbnail: null,
    introduction: study.explanation ?? study.goal ?? "",
    isOnline: Boolean(study.is_online),
    location: study.is_online ? "온라인" : (study.location ?? ""),
    room: study.location_detail ?? "",
    weekDay:
      study.week_day === null || study.week_day === undefined
        ? ""
        : String(study.week_day),
    startTime: study.start_time ?? "",
    endTime: study.end_time ?? "",
    curriculum:
      study.plans.length > 0
        ? study.plans.map((plan) => ({
            week: plan.week_num,
            date: plan.date?.slice(0, 10) ?? "",
            topic: plan.section ?? "",
            contents: plan.content ? plan.content.split("; ") : [""],
          }))
        : DEFAULT_CURRICULUM,
    difficulty: study.difficulty ?? "",
    hasInterview: Boolean(study.requires_interview),
    interviewDate: study.interview_date?.slice(0, 10) ?? null,
    references: [],
  };
}
