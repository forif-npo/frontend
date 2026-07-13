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
      clearStudyCreateDraft();
      setStep(6);
    } catch (err) {
      console.error("Failed to submit study:", err);
      alert("제출에 실패했습니다. 다시 시도해주세요.");
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
