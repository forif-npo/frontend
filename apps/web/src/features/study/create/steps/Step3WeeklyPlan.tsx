"use client";

import { UseFormReturn } from "react-hook-form";
import type { StudyOpenValues } from "@core/schemas";
import { useDateInput } from "@/hooks/useDateInput";
import { StudyCurriculumTable } from "../../components/StudyCurriculumTable";
import { StepNavigation } from "../components/StepNavigation";

interface Step3WeeklyPlanProps {
  form: UseFormReturn<StudyOpenValues>;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
}

export function Step3WeeklyPlan({
  form,
  onPrevious,
  onNext,
  onSaveDraft,
}: Step3WeeklyPlanProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const curriculum = watch("curriculum");
  const { registerShortDateInput } = useDateInput({ register, setValue });

  const addContent = (weekIndex: number) => {
    const updated = [...curriculum];
    updated[weekIndex] = {
      ...updated[weekIndex],
      contents: [...updated[weekIndex].contents, ""],
    };
    setValue("curriculum", updated);
  };

  return (
    <div className="flex w-full flex-col gap-12">
      {/* 제목 */}
      <p className="text-text-basic text-[24px] font-bold leading-[1.5]">
        주차별 계획
      </p>

      {/* 본문 */}
      <div className="flex flex-col gap-6">
        {/* 커리큘럼 라벨 */}
        <div className="flex flex-col gap-6">
          <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
            커리큘럼
          </h3>

          <StudyCurriculumTable
            rows={curriculum.map((week) => ({
              id: week.week,
              week: week.week,
              contents: week.contents,
            }))}
            renderDateInput={(weekIndex, inputClassName) => (
              <input
                className={inputClassName}
                placeholder="YYMMDD"
                {...registerShortDateInput(`curriculum.${weekIndex}.date`)}
              />
            )}
            renderTopicInput={(weekIndex, inputClassName) => (
              <textarea
                rows={1}
                className={`${inputClassName} resize-none overflow-y-auto whitespace-pre-wrap break-words [field-sizing:content]`}
                placeholder={`${curriculum[weekIndex].week}주차 주제를 입력해주세요.`}
                {...register(`curriculum.${weekIndex}.topic`)}
              />
            )}
            renderContentInput={(weekIndex, contentIndex, inputClassName) => (
              <textarea
                rows={1}
                className={`${inputClassName} resize-none overflow-y-auto whitespace-pre-wrap break-words [field-sizing:content]`}
                placeholder={`${curriculum[weekIndex].week}주차 내용을 입력해주세요.`}
                {...register(
                  `curriculum.${weekIndex}.contents.${contentIndex}`,
                )}
              />
            )}
            onAddContent={addContent}
          />

          {errors.curriculum && (
            <p className="text-text-danger text-[14px]">
              {typeof errors.curriculum.message === "string"
                ? errors.curriculum.message
                : "커리큘럼을 모두 작성해주세요."}
            </p>
          )}
        </div>
      </div>

      <StepNavigation
        onSaveDraft={onSaveDraft}
        onPrevious={onPrevious}
        onNext={onNext}
        leadingActions={[
          { label: "미리보기", onClick: () => {}, variant: "secondary" },
        ]}
      />
    </div>
  );
}
