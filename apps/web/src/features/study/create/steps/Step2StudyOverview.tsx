"use client";

import { useState } from "react";
import {
  Button,
  TextInput,
  TextArea,
  Checkbox,
  FileUpload,
  SelectBox,
} from "@ui/components/client";
import { CirclePlus, Minus } from "@repo/assets/icons/lucide";
import { UseFormReturn, Controller } from "react-hook-form";
import type { StudyOpenValues } from "@core/schemas";
import { TagSelectModal } from "../components/TagSelectModal";
import { LOCATION_OPTIONS, WEEKDAY_OPTIONS } from "../constants";

/** 섹션 타이틀 */
function SectionTitle({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
        {children}
      </h3>
      {icon}
    </div>
  );
}

/** 힌트 텍스트 */
function HintText({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-text-subtle text-[13px] leading-[1.5]">{children}</p>
  );
}

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
  const thumbnail = watch("thumbnail");

  const handleTagsConfirm = (tags: string[]) => {
    setValue("tags", tags, { shouldDirty: true, shouldValidate: true });
    setIsTagModalOpen(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      "tags",
      selectedTags.filter((t) => t !== tagToRemove),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const handleThumbnailUpload = async (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      alert("jpg, jpeg, png 형식의 이미지만 업로드할 수 있습니다.");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("이미지 파일은 최대 5MB까지 업로드할 수 있습니다.");
      return false;
    }

    setValue("thumbnail", file, { shouldDirty: true, shouldValidate: true });
    return true;
  };

  const handleThumbnailRemove = () => {
    setValue("thumbnail", null, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="flex w-full flex-col gap-12">
      {/* 스터디명 + 한 줄 설명 + 태그 (헤딩 영역) */}
      <div className="flex flex-col gap-6">
        {/* 스터디명 - 큰 입력 */}
        <input
          id="studyName"
          type="text"
          placeholder="스터디 이름을 입력해주세요"
          className="text-text-bolder placeholder:text-text-subtle-inverse w-full bg-transparent text-[28px] font-bold leading-[1.5] tracking-[1px] outline-none sm:text-[40px]"
          {...register("studyName")}
        />
        {errors.studyName && (
          <p className="text-text-danger text-[14px]">
            {errors.studyName.message}
          </p>
        )}

        {/* 한 줄 설명 */}
        <input
          id="oneLiner"
          type="text"
          placeholder="한 줄 설명을 입력해주세요"
          className="text-text-bolder placeholder:text-text-subtle-inverse w-full bg-transparent text-[20px] font-bold leading-[1.5] outline-none sm:text-[24px]"
          {...register("oneLiner")}
        />
        {errors.oneLiner && (
          <p className="text-text-danger text-[14px]">
            {errors.oneLiner.message}
          </p>
        )}

        {/* 태그 */}
        <div className="flex flex-col gap-2">
          <SectionTitle>태그</SectionTitle>
          <div className="flex flex-wrap items-center gap-2">
            {selectedTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="flex h-8 items-center justify-center rounded-[4px] bg-[#ecf2fe] px-2"
              >
                <span className="text-text-primary text-[17px] leading-[1.5]">
                  {tag}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsTagModalOpen(true)}
              className="text-text-subtle hover:text-text-basic transition-colors"
              aria-label="태그 추가"
            >
              <CirclePlus className="h-6 w-6" />
            </button>
          </div>
          {errors.tags && (
            <p className="text-text-danger text-[14px]">
              {errors.tags.message}
            </p>
          )}
        </div>
      </div>

      {/* 본문 폼 영역 */}
      <div className="flex flex-col gap-10">
        {/* 썸네일 */}
        <div className="flex flex-col gap-6">
          <SectionTitle>썸네일</SectionTitle>
          <div className="flex flex-col gap-2">
            <HintText>
              부원들이 한 눈에 볼 수 있는 썸네일을 선택해주세요.
            </HintText>
            <FileUpload
              title="이미지 파일 업로드 (jpg, jpeg, png)"
              description="권장 크기 1080px * 720px, 최대 5MB"
              accept="image/jpeg,image/png"
              multiple={false}
              maxFiles={1}
              files={thumbnail ? [thumbnail] : []}
              onUpload={handleThumbnailUpload}
              onRemove={handleThumbnailRemove}
            />
          </div>
        </div>

        {/* 스터디 소개 */}
        <div className="flex flex-col gap-6">
          <SectionTitle>스터디 소개</SectionTitle>
          <div className="flex flex-col gap-2">
            <HintText>
              스터디에 대해 소개해주세요. 최소 50자 이상, 최대 500자 이내로
              작성해주세요.
            </HintText>
            <TextArea
              id="introduction"
              placeholder="내용을 입력하세요"
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

          {/* 온라인 체크박스 */}
          <Controller
            control={control}
            name="isOnline"
            render={({ field: { value, onChange } }) => (
              <div className="flex items-start gap-2">
                <Checkbox
                  id="isOnline"
                  defaultChecked={value}
                  onChange={onChange}
                  size="lg"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-text-bolder text-[19px] leading-[1.5]">
                    온라인으로 진행합니다.
                  </span>
                  <span className="text-text-subtle text-[17px] leading-[1.5]">
                    스터디를 온라인으로 진행할 시 스터디 지원금이 나오지
                    않습니다.
                  </span>
                </div>
              </div>
            )}
          />
        </div>

        {/* 진행 장소 / 요일 */}
        <div className="flex flex-col gap-6">
          <SectionTitle>진행 장소 / 요일</SectionTitle>
          <div className="flex flex-col gap-2">
            <HintText>
              장소가 확정되지 않았다면 &apos;장소 미정&apos;을 선택해주세요.
            </HintText>
            <div className="flex flex-row gap-2 max-md:flex-col">
              {/* 장소 선택 */}
              <div className="w-[320px] max-md:w-full">
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
              {/* 강의실 */}
              <div className="flex flex-1 items-center max-md:w-full">
                <TextInput
                  id="room"
                  length="full"
                  placeholder="강의실(호)"
                  error={errors.room?.message}
                  {...register("room")}
                />
              </div>
              {/* 요일 */}
              <div className="flex-1 max-md:w-full">
                <Controller
                  control={control}
                  name="weekDay"
                  render={({ field: { value, onChange } }) => (
                    <SelectBox
                      id="weekDay"
                      value={value || null}
                      options={[...WEEKDAY_OPTIONS]}
                      placeholder="요일"
                      onChange={onChange}
                      error={errors.weekDay?.message}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 진행 시간 */}
        <div className="flex flex-col gap-6">
          <SectionTitle>진행 시간</SectionTitle>
          <div className="flex flex-col gap-2">
            <HintText>HH:MM ~ HH:MM</HintText>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  id="startTime"
                  length="full"
                  placeholder="HH:MM"
                  error={errors.startTime?.message}
                  {...register("startTime")}
                />
              </div>
              <Minus className="h-6 w-6 shrink-0 text-[#58616a]" />
              <div className="flex-1">
                <TextInput
                  id="endTime"
                  length="full"
                  placeholder="HH:MM"
                  error={errors.endTime?.message}
                  {...register("endTime")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex items-start gap-4">
        <div className="flex flex-1 gap-4">
          <Button
            variant="secondary"
            size="large"
            onClick={onSaveDraft}
            className="h-14 min-w-[90px]"
            type="button"
          >
            임시저장
          </Button>
          <Button
            variant="secondary"
            size="large"
            onClick={() => {}}
            className="h-14 min-w-[90px]"
            type="button"
          >
            미리보기
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="tertiary"
            size="large"
            onClick={onPrevious}
            className="h-14 min-w-[90px]"
            type="button"
          >
            이전
          </Button>
          <Button
            variant="primary"
            size="large"
            onClick={onNext}
            className="h-14 min-w-[90px]"
            type="button"
          >
            다음
          </Button>
        </div>
      </div>

      <TagSelectModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onConfirm={handleTagsConfirm}
        selectedTags={selectedTags}
      />
    </div>
  );
}
