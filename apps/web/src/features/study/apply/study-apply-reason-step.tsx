"use client";

import { studyApplySchema, StudyApplyValues } from "@core/schemas";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Button, TextArea } from "@ui/components/client";
import Form from "next/form";
import { useActionState, useEffect, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
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
  currentStudy: Study;
  studyName: string;
  tags: BadgeTag[];
  onPrevious: () => void;
  onCancel: () => void;
}

export function StudyApplyReasonStep({
  action,
  currentStudy,
  studyName,
  tags,
  onPrevious,
  onCancel,
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
    register,
    formState: { errors },
  } = form;

  const isLoading = isPending || isTransitionPending;

  useEffect(() => {
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
    <div className="mx-auto mb-16 flex w-full max-w-[792px] flex-col">
      <StudyApplyTitle studyName={studyName} tags={tags} />

      <Form ref={formRef} action={formAction} className="flex flex-col gap-10">
        {/* 스터디 지원서 카드 */}
        <div className="flex flex-col gap-6 rounded-[12px] border border-[#b1b8be] bg-white p-5 sm:p-10">
          <h2 className="text-text-bolder text-[24px] font-bold leading-[1.5]">
            스터디 지원서
          </h2>

          <div className="flex flex-col gap-6">
            {/* 지원 사유 */}
            <div className="flex items-center gap-0">
              <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
                지원 사유
              </h3>
              <span className="ml-1 text-[19px] leading-[1.5] text-[#bd2c0f]">
                *
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-text-subtle text-[13px] leading-[1.5]">
                해당 스터디를 수강하고 싶은 사유를 작성해주세요. 최소 50자 이상,
                최대 500자 이내로 작성해주세요.
              </p>
              <TextArea
                id="primaryStudyApplyReason"
                placeholder="내용을 입력하세요"
                maxLength={500}
                disabled={isLoading}
                size="large"
                style={{ height: "300px" }}
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
          <input type="hidden" name="primaryStudyId" value={currentStudy.id} />
        </div>

        {/* 버튼 영역 */}
        <div className="flex items-start justify-between">
          <Button
            type="button"
            variant="tertiary"
            size="large"
            onClick={onCancel}
            className="h-14 w-[90px]"
          >
            취소
          </Button>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="secondary"
              size="large"
              onClick={onPrevious}
              className="h-14 w-[90px]"
            >
              이전
            </Button>
            <Button
              type="button"
              size="large"
              disabled={isLoading}
              onClick={handleSubmit}
              className="h-14 w-[90px]"
            >
              제출
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
