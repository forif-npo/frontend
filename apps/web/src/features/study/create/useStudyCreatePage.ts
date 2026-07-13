"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { studyOpenSchema, StudyOpenValues } from "@core/schemas";
import { useStudyCreateData } from "./useStudyCreateData";
import { submitStudyCreate, saveDraft } from "./actions";
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
  const [step, setStep] = useState<StudyCreateStep>(1);
  const { userInfo, isLoading } = useStudyCreateData();

  const form: UseFormReturn<StudyOpenValues> = useForm<StudyOpenValues>({
    resolver: standardSchemaResolver(studyOpenSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

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
      setStep(6);
    } catch (err) {
      console.error("Failed to submit study:", err);
      alert("제출에 실패했습니다. 다시 시도해주세요.");
    }
  }, [form]);

  const handleSaveDraft = useCallback(() => {
    const values = form.getValues();
    saveDraft(values);
    alert("임시저장되었습니다.");
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
