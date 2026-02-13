"use client";

import { UseFormReturn } from "react-hook-form";
import type { StudyOpenValues } from "@core/schemas";
import { StepNavigation } from "../components/StepNavigation";

interface Step3WeeklyPlanProps {
  form: UseFormReturn<StudyOpenValues>;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 8H13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
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

  const addContent = (weekIndex: number) => {
    const current = curriculum[weekIndex].contents;
    const updated = [...curriculum];
    updated[weekIndex] = {
      ...updated[weekIndex],
      contents: [...current, ""],
    };
    setValue("curriculum", updated);
  };

  const removeContent = (weekIndex: number, contentIndex: number) => {
    const current = curriculum[weekIndex].contents;
    if (current.length <= 1) return;
    const updated = [...curriculum];
    updated[weekIndex] = {
      ...updated[weekIndex],
      contents: current.filter((_, i) => i !== contentIndex),
    };
    setValue("curriculum", updated);
  };

  return (
    <div className="mx-auto mb-16 flex w-full max-w-[792px] flex-col gap-6 sm:gap-10">
      <div className="flex flex-col gap-6 rounded-[12px] border border-[#b1b8be] bg-white p-5 sm:p-10">
        <h2 className="text-text-bolder text-[24px] font-bold leading-[1.5]">
          주차별 계획
        </h2>

        <div className="-mx-2 overflow-x-auto px-2 sm:mx-0 sm:px-0">
          <div className="min-w-[600px]">
            {/* Table Header */}
            <div className="flex">
              <div className="text-text-bolder w-[60px] shrink-0 border-b border-[#d6e0eb] bg-[#eef2f7] px-3 py-2 text-[14px] font-bold leading-[1.5] md:w-[80px] md:text-[15px]">
                주차
              </div>
              <div className="text-text-bolder w-[100px] shrink-0 border-b border-[#d6e0eb] bg-[#eef2f7] px-3 py-2 text-[14px] font-bold leading-[1.5] md:w-[120px] md:text-[15px]">
                진행 날짜
              </div>
              <div className="text-text-bolder w-[160px] shrink-0 border-b border-[#d6e0eb] bg-[#eef2f7] px-3 py-2 text-[14px] font-bold leading-[1.5] md:w-[200px] md:text-[15px]">
                주제
              </div>
              <div className="text-text-bolder flex-1 border-b border-[#d6e0eb] bg-[#eef2f7] px-3 py-2 text-[14px] font-bold leading-[1.5] md:text-[15px]">
                내용
              </div>
              <div className="w-[40px] shrink-0 border-b border-[#d6e0eb] bg-[#eef2f7]" />
            </div>

            {/* Table Body */}
            {curriculum.map((week, weekIndex) => (
              <div key={weekIndex}>
                {week.contents.map((_, contentIndex) => (
                  <div
                    key={`${weekIndex}-${contentIndex}`}
                    className="flex items-center"
                  >
                    {/* Week number */}
                    <div className="text-text-subtle w-[60px] shrink-0 border-b border-[#cdd1d5] px-3 py-2 text-[15px] leading-[1.5] md:w-[80px]">
                      {contentIndex === 0 ? week.week : ""}
                    </div>

                    {/* Date */}
                    <div className="w-[100px] shrink-0 border-b border-[#cdd1d5] px-1 py-1 md:w-[120px]">
                      {contentIndex === 0 && (
                        <input
                          className="text-text-basic w-full rounded border border-transparent px-2 py-1 text-[14px] leading-[1.5] focus:border-[#063a74] focus:outline-none"
                          placeholder="MM/DD"
                          {...register(`curriculum.${weekIndex}.date`)}
                        />
                      )}
                    </div>

                    {/* Topic */}
                    <div className="w-[160px] shrink-0 border-b border-[#cdd1d5] px-1 py-1 md:w-[200px]">
                      {contentIndex === 0 && (
                        <input
                          className="text-text-basic w-full rounded border border-transparent px-2 py-1 text-[14px] leading-[1.5] focus:border-[#063a74] focus:outline-none"
                          placeholder="주제를 입력하세요"
                          {...register(`curriculum.${weekIndex}.topic`)}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 border-b border-[#cdd1d5] px-1 py-1">
                      <input
                        className="text-text-basic w-full rounded border border-transparent px-2 py-1 text-[14px] leading-[1.5] focus:border-[#063a74] focus:outline-none"
                        placeholder="내용을 입력하세요"
                        {...register(
                          `curriculum.${weekIndex}.contents.${contentIndex}`,
                        )}
                      />
                    </div>

                    {/* Delete button */}
                    <div className="flex w-[40px] shrink-0 items-center justify-center border-b border-[#cdd1d5]">
                      {week.contents.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeContent(weekIndex, contentIndex)}
                          className="rounded p-1 text-red-500 hover:bg-red-50"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add content row */}
                <div className="flex justify-end border-b border-[#e5e8eb] px-3 py-1">
                  <button
                    type="button"
                    onClick={() => addContent(weekIndex)}
                    className="text-text-primary text-[13px] leading-[1.5] hover:underline"
                  >
                    + 내용 추가
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {errors.curriculum && (
          <p className="text-text-danger text-[14px]">
            {typeof errors.curriculum.message === "string"
              ? errors.curriculum.message
              : "커리큘럼을 모두 작성해주세요."}
          </p>
        )}
      </div>

      <StepNavigation
        onSaveDraft={onSaveDraft}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    </div>
  );
}
