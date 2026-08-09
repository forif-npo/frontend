"use client";

import { TextInput, Checkbox, SelectBox } from "@ui/components/client";
import { UseFormReturn, Controller } from "react-hook-form";
import type { StudyOpenValues } from "@core/schemas";
import { useDateInput } from "@/hooks/useDateInput";
import { DIFFICULTY_OPTIONS } from "../constants";
import { ReferenceFields } from "../components/ReferenceFields";
import { StepNavigation } from "../components/StepNavigation";
import { StudySectionTitle } from "../../components/StudySectionTitle";

interface Step4TargetAndOperationProps {
  form: UseFormReturn<StudyOpenValues>;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onPreview: () => void;
  isEditing?: boolean;
}

export function Step4TargetAndOperation({
  form,
  onPrevious,
  onNext,
  onSaveDraft,
  onPreview,
  isEditing = false,
}: Step4TargetAndOperationProps) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const hasInterview = watch("hasInterview");
  const { registerShortDateInput } = useDateInput<StudyOpenValues>({
    register,
    setValue,
  });

  return (
    <div className="flex w-full flex-col gap-12">
      <p className="text-text-basic text-[24px] font-bold leading-[1.5]">
        난이도 및 운영 방식
      </p>

      <div className="flex flex-col gap-10">
        {/* 난이도 */}
        <div className="flex flex-col gap-3">
          <StudySectionTitle required>난이도</StudySectionTitle>
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
          <StudySectionTitle>면접 여부</StudySectionTitle>
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
                placeholder="YYMMDD"
                {...registerShortDateInput("interviewDate")}
              />
            </div>
          )}
        </div>

        {isEditing ? (
          <p className="bg-surface-gray-subtler text-text-subtle rounded-xl p-4 text-[15px] leading-[1.5]">
            기존 참고자료는 신청서 확인 화면에서 볼 수 있으며, 이번 수정
            제출에도 그대로 유지됩니다.
          </p>
        ) : (
          <ReferenceFields form={form} />
        )}
      </div>

      <StepNavigation
        onSaveDraft={onSaveDraft}
        onPrevious={onPrevious}
        onNext={onNext}
        leadingActions={[
          { label: "미리보기", onClick: onPreview, variant: "secondary" },
        ]}
      />
    </div>
  );
}
