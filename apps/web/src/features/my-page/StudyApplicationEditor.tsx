"use client";

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
import { HintText } from "@ui/components/server";
import { CirclePlus, Minus } from "@repo/assets/icons/lucide";
import { studyOpenSchema, type StudyOpenValues } from "@core/schemas";
import {
  cancelStudyCreationApplication,
  type StudyApplicationDetail,
} from "@core/study-application/api";
import { handleApiError } from "@core/utils/api-client";
import { getStudyTagLabel } from "@/constants/study-tags";
import { useDateInput } from "@/hooks/useDateInput";
import { useTimeInput } from "@/hooks/useTimeInput";
import { StudyCurriculumTable } from "@/features/study/components/StudyCurriculumTable";
import { StudySectionTitle } from "@/features/study/components/StudySectionTitle";
import {
  submitStudyCreate,
  type StudyApplicationReferenceUpdate,
} from "@/features/study/create/actions";
import {
  DEFAULT_CURRICULUM,
  DIFFICULTY_OPTIONS,
  LOCATION_OPTIONS,
  WEEKDAY_OPTIONS,
} from "@/features/study/create/constants";
import { TagSelectModal } from "@/features/study/create/components/TagSelectModal";
import { ReferenceFields } from "@/features/study/create/components/ReferenceFields";

interface StudyApplicationEditorProps {
  application: StudyApplicationDetail;
}

function toShortDate(value: string | null | undefined) {
  if (!value) return "";

  const isoDate = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoDate) return `${isoDate[1].slice(2)}${isoDate[2]}${isoDate[3]}`;

  const digits = value.replace(/\D/g, "");
  if (digits.length === 8) return digits.slice(2);
  return digits.slice(0, 6);
}

function toFormValues(application: StudyApplicationDetail): StudyOpenValues {
  const { study } = application;
  const curriculum = study.plans
    .slice()
    .sort((first, second) => first.week_num - second.week_num)
    .map((plan, index) => ({
      week: plan.week_num || index + 1,
      date: toShortDate(plan.date),
      topic: plan.section ?? "",
      contents: plan.content ? plan.content.split("; ") : [""],
    }));

  return {
    mentorIds:
      study.mentors
        ?.filter((mentor) => mentor.mentor_num !== 1)
        .map((mentor) => mentor.mentor_id) ?? [],
    studyName: study.study_name,
    oneLiner: study.one_liner ?? "",
    tags: study.tags.map(getStudyTagLabel),
    thumbnail: null,
    introduction: study.explanation ?? study.goal ?? "",
    isOnline: Boolean(study.is_online),
    location: study.location ?? "",
    room: study.location_detail ?? "",
    weekDay: study.week_day === null ? "" : String(study.week_day),
    startTime: study.start_time ?? "",
    endTime: study.end_time ?? "",
    curriculum:
      curriculum.length >= 8
        ? curriculum
        : DEFAULT_CURRICULUM.map((week) => ({ ...week, contents: [""] })),
    difficulty: study.difficulty ?? "",
    hasInterview: Boolean(study.requires_interview),
    interviewDate: toShortDate(study.interview_date) || null,
    references: study.references.map((reference) => ({
      id: reference.id,
      type: reference.reference_type === "FILE" ? "DOWNLOAD" : "LINK",
      value: reference.content ?? "",
    })),
  };
}

function buildReferenceUpdate(
  references: StudyOpenValues["references"],
  originalReferences: StudyApplicationDetail["study"]["references"],
): StudyApplicationReferenceUpdate {
  const originalById = new Map(
    originalReferences
      .filter((reference): reference is typeof reference & { id: string } =>
        Boolean(reference.id),
      )
      .map((reference) => [reference.id, reference]),
  );
  const retainedReferenceIds: string[] = [];
  const updatedReferences: StudyOpenValues["references"] = [];

  references.forEach((reference) => {
    const original = reference.id ? originalById.get(reference.id) : undefined;
    const isUnchangedUrl =
      original?.reference_type === "URL" &&
      reference.type === "LINK" &&
      reference.value === original.content;
    const isUnchangedFile =
      original?.reference_type === "FILE" &&
      reference.type === "DOWNLOAD" &&
      typeof reference.value === "string" &&
      reference.value === original.content;

    if (original && (isUnchangedUrl || isUnchangedFile)) {
      retainedReferenceIds.push(original.id);
    } else {
      updatedReferences.push(reference);
    }
  });

  return {
    retainedReferenceIds,
    references: updatedReferences,
    hasChanges:
      updatedReferences.length > 0 ||
      retainedReferenceIds.length !== originalById.size,
  };
}

export function StudyApplicationEditor({
  application,
}: StudyApplicationEditorProps) {
  const router = useRouter();
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isOneLinerEditing, setIsOneLinerEditing] = useState(false);
  const [thumbnailAlertMessage, setThumbnailAlertMessage] = useState<
    string | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
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
  const referenceUpdate = buildReferenceUpdate(
    newReferences,
    application.study.references,
  );
  const hasReferenceUpdates =
    Boolean(dirtyFields.references) && referenceUpdate.hasChanges;
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
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setThumbnailAlertMessage(
        "jpg, jpeg, png 형식의 이미지만 업로드할 수 있습니다.",
      );
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setThumbnailAlertMessage(
        "이미지 파일은 최대 5MB까지 업로드할 수 있습니다.",
      );
      return false;
    }
    setValue("thumbnail", file, { shouldDirty: true });
    return true;
  };

  const updateCurriculum = (next: StudyOpenValues["curriculum"]) =>
    setValue("curriculum", next, { shouldDirty: true });

  const addContent = (weekIndex: number) => {
    const next = [...curriculum];
    next[weekIndex] = {
      ...next[weekIndex],
      contents: [...next[weekIndex].contents, ""],
    };
    updateCurriculum(next);
  };

  const removeContent = (weekIndex: number, contentIndex: number) => {
    const targetWeek = curriculum[weekIndex];
    if (!targetWeek || targetWeek.contents.length <= 1) return;
    const next = [...curriculum];
    next[weekIndex] = {
      ...targetWeek,
      contents: targetWeek.contents.filter(
        (_, index) => index !== contentIndex,
      ),
    };
    updateCurriculum(next);
  };

  const addWeek = () => {
    const lastWeek = curriculum.at(-1)?.week ?? curriculum.length;
    updateCurriculum([
      ...curriculum,
      { week: lastWeek + 1, date: "", topic: "", contents: [""] },
    ]);
  };

  const removeWeek = (weekIndex: number) => {
    if (weekIndex < 8 || curriculum.length <= 8) return;
    updateCurriculum(
      curriculum
        .filter((_, index) => index !== weekIndex)
        .map((week, index) => ({ ...week, week: index + 1 })),
    );
  };

  const handleSubmit = async () => {
    if ((!isDirty && !hasReferenceUpdates) || isSubmitting || isCancelling) {
      return;
    }
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

  const handleCancel = async () => {
    if (isSubmitting || isCancelling) return;

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
    <section className="border-border-gray-light mt-8 rounded-xl border p-6 sm:p-10">
      <form
        className="flex flex-col gap-12"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
      >
        <section className="flex flex-col gap-6">
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
                      selectedTags.filter((selectedTag) => selectedTag !== tag),
                      { shouldDirty: true, shouldValidate: true },
                    )
                  }
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
            <HintText>새 이미지를 선택하면 기존 썸네일을 교체합니다.</HintText>
            <FileUpload
              title="이미지 파일 업로드 (jpg, jpeg, png)"
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
            <HintText>
              스터디 목표와 방식, 지원 요건 등을 50자 이상 작성해주세요.
            </HintText>
            <TextArea
              id="introduction"
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
          <HintText>스터디는 최소 8주차 이상 진행되어야 합니다.</HintText>
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

        <ReferenceFields form={form} />

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
            onClick={() => setIsCancelConfirmOpen(true)}
            disabled={isSubmitting || isCancelling}
          >
            {isCancelling ? "취소 중..." : "신청 취소"}
          </Button>
          <Button
            variant="primary"
            size="large"
            type="submit"
            disabled={
              (!isDirty && !hasReferenceUpdates) || isSubmitting || isCancelling
            }
          >
            {isSubmitting ? "수정 중..." : "수정"}
          </Button>
        </div>
      </form>

      <TagSelectModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onConfirm={handleTagsConfirm}
        selectedTags={selectedTags}
      />
      <AlertModal
        isOpen={isCancelConfirmOpen}
        description="스터디 개설 신청을 취소하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        onClose={() => setIsCancelConfirmOpen(false)}
        onConfirm={() => void handleCancel()}
      />
      <AlertModal
        isOpen={thumbnailAlertMessage !== null}
        description={thumbnailAlertMessage ?? ""}
        onClose={() => setThumbnailAlertMessage(null)}
      />
    </section>
  );
}
