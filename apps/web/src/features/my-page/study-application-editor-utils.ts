import type { StudyOpenValues } from "@core/schemas";
import { getStudyTagLabel } from "@/constants/study-tags";
import type { StudyApplicationDetail } from "@/features/study-application/api";
import { DEFAULT_CURRICULUM } from "@/features/study/create/constants";
import type { StudyApplicationReferenceUpdate } from "@/features/study/create/actions";

interface StudyApplicationUpdateState {
  canModify: boolean;
  hasReferenceUpdates: boolean;
  isCancelling: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}

export function canUpdateStudyApplication({
  canModify,
  hasReferenceUpdates,
  isCancelling,
  isDirty,
  isSubmitting,
}: StudyApplicationUpdateState) {
  return (
    canModify &&
    (isDirty || hasReferenceUpdates) &&
    !isSubmitting &&
    !isCancelling
  );
}

export function toShortDate(value: string | null | undefined) {
  if (!value) return "";

  const isoDate = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoDate) return `${isoDate[1].slice(2)}${isoDate[2]}${isoDate[3]}`;

  const digits = value.replace(/\D/g, "");
  if (digits.length === 8) return digits.slice(2);
  return digits.slice(0, 6);
}

export function toFormValues(
  application: StudyApplicationDetail,
): StudyOpenValues {
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
      fileName: reference.file_name ?? null,
    })),
  };
}

export function buildReferenceUpdate(
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
