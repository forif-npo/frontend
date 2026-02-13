"use client";

import {
  Button,
  TextInput,
  TextArea,
  Checkbox,
  SelectBox,
} from "@ui/components/client";
import { UseFormReturn, Controller } from "react-hook-form";
import type { StudyOpenValues } from "@core/schemas";
import { DIFFICULTY_OPTIONS, REFERENCE_TYPE_OPTIONS } from "../constants";
import { StepNavigation } from "../components/StepNavigation";

interface Step4TargetAndOperationProps {
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

export function Step4TargetAndOperation({
  form,
  onPrevious,
  onNext,
  onSaveDraft,
}: Step4TargetAndOperationProps) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const hasInterview = watch("hasInterview");
  const references = watch("references") || [];

  const addReference = () => {
    setValue("references", [...references, { type: "URL", value: "" }]);
  };

  const removeReference = (index: number) => {
    setValue(
      "references",
      references.filter((_, i) => i !== index),
    );
  };

  return (
    <div className="mx-auto mb-16 flex w-full max-w-[792px] flex-col gap-6 sm:gap-10">
      <div className="flex flex-col gap-6 rounded-[12px] border border-[#b1b8be] bg-white p-5 sm:p-10">
        <h2 className="text-text-bolder text-[24px] font-bold leading-[1.5]">
          추천대상 및 운영 방식
        </h2>

        <div className="flex flex-col gap-10">
          {/* 난이도 */}
          <div className="flex flex-col gap-3">
            <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
              난이도
            </h3>
            <Controller
              control={control}
              name="difficulty"
              render={({ field: { value, onChange } }) => (
                <SelectBox
                  id="difficulty"
                  value={value || null}
                  options={[...DIFFICULTY_OPTIONS]}
                  placeholder="난이도를 선택해주세요"
                  onChange={onChange}
                  error={errors.difficulty?.message}
                />
              )}
            />
          </div>

          {/* 선정 기준 */}
          <div className="flex flex-col gap-3">
            <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
              선정 기준
            </h3>
            <TextArea
              id="selectionCriteria"
              placeholder="멘티 선정 기준을 작성해주세요 (최대 100자)"
              size="small"
              maxLength={100}
              {...register("selectionCriteria")}
            />
            {errors.selectionCriteria && (
              <p className="text-text-danger text-[14px]">
                {errors.selectionCriteria.message}
              </p>
            )}
          </div>

          {/* 모집 인원 */}
          <div className="flex flex-col gap-3">
            <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
              모집 인원
            </h3>
            <TextInput
              id="maxMembers"
              length="short"
              placeholder="인원 수"
              type="number"
              {...register("maxMembers", { valueAsNumber: true })}
            />
            {errors.maxMembers && (
              <p className="text-text-danger text-[14px]">
                {errors.maxMembers.message}
              </p>
            )}
          </div>

          {/* 면접 여부 */}
          <div className="flex flex-col gap-3">
            <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
              면접 여부
            </h3>
            <Controller
              control={control}
              name="hasInterview"
              render={({ field: { value, onChange } }) => (
                <Checkbox
                  id="hasInterview"
                  label="면접을 진행합니다"
                  defaultChecked={value}
                  onChange={onChange}
                />
              )}
            />
            {hasInterview && (
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="interviewDate"
                  className="text-text-subtle text-[15px] leading-[1.5]"
                >
                  면접 날짜
                </label>
                <TextInput
                  id="interviewDate"
                  length="middle"
                  placeholder="YYYY-MM-DD"
                  {...register("interviewDate")}
                />
              </div>
            )}
          </div>

          {/* 참고자료 */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
                참고자료
              </h3>
              <Button
                variant="secondary"
                size="small"
                onClick={addReference}
                type="button"
              >
                + 추가
              </Button>
            </div>

            {references.map((ref, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-[120px] shrink-0">
                  <Controller
                    control={control}
                    name={`references.${index}.type`}
                    render={({ field: { value, onChange } }) => (
                      <SelectBox
                        id={`references.${index}.type`}
                        value={value || null}
                        options={[...REFERENCE_TYPE_OPTIONS]}
                        placeholder="유형"
                        onChange={onChange}
                        size="sm"
                      />
                    )}
                  />
                </div>
                <div className="flex-1">
                  <TextInput
                    id={`references.${index}.value`}
                    length="full"
                    placeholder={
                      ref.type === "URL"
                        ? "URL을 입력해주세요"
                        : "PDF 파일명을 입력해주세요"
                    }
                    {...register(`references.${index}.value`)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeReference(index)}
                  className="mt-2 rounded p-1 text-red-500 hover:bg-red-50"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <StepNavigation
        onSaveDraft={onSaveDraft}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    </div>
  );
}
