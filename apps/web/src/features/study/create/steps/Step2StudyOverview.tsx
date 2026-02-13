"use client";

import { useState } from "react";
import {
  Button,
  TextInput,
  TextArea,
  Checkbox,
  SelectBox,
} from "@ui/components/client";
import { Badge } from "@ui/components/server";
import { UseFormReturn, Controller } from "react-hook-form";
import type { StudyOpenValues } from "@core/schemas";
import { TagSelectModal } from "../components/TagSelectModal";
import { LOCATION_OPTIONS, WEEKDAY_OPTIONS } from "../constants";
import { StepNavigation } from "../components/StepNavigation";

interface Step2StudyOverviewProps {
  form: UseFormReturn<StudyOpenValues>;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
}

export function Step2StudyOverview({
  form,
  onPrevious,
  onNext,
  onSaveDraft,
}: Step2StudyOverviewProps) {
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const selectedTags = watch("tags") || [];
  const isOnline = watch("isOnline");

  const handleTagsConfirm = (tags: string[]) => {
    setValue("tags", tags, { shouldValidate: true });
    setIsTagModalOpen(false);
  };

  return (
    <div className="mx-auto mb-16 flex w-full max-w-[792px] flex-col gap-6 sm:gap-10">
      <div className="flex flex-col gap-6 rounded-[12px] border border-[#b1b8be] bg-white p-5 sm:p-10">
        <h2 className="text-text-bolder text-[24px] font-bold leading-[1.5]">
          스터디 개요 및 일정
        </h2>

        <div className="flex flex-col gap-10">
          {/* 스터디명 */}
          <div className="flex flex-col gap-3">
            <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
              스터디명
            </h3>
            <TextInput
              id="studyName"
              length="full"
              placeholder="스터디명을 입력해주세요"
              {...register("studyName")}
            />
            {errors.studyName && (
              <p className="text-text-danger text-[14px]">
                {errors.studyName.message}
              </p>
            )}
          </div>

          {/* 한 줄 설명 */}
          <div className="flex flex-col gap-3">
            <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
              한 줄 설명
            </h3>
            <TextInput
              id="oneLiner"
              length="full"
              placeholder="스터디를 한 줄로 설명해주세요"
              {...register("oneLiner")}
            />
            {errors.oneLiner && (
              <p className="text-text-danger text-[14px]">
                {errors.oneLiner.message}
              </p>
            )}
          </div>

          {/* 태그 */}
          <div className="flex flex-col gap-3">
            <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
              태그
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  label={tag}
                  variant="primary"
                  appearance="solid-pastel"
                  size="medium"
                />
              ))}
              <Button
                variant="secondary"
                size="small"
                onClick={() => setIsTagModalOpen(true)}
                type="button"
              >
                + 태그 추가
              </Button>
            </div>
            {errors.tags && (
              <p className="text-text-danger text-[14px]">
                {errors.tags.message}
              </p>
            )}
          </div>

          {/* 목표 */}
          <div className="flex flex-col gap-3">
            <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
              목표
            </h3>
            <TextArea
              id="goal"
              placeholder="스터디 목표를 작성해주세요 (50~500자)"
              size="large"
              maxLength={500}
              {...register("goal")}
            />
            {errors.goal && (
              <p className="text-text-danger text-[14px]">
                {errors.goal.message}
              </p>
            )}
          </div>

          {/* 스터디 소개 */}
          <div className="flex flex-col gap-3">
            <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
              스터디 소개
            </h3>
            <TextArea
              id="introduction"
              placeholder="스터디를 소개해주세요 (50~500자)"
              size="large"
              maxLength={500}
              {...register("introduction")}
            />
            {errors.introduction && (
              <p className="text-text-danger text-[14px]">
                {errors.introduction.message}
              </p>
            )}
          </div>

          {/* 온라인 여부 */}
          <div className="flex flex-col gap-3">
            <Controller
              control={control}
              name="isOnline"
              render={({ field: { value, onChange } }) => (
                <Checkbox
                  id="isOnline"
                  label="온라인으로 진행합니다"
                  defaultChecked={value}
                  onChange={onChange}
                />
              )}
            />
          </div>

          {/* 진행 장소/요일 */}
          {!isOnline && (
            <div className="flex flex-col gap-3">
              <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
                진행 장소
              </h3>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <div className="flex-1">
                  <Controller
                    control={control}
                    name="location"
                    render={({ field: { value, onChange } }) => (
                      <SelectBox
                        id="location"
                        value={value || null}
                        options={[...LOCATION_OPTIONS]}
                        placeholder="장소를 선택해주세요"
                        onChange={onChange}
                        error={errors.location?.message}
                      />
                    )}
                  />
                </div>
                <div className="flex-1">
                  <TextInput
                    id="room"
                    length="full"
                    placeholder="강의실 (예: 708호)"
                    {...register("room")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 요일 */}
          <div className="flex flex-col gap-3">
            <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
              진행 요일
            </h3>
            <Controller
              control={control}
              name="weekDay"
              render={({ field: { value, onChange } }) => (
                <SelectBox
                  id="weekDay"
                  value={value || null}
                  options={[...WEEKDAY_OPTIONS]}
                  placeholder="요일을 선택해주세요"
                  onChange={onChange}
                  error={errors.weekDay?.message}
                />
              )}
            />
          </div>

          {/* 진행 시간 */}
          <div className="flex flex-col gap-3">
            <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
              진행 시간
            </h3>
            <div className="flex items-center gap-3">
              <TextInput
                id="startTime"
                length="short"
                placeholder="HH:MM"
                {...register("startTime")}
              />
              <span className="text-text-subtle text-[17px]">~</span>
              <TextInput
                id="endTime"
                length="short"
                placeholder="HH:MM"
                {...register("endTime")}
              />
            </div>
            {(errors.startTime || errors.endTime) && (
              <p className="text-text-danger text-[14px]">
                {errors.startTime?.message || errors.endTime?.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <StepNavigation
        onSaveDraft={onSaveDraft}
        onPrevious={onPrevious}
        onNext={onNext}
      />

      <TagSelectModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onConfirm={handleTagsConfirm}
        selectedTags={selectedTags}
      />
    </div>
  );
}
