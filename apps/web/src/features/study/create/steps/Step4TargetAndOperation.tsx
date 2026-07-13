"use client";

import { Button, TextInput, Checkbox, SelectBox } from "@ui/components/client";
import { Minus } from "@repo/assets/icons/lucide";
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
    setValue("references", [...references, { type: "LINK", value: "" }]);
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
          난이도 및 운영 방식
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
                      ref.type === "LINK"
                        ? "웹사이트 링크를 입력해주세요"
                        : "자료 다운로드 링크를 입력해주세요"
                    }
                    {...register(`references.${index}.value`)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeReference(index)}
                  className="mt-2 rounded p-1 text-red-500 hover:bg-red-50"
                >
                  <Minus className="h-4 w-4" />
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
