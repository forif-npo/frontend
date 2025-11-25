"use client";

import { studyApplySchema, StudyApplyValues } from "@core/schemas";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Button, SelectBox, TextArea } from "@ui/components/client";
import Form from "next/form";
import { useActionState, useEffect, useRef, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { Study } from "@/types/study";
import { StudyApplyTitle } from "./StudyApplyTitle";
import { BadgeTag } from "./utils";

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
  studyName: string;
  tags: BadgeTag[];
  onPrevious: () => void;
}

export function StudyApplyReasonStep({
  action,
  studyOptions,
  currentStudy,
  studyName,
  tags,
  onPrevious,
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
  } = form;

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
    <div className="mx-auto mb-16 flex max-w-[1023px] flex-col">
      <StudyApplyTitle studyName={studyName} tags={tags} />

      <Form ref={formRef} action={formAction} className="flex flex-col gap-10">
        {/* 스터디 지원서 카드 */}
        <div className="flex flex-col gap-6 rounded-[12px] border border-[#b1b8be] bg-white p-10">
          <h2 className="text-text-bolder text-[24px] font-bold leading-[1.5]">
            스터디 지원서
          </h2>

          <div className="flex flex-col gap-10">
            {/* 지원순위 */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
                  지원순위
                </h3>
                <span className="text-text-danger text-[19px] leading-[1.5]">
                  *
                </span>
                <div className="text-text-subtle">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M12 8v5M12 16h.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-text-subtle text-[13px] leading-[1.5]">
                  해당 스터디의 지원순위를 입력해주세요. 1순위 스터디와 2순위
                  스터디에 동시 합격 시 1순위 스터디로 자동 합격처리됩니다.
                </p>
                <Controller
                  control={control}
                  name="secondaryStudyId"
                  render={({ field: { value, onChange } }) => (
                    <SelectBox
                      id="secondaryStudyId"
                      value={value ? String(value) : null}
                      options={studyOptions}
                      placeholder="우선순위를 선택해주세요"
                      onChange={(val) => onChange(val ? Number(val) : null)}
                      disabled={isLoading}
                      size="lg"
                    />
                  )}
                />
              </div>
            </div>

            {/* 지원 사유 */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
                  지원 사유
                </h3>
                <span className="text-text-danger text-[19px] leading-[1.5]">
                  *
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-text-subtle text-[13px] leading-[1.5]">
                  해당 스터디를 수강하고 싶은 사유를 작성해주세요. 최소 50자
                  이상, 최대 500자 이내로 작성해주세요.
                </p>
                <TextArea
                  id="primaryStudyApplyReason"
                  placeholder="내용을 입력하세요"
                  rows={10}
                  maxLength={500}
                  disabled={isLoading}
                  size="large"
                  {...register("primaryStudyApplyReason")}
                />
                {errors.primaryStudyApplyReason && (
                  <p className="text-text-danger text-[13px]">
                    {errors.primaryStudyApplyReason.message}
                  </p>
                )}
              </div>
            </div>

            {/* Hidden input for primaryStudyId */}
            <input
              type="hidden"
              name="primaryStudyId"
              value={currentStudy.id}
            />
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex items-start gap-4">
          <div className="flex flex-1 gap-4">
            <Button
              type="button"
              variant="tertiary"
              size="large"
              onClick={onPrevious}
              className="h-14 min-w-[90px]"
            >
              취소하기
            </Button>
          </div>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="secondary"
              size="large"
              onClick={onPrevious}
              className="h-14 min-w-[90px]"
            >
              이전
            </Button>
            <Button
              type="button"
              size="large"
              disabled={isLoading || !isValid}
              onClick={handleSubmit}
              className="h-14 min-w-[90px]"
            >
              제출
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
