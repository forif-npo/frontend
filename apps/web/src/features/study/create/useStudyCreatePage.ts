"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { studyOpenSchema, StudyOpenValues } from "@core/schemas";
import { useStudyCreateData } from "./useStudyCreateData";
import { submitStudyCreate } from "./actions";
import {
  clearStudyCreateDraft,
  loadStudyCreateDraft,
  saveStudyCreateDraft,
} from "./draft-storage";
import { DEFAULT_CURRICULUM } from "./constants";
import type { StudyCreateStep } from "./types";

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

export function useStudyCreatePage() {
  const router = useRouter();
  const hasCheckedDraftRef = useRef(false);
  const isSubmittedRef = useRef(false);
  const [step, setStep] = useState<StudyCreateStep>(1);
  const { userInfo, isLoading } = useStudyCreateData();

  const form: UseFormReturn<StudyOpenValues> = useForm<StudyOpenValues>({
    resolver: standardSchemaResolver(studyOpenSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  useEffect(() => {
    if (hasCheckedDraftRef.current) return;
    hasCheckedDraftRef.current = true;

    const draft = loadStudyCreateDraft();
    if (!draft) return;

    const shouldRestore = window.confirm(
      "임시저장된 스터디 개설 내용이 있습니다. 불러오시겠습니까?",
    );

    if (!shouldRestore) {
      clearStudyCreateDraft();
      return;
    }

    form.reset({
      ...DEFAULT_VALUES,
      ...draft,
      thumbnail: null,
    });
  }, [form]);

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
    const isValid = await form.trigger();
    if (!isValid) return;

    try {
      const values = form.getValues();
      await submitStudyCreate(values);
      isSubmittedRef.current = true;
      clearStudyCreateDraft();
      setStep(6);
    } catch (err) {
      console.error("Failed to submit study:", err);
      // 실패 시 작성 내용을 보존해 재로그인/재시도 후 이어서 작성할 수 있게 한다
      saveStudyCreateDraft(form.getValues());

      const { HTTPError } = await import("ky");
      if (err instanceof HTTPError && err.response.status === 401) {
        alert(
          "세션이 만료되어 제출하지 못했습니다.\n작성 내용은 임시저장되었으니 다시 로그인한 뒤 이어서 작성해주세요.",
        );
        return;
      }
      alert("제출에 실패했습니다. 작성 내용은 임시저장되었습니다.");
    }
  }, [form]);

  const handleSaveDraft = useCallback(() => {
    const values = form.getValues();
    const isSaved = saveStudyCreateDraft(values);

    if (isSaved) {
      alert("임시저장되었습니다.");
      return;
    }

    alert("임시저장을 사용할 수 없는 환경입니다.");
  }, [form]);

  const goToStudyList = useCallback(() => {
    router.push("/studies/list");
  }, [router]);

  const goToApplication = useCallback(() => {
    router.push("/my-page");
  }, [router]);

  return {
    step,
    form,
    userInfo,
    isLoading,
    goToNext,
    goToPrevious,
    goToStep,
    handleSubmit,
    handleSaveDraft,
    goToStudyList,
    goToApplication,
  };
}
