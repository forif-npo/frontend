"use client";

import { studyApplySchema, StudyApplyValues } from "@core/schemas";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { SelectBox, TextArea } from "@ui/components/client";
import { HintText } from "@ui/components/server";
import Form from "next/form";
import { useActionState, useEffect, useRef, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { Study } from "@/types/study";
import { StepNavigation } from "../create/components/StepNavigation";
import { StudySectionTitle } from "../components/StudySectionTitle";
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
  isAutonomousStudy: boolean;
  secondaryPriorityAvailability:
    | "loading"
    | "available"
    | "unavailable"
    | "error";
  applicationAvailability: "loading" | "available" | "blocked" | "error";
  onPrevious: () => void;
}

export function StudyApplyReasonStep({
  action,
  currentStudy,
  studyName,
  tags,
  isAutonomousStudy,
  secondaryPriorityAvailability,
  applicationAvailability,
  onPrevious,
}: StudyApplyFormProps) {
  const initialValues: StudyApplyValues = {
    primaryStudyId: currentStudy.id,
    isAutonomousStudy,
    ...(isAutonomousStudy ? {} : { priority: 1, primaryStudyApplyReason: "" }),
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
    mode: "onSubmit",
    reValidateMode: "onSubmit",
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

  useEffect(() => {
    if (secondaryPriorityAvailability === "available") {
      form.setValue("priority", 2);
      form.clearErrors("priority");
    }
  }, [form, secondaryPriorityAvailability]);

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
        <section className="flex flex-col gap-6">
          <Controller
            control={form.control}
            name="priority"
            render={({ field: { value, onChange } }) => (
              <SelectBox
                id="priority"
                title="지원순위"
                titleClassName="text-[19px] font-bold leading-[1.5]"
                required
                size="lg"
                value={value ? String(value) : null}
                options={
                  secondaryPriorityAvailability === "available"
                    ? [{ value: "2", label: "2순위" }]
                    : [
                        { value: "1", label: "1순위" },
                        { value: "2", label: "2순위" },
                      ]
                }
                placeholder="지원순위를 선택해주세요"
                onChange={(selectedValue) => {
                  if (
                    selectedValue === "2" &&
                    secondaryPriorityAvailability !== "available"
                  ) {
                    form.setError("priority", {
                      message:
                        secondaryPriorityAvailability === "unavailable"
                          ? "1순위 스터디부터 신청해주세요."
                          : "지원 순위를 확인할 수 없습니다. 다시 시도해주세요.",
                    });
                    return;
                  }

                  form.clearErrors("priority");
                  onChange(Number(selectedValue));
                }}
                error={errors.priority?.message}
                disabled={
                  isLoading ||
                  isAutonomousStudy ||
                  secondaryPriorityAvailability === "loading"
                }
              />
            )}
          />
          <StudySectionTitle required>지원 사유</StudySectionTitle>
          <div className="flex flex-col gap-1">
            <HintText>
              해당 스터디를 수강하고 싶은 사유를 작성해주세요. 최소 50자 이상,
              최대 500자 이내로 작성해주세요.
            </HintText>
            <TextArea
              id="primaryStudyApplyReason"
              placeholder="내용을 입력하세요"
              maxLength={500}
              disabled={isLoading || isAutonomousStudy}
              size="large"
              className="h-72"
              error={errors.primaryStudyApplyReason?.message}
              {...register("primaryStudyApplyReason")}
            />
          </div>
        </section>
        {errors.root && (
          <p className="text-text-danger text-[13px]">{errors.root.message}</p>
        )}

        <input type="hidden" name="primaryStudyId" value={currentStudy.id} />
        <input type="hidden" name="priority" value={form.watch("priority")} />

        <StepNavigation
          onPrevious={onPrevious}
          onNext={handleSubmit}
          nextLabel="제출"
          isSubmitting={isLoading || applicationAvailability === "loading"}
        />
      </Form>
    </div>
  );
}
