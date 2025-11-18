"use client";
import { studyApplySchema, StudyApplyValues } from "@core/schemas";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Button, SelectBox, TextArea } from "@ui/components/client";
import { Label, Body } from "@ui/components/server";
import Form from "next/form";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { Study } from "@/types/study";

type ActionState = {
  errors: Record<string, { message: string }>;
  values: StudyApplyValues;
};

interface StudyApplyFormProps {
  action: (
    initialState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  studyOptions: Array<{ value: string; label: string }>;
  currentStudy: Study;
}

export function StudyApplyReasonStep({
  action,
  studyOptions,
  currentStudy,
}: StudyApplyFormProps) {
  const initialValues: StudyApplyValues = {
    primaryStudyId: currentStudy.id,
    primaryStudyApplyReason: "",
    secondaryStudyId: null,
    secondaryStudyApplyReason: null,
  };

  const [state, formAction, isPending] = useActionState(action, {
    values: initialValues,
    errors: {},
  });

  const formRef = useRef<HTMLFormElement>(null);
  const [isTransitionPending, startTransition] = useTransition();

  const form = useForm<StudyApplyValues>({
    resolver: standardSchemaResolver(studyApplySchema),
    values: state.values,
    errors: state.errors,
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const {
    control,
    register,
    formState: { errors, isValid },
    watch,
    setValue,
  } = form;

  const watchedSecondaryStudyId = watch("secondaryStudyId");
  const watchedPrimaryReason = watch("primaryStudyApplyReason");
  const watchedSecondaryReason = watch("secondaryStudyApplyReason");

  const isLoading = isPending || isTransitionPending;

  useEffect(() => {
    // Update form values when state changes
    for (const key in state.values) {
      form.setValue(
        key as keyof StudyApplyValues,
        state.values[key as keyof StudyApplyValues],
      );
    }
    form.clearErrors();

    if (state.errors) {
      Object.keys(state.errors).forEach((key) => {
        form.setError(key as keyof StudyApplyValues, {
          message: state.errors[key]?.message ?? "",
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const handleSubmit = async () => {
    const isFormValid = await form.trigger();

    if (!isFormValid) {
      const firstErrorField = Object.keys(form.formState.errors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        element?.focus();
      }
      return;
    }

    startTransition(() => {
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    });
  };

  return (
    <div className="border-divider-gray-light rounded-3 mb-10 flex flex-col justify-center border p-8">
      <Form
        ref={formRef}
        action={formAction}
        className="flex flex-col justify-center gap-8"
      >
        {/* 1지망 스터디 정보 (고정) */}
        <div className="flex flex-col gap-3">
          <Label className="text-text-basic font-bold">1지망 스터디</Label>
          <div className="bg-bg-secondary rounded-2 border-border-gray-light flex flex-col gap-3 border p-6">
            <div className="text-text-basic text-body-large-bold">
              {currentStudy.study_name}
            </div>
            <div className="flex flex-col gap-1">
              <Body size="s" className="text-text-subtle">
                멘토: {currentStudy.primary_mentor_name}
                {currentStudy.secondary_mentor_name &&
                  ` · ${currentStudy.secondary_mentor_name}`}
              </Body>
              {currentStudy.one_liner && (
                <Body size="s" className="text-text-subtle">
                  {currentStudy.one_liner}
                </Body>
              )}
            </div>
            {/* Hidden input for primaryStudyId */}
            <input
              type="hidden"
              name="primaryStudyId"
              value={currentStudy.id}
            />
          </div>
        </div>

        {/* 1지망 지원 사유 */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="primaryStudyApplyReason" className="text-text-basic">
            1지망 스터디 지원 사유
          </Label>
          <TextArea
            id="primaryStudyApplyReason"
            placeholder="1지망 스터디에 지원하는 이유를 50자 이상 500자 이하로 작성해주세요."
            rows={6}
            maxLength={500}
            disabled={isLoading}
            {...register("primaryStudyApplyReason")}
          />
          {errors.primaryStudyApplyReason && (
            <div className="text-danger-danger-50 text-label-small">
              {errors.primaryStudyApplyReason.message}
            </div>
          )}
          <div className="text-text-subtle text-label-small text-right">
            {watchedPrimaryReason?.length || 0} / 500자
          </div>
        </div>

        {/* 2지망 스터디 선택 (선택사항) */}
        <Controller
          control={control}
          name="secondaryStudyId"
          render={({ field: { value, onChange } }) => (
            <>
              <SelectBox
                id="secondaryStudyId"
                value={value ? String(value) : null}
                options={studyOptions}
                placeholder="2지망 스터디를 선택해주세요 (선택사항)"
                title="2지망 스터디 (선택사항)"
                onChange={(val) => onChange(val ? Number(val) : null)}
                error={errors.secondaryStudyId?.message}
                disabled={isLoading}
              />
              {/* Hidden input for FormData */}
              <input
                type="hidden"
                name="secondaryStudyId"
                value={value || ""}
              />
            </>
          )}
        />

        {/* 2지망 지원 사유 (2지망 선택 시 표시) */}
        {watchedSecondaryStudyId && (
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="secondaryStudyApplyReason"
              className="text-text-basic"
            >
              2지망 스터디 지원 사유
            </Label>
            <TextArea
              id="secondaryStudyApplyReason"
              placeholder="2지망 스터디에 지원하는 이유를 50자 이상 500자 이하로 작성해주세요."
              rows={6}
              maxLength={500}
              disabled={isLoading}
              {...register("secondaryStudyApplyReason")}
            />
            {errors.secondaryStudyApplyReason && (
              <div className="text-danger-danger-50 text-label-small">
                {errors.secondaryStudyApplyReason.message}
              </div>
            )}
            <div className="text-text-subtle text-label-small text-right">
              {watchedSecondaryReason?.length || 0} / 500자
            </div>
          </div>
        )}

        {/* Root Error */}
        {errors.root?.message && (
          <Label id="root" size={"s"} className="text-text-danger">
            {errors.root.message}
          </Label>
        )}

        {/* Submit Button */}
        <Button
          type="button"
          size="large"
          disabled={isLoading || !isValid}
          onClick={handleSubmit}
        >
          {isLoading ? "제출 중..." : "스터디 신청"}
        </Button>
      </Form>
    </div>
  );
}
