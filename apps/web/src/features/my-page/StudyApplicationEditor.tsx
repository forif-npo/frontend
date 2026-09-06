"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  AlertModal,
  Button,
  Checkbox,
  FileUpload,
  SelectBox,
  TextArea,
  TextInput,
} from "@ui/components/client";
import { SearchIcon } from "@ui/components/server";
import { CirclePlus, Minus } from "@repo/assets/icons/lucide";
import { studyOpenSchema, type StudyOpenValues } from "@core/schemas";
import {
  cancelStudyCreationApplication,
  type StudyApplicationDetail,
} from "@/features/study-application/api";
import { handleApiError } from "@core/utils/api-client";
import { ActionConfirmModal } from "@/components/ActionConfirmModal";
import { useDateInput } from "@/hooks/useDateInput";
import { useTimeInput } from "@/hooks/useTimeInput";
import { StudyCurriculumTable } from "@/features/study/components/StudyCurriculumTable";
import { StudySectionTitle } from "@/features/study/components/StudySectionTitle";
import { submitStudyCreate } from "@/features/study/create/actions";
import {
  addCurriculumContent,
  addCurriculumWeek,
  removeCurriculumContent,
  removeCurriculumWeek,
} from "@/features/study/create/curriculum";
import {
  DIFFICULTY_OPTIONS,
  LOCATION_OPTIONS,
  WEEKDAY_OPTIONS,
} from "@/features/study/create/constants";
import { TagSelectModal } from "@/features/study/create/components/TagSelectModal";
import { StudyCreatePreviewModal } from "@/features/study/create/components/StudyCreatePreviewModal";
import { ReferenceFields } from "@/features/study/create/components/ReferenceFields";
import { fetchUserInfo } from "@/features/study/create/user-info";
import { useStudyCreateData } from "@/features/study/create/useStudyCreateData";
import { getThumbnailValidationMessage } from "@/features/study/create/thumbnail-validation";
import { useSecondaryMentor } from "@/features/study/create/useSecondaryMentor";
import {
  buildReferenceUpdate,
  canUpdateStudyApplication,
  toFormValues,
} from "./study-application-editor-utils";

interface StudyApplicationEditorProps {
  application: StudyApplicationDetail;
}

export function StudyApplicationEditor({
  application,
}: StudyApplicationEditorProps) {
  const router = useRouter();
  const { userInfo: currentUserInfo } = useStudyCreateData();
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isOneLinerEditing, setIsOneLinerEditing] = useState(false);
  const [thumbnailAlertMessage, setThumbnailAlertMessage] = useState<
    string | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "modify" | "cancel" | null
  >(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const form = useForm<StudyOpenValues>({
    resolver: standardSchemaResolver(studyOpenSchema),
    defaultValues: toFormValues(application),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors, isDirty, dirtyFields },
  } = form;
  const { registerShortDateInput } = useDateInput({ register, setValue });
  const { registerTimeInput } = useTimeInput({ register, setValue });
  const oneLinerField = register("oneLiner");
  const selectedTags = watch("tags");
  const oneLiner = watch("oneLiner");
  const thumbnail = watch("thumbnail");
  const curriculum = watch("curriculum");
  const newReferences = watch("references");
  const isOnline = watch("isOnline");
  const selectedLocation = watch("location");
  const hasInterview = watch("hasInterview");
  const secondaryMentorId = watch("mentorIds")?.[0] ?? null;
  const {
    mentorSearchValue,
    secondaryMentor,
    mentorError,
    updateMentorSearchValue,
    handleSecondaryMentorSearch,
    handleSecondaryMentorRemove,
  } = useSecondaryMentor({
    currentUserInfo,
    secondaryMentorId,
    fetchUser: fetchUserInfo,
    onMentorIdsChange: (mentorIds) =>
      setValue("mentorIds", mentorIds, { shouldDirty: true }),
  });
  const referenceUpdate = buildReferenceUpdate(
    newReferences,
    application.study.references,
  );
  const hasReferenceUpdates =
    Boolean(dirtyFields.references) && referenceUpdate.hasChanges;
  const canSubmit = canUpdateStudyApplication({
    canModify: application.can_modify,
    hasReferenceUpdates,
    isCancelling,
    isDirty,
    isSubmitting,
  });
  const isRoomDisabled = isOnline || selectedLocation === "장소 미정";

  useEffect(() => {
    form.reset(toFormValues(application));
    setMessage(null);
  }, [application, form]);

  const handleTagsConfirm = (tags: string[]) => {
    setValue("tags", tags, { shouldDirty: true, shouldValidate: true });
    setIsTagModalOpen(false);
  };

  const handleThumbnailUpload = async (file: File) => {
    const validationMessage = getThumbnailValidationMessage(file);
    if (validationMessage) {
      setThumbnailAlertMessage(validationMessage);
      return false;
    }
    setValue("thumbnail", file, { shouldDirty: true });
    return true;
  };

  const updateCurriculum = (next: StudyOpenValues["curriculum"]) =>
    setValue("curriculum", next, { shouldDirty: true });

  const addContent = (weekIndex: number) => {
    updateCurriculum(addCurriculumContent(curriculum, weekIndex));
  };

  const removeContent = (weekIndex: number, contentIndex: number) => {
    const next = removeCurriculumContent(curriculum, weekIndex, contentIndex);
    if (next) updateCurriculum(next);
  };

  const addWeek = () => {
    updateCurriculum(addCurriculumWeek(curriculum));
  };

  const removeWeek = (weekIndex: number) => {
    const next = removeCurriculumWeek(curriculum, weekIndex);
    if (next) updateCurriculum(next);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    if (!(await form.trigger())) {
      setMessage({ text: "필수 입력 항목을 확인해주세요.", type: "error" });
      return;
    }
    setIsSubmitting(true);
    setMessage(null);
    try {
      await submitStudyCreate(
        form.getValues(),
        application.study.id,
        dirtyFields,
        hasReferenceUpdates ? referenceUpdate : undefined,
      );
      form.reset(form.getValues());
      setMessage({
        text: "스터디 개설 신청서가 수정되었습니다.",
        type: "success",
      });
      router.refresh();
    } catch (error) {
      setMessage({ text: await handleApiError(error), type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestSubmit = async () => {
    if (!canSubmit) return;
    if (!(await form.trigger())) {
      setMessage({ text: "필수 입력 항목을 확인해주세요.", type: "error" });
      return;
    }
    setConfirmAction("modify");
  };

  const handleCancel = async () => {
    if (!application.can_cancel || isSubmitting || isCancelling) return;

    setIsCancelling(true);
    setMessage(null);
    try {
      await cancelStudyCreationApplication(application.study.id);
      router.replace("/my");
      router.refresh();
    } catch (error) {
      setMessage({ text: await handleApiError(error), type: "error" });
      setIsCancelling(false);
    }
  };

  return (
    <section className="border-border-gray-light mt-4 rounded-xl border p-6 sm:p-10">
      <form
        className="flex flex-col gap-12"
        onSubmit={(event) => {
          event.preventDefault();
          void requestSubmit();
        }}
      >
        <fieldset disabled={!application.can_modify} className="contents">
          <section className="flex flex-col gap-6">
            <div className="border-border-gray flex flex-col gap-3 rounded-xl border p-5">
              <div className="flex items-center justify-between gap-3">
                <StudySectionTitle>멘토 추가</StudySectionTitle>
                {secondaryMentorId !== null && (
                  <button
                    type="button"
                    className="text-text-subtle hover:text-text-danger text-sm"
                    onClick={handleSecondaryMentorRemove}
                  >
                    멘토 제거
                  </button>
                )}
              </div>
              <div className="relative">
                <TextInput
                  id="secondaryMentorId"
                  length="full"
                  placeholder="추가할 멘토의 학번을 입력해주세요"
                  value={mentorSearchValue}
                  onChange={(event) => {
                    updateMentorSearchValue(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void handleSecondaryMentorSearch();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => void handleSecondaryMentorSearch()}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  aria-label="멘토 검색"
                >
                  <SearchIcon />
                </button>
              </div>
              {secondaryMentor && (
                <p className="text-text-basic text-sm">
                  {secondaryMentor.name} · {secondaryMentor.department}
                </p>
              )}
              {mentorError && (
                <p className="text-text-danger text-sm">{mentorError}</p>
              )}
            </div>
            <input
              id="studyName"
              className="text-text-bolder placeholder:text-text-subtle w-full bg-transparent text-[28px] font-bold leading-[1.5] tracking-[1px] outline-none sm:text-[40px]"
              placeholder="스터디 이름을 입력해주세요"
              {...register("studyName")}
            />
            <input
              id="oneLiner"
              className={`placeholder:text-text-subtle-inverse w-full rounded-lg border-0 px-4 py-3 text-[15px] font-medium leading-[1.6] text-sky-900 outline-none focus:border-0 focus:ring-0 focus-visible:border-0 focus-visible:ring-0 md:text-[19px] ${oneLiner?.trim() && !isOneLinerEditing ? "bg-sky-100" : "bg-transparent"}`}
              placeholder="한 줄 소개를 입력해주세요"
              {...oneLinerField}
              onFocus={() => setIsOneLinerEditing(true)}
              onBlur={(event) => {
                oneLinerField.onBlur(event);
                setIsOneLinerEditing(false);
              }}
            />
            {(errors.studyName || errors.oneLiner) && (
              <p className="text-text-danger text-[14px]">
                {errors.studyName?.message ?? errors.oneLiner?.message}
              </p>
            )}

            <div className="flex flex-col gap-2">
              <StudySectionTitle required>태그</StudySectionTitle>
              <div className="flex flex-wrap items-center gap-2">
                {selectedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setValue(
                        "tags",
                        selectedTags.filter(
                          (selectedTag) => selectedTag !== tag,
                        ),
                        { shouldDirty: true, shouldValidate: true },
                      )
                    }
                    className="bg-surface-primary-subtler flex h-8 items-center justify-center rounded-[4px] px-2"
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
                  aria-label="태그 편집"
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
          </section>

          <section className="flex flex-col gap-6">
            <StudySectionTitle>썸네일</StudySectionTitle>
            <div className="flex flex-col gap-2">
              {application.study.thumbnail_image && !thumbnail && (
                <img
                  src={application.study.thumbnail_image}
                  alt={`${application.study.study_name} 썸네일`}
                  className="max-h-72 w-full rounded-lg border object-contain"
                />
              )}
              <FileUpload
                title="새 이미지 파일 선택 (jpg, jpeg, png)"
                description="권장 크기 1080px * 720px, 최대 5MB"
                accept="image/jpeg,image/png"
                multiple={false}
                maxFiles={1}
                files={thumbnail ? [thumbnail] : []}
                onUpload={handleThumbnailUpload}
                onRemove={() =>
                  setValue("thumbnail", null, { shouldDirty: true })
                }
              />
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <StudySectionTitle required>스터디 소개</StudySectionTitle>
            <div className="flex flex-col gap-1">
              <TextArea
                id="introduction"
                size="large"
                maxLength={3000}
                {...register("introduction")}
              />
              {errors.introduction && (
                <p className="text-text-danger text-[14px]">
                  {errors.introduction.message}
                </p>
              )}
            </div>
            <Controller
              control={control}
              name="isOnline"
              render={({ field: { value, onChange } }) => (
                <Checkbox
                  id="isOnline"
                  label="온라인으로 진행합니다."
                  checked={value}
                  onChange={(checked) => {
                    onChange(checked);
                    if (checked) {
                      setValue("location", "온라인", { shouldDirty: true });
                      setValue("room", "", { shouldDirty: true });
                    } else if (selectedLocation === "온라인") {
                      setValue("location", "", { shouldDirty: true });
                    }
                  }}
                />
              )}
            />
          </section>

          <section className="flex flex-col gap-6">
            <StudySectionTitle required>진행 장소 / 요일</StudySectionTitle>
            <div className="flex flex-wrap gap-2">
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
                    invalid={Boolean(errors.location)}
                  />
                )}
              />
              <TextInput
                id="room"
                placeholder="강의실(호)"
                disabled={isRoomDisabled}
                invalid={Boolean(errors.room)}
                {...register("room")}
              />
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
                    invalid={Boolean(errors.weekDay)}
                  />
                )}
              />
            </div>
            {(errors.location || errors.room || errors.weekDay) && (
              <p className="text-text-danger text-[14px]">
                {errors.location?.message ??
                  errors.room?.message ??
                  errors.weekDay?.message}
              </p>
            )}
          </section>

          <section className="flex flex-col gap-6">
            <StudySectionTitle required>진행 시간</StudySectionTitle>
            <div className="flex max-w-[480px] items-center gap-2">
              <TextInput
                id="startTime"
                length="full"
                placeholder="HH:MM"
                invalid={Boolean(errors.startTime)}
                {...registerTimeInput("startTime")}
              />
              <Minus className="text-text-subtle h-6 w-6 shrink-0" />
              <TextInput
                id="endTime"
                length="full"
                placeholder="HH:MM"
                invalid={Boolean(errors.endTime)}
                {...registerTimeInput("endTime")}
              />
            </div>
            {(errors.startTime || errors.endTime) && (
              <p className="text-text-danger text-[14px]">
                {errors.startTime?.message ?? errors.endTime?.message}
              </p>
            )}
          </section>

          <section className="flex flex-col gap-6">
            <StudySectionTitle required>커리큘럼</StudySectionTitle>
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
                  className={`${inputClassName} min-h-[24px] resize-none overflow-hidden whitespace-pre-wrap break-words [field-sizing:content]`}
                  {...register(`curriculum.${weekIndex}.topic`)}
                />
              )}
              renderContentInput={(weekIndex, contentIndex, inputClassName) => (
                <textarea
                  rows={1}
                  className={`${inputClassName} min-h-[24px] resize-none overflow-hidden whitespace-pre-wrap break-words [field-sizing:content]`}
                  {...register(
                    `curriculum.${weekIndex}.contents.${contentIndex}`,
                  )}
                />
              )}
              onAddContent={addContent}
              onRemoveContent={removeContent}
              onAddWeek={addWeek}
              onRemoveWeek={removeWeek}
            />
            {errors.curriculum && (
              <p className="text-text-danger text-[14px]">
                커리큘럼의 필수 항목을 확인해주세요.
              </p>
            )}
          </section>

          <section className="flex flex-col gap-6">
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
                  invalid={Boolean(errors.difficulty)}
                />
              )}
            />
            {errors.difficulty && (
              <p className="text-text-danger text-[14px]">
                {errors.difficulty.message}
              </p>
            )}
            <Controller
              control={control}
              name="hasInterview"
              render={({ field: { value, onChange } }) => (
                <Checkbox
                  id="hasInterview"
                  label="면접을 진행합니다"
                  checked={value}
                  onChange={onChange}
                />
              )}
            />
            {hasInterview && (
              <TextInput
                id="interviewDate"
                length="middle"
                placeholder="면접 날짜 (YYMMDD)"
                {...registerShortDateInput("interviewDate")}
              />
            )}
          </section>

          <section>
            <ReferenceFields form={form} />
          </section>
        </fieldset>

        {message && (
          <p
            className={
              message.type === "success"
                ? "text-text-success text-[14px]"
                : "text-text-danger text-[14px]"
            }
            role={message.type === "error" ? "alert" : "status"}
          >
            {message.text}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-4">
          <Button
            variant="tertiary"
            size="large"
            type="button"
            onClick={() => setConfirmAction("cancel")}
            disabled={!application.can_cancel || isSubmitting || isCancelling}
          >
            {isCancelling ? "취소 중..." : "신청 취소"}
          </Button>
          <div className="flex items-center gap-4">
            <Button
              variant="primary"
              size="large"
              type="submit"
              disabled={!canSubmit}
            >
              {isSubmitting ? "수정 중..." : "수정"}
            </Button>
            <Button
              variant="secondary"
              size="large"
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              disabled={!currentUserInfo || isSubmitting || isCancelling}
            >
              미리보기
            </Button>
          </div>
        </div>
      </form>

      <TagSelectModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onConfirm={handleTagsConfirm}
        selectedTags={selectedTags}
      />
      {currentUserInfo && (
        <StudyCreatePreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          form={form}
          userInfo={currentUserInfo}
          title="스터디 수정 미리보기"
        />
      )}
      <ActionConfirmModal
        isOpen={confirmAction !== null}
        target="스터디 개설 신청서"
        action={confirmAction === "modify" ? "수정" : "취소"}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (confirmAction === "modify") {
            void handleSubmit();
          } else {
            void handleCancel();
          }
        }}
      />
      <AlertModal
        isOpen={thumbnailAlertMessage !== null}
        description={thumbnailAlertMessage ?? ""}
        descriptionClassName="w-full text-center"
        onClose={() => setThumbnailAlertMessage(null)}
      />
    </section>
  );
}
