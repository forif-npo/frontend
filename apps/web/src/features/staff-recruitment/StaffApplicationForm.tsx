"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox, FileUpload, SelectBox, TextArea, TextInput } from "@ui/components/client";
import { Label } from "@ui/components/server";
import { formatStaffRecruitmentDepartment } from "@core/staff-recruitment";
import type { StaffApplicationDetail, StaffApplicationSubmitRequest, StaffApplicationSubmitResponse, StaffInterviewPlan, StaffRecruitmentRound } from "@core/types/staff-recruitment";
import { downloadPrivateFile } from "@core/utils/private-file-download";
import { toInterviewSlotKeys, toInterviewSlotRequest } from "@core/staff-interview";
import { InterviewAvailabilityGrid } from "./InterviewAvailabilityGrid";
import { ActionConfirmModal } from "@/components/ActionConfirmModal";
import { cancelStaffApplication, submitStaffApplication, updateStaffApplication } from "./api";
import { getStaffApplicationErrorInfo } from "./application-error";
import { DuplicateStaffApplicationModal } from "./DuplicateStaffApplicationModal";

type FieldErrors = Record<string, string>;

function attachmentFileError(file: File): string | null {
  if (file.size === 0) return "빈 파일은 첨부할 수 없습니다.";
  if (file.size > 5 * 1024 * 1024 || file.name.length > 200) {
    return "5MB 이하, 파일명 200자 이하의 파일을 선택해주세요.";
  }
  if (!file.name.trim() || file.name.split("").some((character) =>
    character.charCodeAt(0) < 32 || '<>:"|?*/\\'.includes(character))) {
    return "파일명에 사용할 수 없는 문자가 포함되어 있습니다.";
  }
  return null;
}

export function StaffApplicationForm({
  recruitment,
  interviewPlan,
  onSubmitted,
  initialApplication,
  onUpdated,
  onCancelled,
}: {
  recruitment: StaffRecruitmentRound;
  interviewPlan: StaffInterviewPlan | null;
  onSubmitted?: (
    result: StaffApplicationSubmitResponse,
    departments: { first: string; second: string | null },
  ) => void;
  initialApplication?: StaffApplicationDetail;
  onUpdated?: (detail: StaffApplicationDetail) => void;
  onCancelled?: () => void;
}) {
  const router = useRouter();
  const isEditMode = Boolean(initialApplication);
  const departments = useMemo(
    () =>
      recruitment.departments
        .filter((department) => department.active)
        .sort((a, b) => a.display_order - b.display_order),
    [recruitment.departments],
  );
  const questions = useMemo(
    () =>
      [...recruitment.questions].sort(
        (a, b) => a.display_order - b.display_order,
      ),
    [recruitment.questions],
  );
  const initialFirstDepartment = initialApplication?.applied_departments.find(
    (choice) => choice.priority === 1,
  );
  const initialSecondDepartment = initialApplication?.applied_departments.find(
    (choice) => choice.priority === 2,
  );
  const initialAnswers = Object.fromEntries(
    (initialApplication?.answers ?? [])
      .filter((answer) => answer.question_type !== "FILE")
      .map((answer) => [answer.question_id, answer.answer ?? ""]),
  ) as Record<number, string>;
  const [firstDepartment, setFirstDepartment] = useState<string | null>(
    initialFirstDepartment
      ? String(initialFirstDepartment.department_id)
      : null,
  );
  const [secondDepartment, setSecondDepartment] = useState<string | null>(
    initialSecondDepartment
      ? String(initialSecondDepartment.department_id)
      : null,
  );
  const [answers, setAnswers] =
    useState<Record<number, string>>(initialAnswers);
  const [files, setFiles] = useState<Record<number, File | null>>({});
  const [attachmentModes, setAttachmentModes] = useState<
    Record<number, "LINK" | "FILE">
  >(() =>
    Object.fromEntries(
      questions
        .filter((question) => question.type === "ATTACHMENT")
        .map((question) => [
          question.question_id,
          initialApplication?.answers.find(
            (answer) => answer.question_id === question.question_id,
          )?.question_type === "FILE"
            ? "FILE"
            : "LINK",
        ]),
    ),
  );
  const [interviewSlots, setInterviewSlots] = useState<Set<string>>(() =>
    toInterviewSlotKeys(initialApplication?.interview_slots ?? []),
  );
  const [removedFileQuestionIds, setRemovedFileQuestionIds] = useState<
    Set<number>
  >(new Set());
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [duplicate, setDuplicate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "modify" | "cancel" | null
  >(null);
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  const hasChanges =
    Boolean(initialApplication) &&
    (firstDepartment !==
      (initialFirstDepartment
        ? String(initialFirstDepartment.department_id)
        : null) ||
      secondDepartment !==
        (initialSecondDepartment
          ? String(initialSecondDepartment.department_id)
          : null) ||
      questions.some(
        (question) =>
          question.type !== "FILE" &&
          (question.type !== "ATTACHMENT" ||
            attachmentModes[question.question_id] === "LINK") &&
          (answers[question.question_id] ?? "") !==
            (initialAnswers[question.question_id] ?? ""),
      ) ||
      questions.some(
        (question) =>
          question.type === "ATTACHMENT" &&
          attachmentModes[question.question_id] !==
            (initialApplication?.answers.find(
              (answer) => answer.question_id === question.question_id,
            )?.question_type === "FILE"
              ? "FILE"
              : "LINK"),
      ) ||
      Object.values(files).some(Boolean) ||
      removedFileQuestionIds.size > 0);

  const departmentOptions = departments.map((department) => ({
    value: String(department.department_id),
    label: formatStaffRecruitmentDepartment(department.name),
  }));

  const updateAnswer = (questionId: number, answer: string) => {
    setAnswers((current) => ({ ...current, [questionId]: answer }));
    setErrors((current) => {
      const next = { ...current };
      delete next[`question-${questionId}`];
      return next;
    });
    setSubmitError(null);
  };

  const changeAttachmentMode = (questionId: number, mode: "LINK" | "FILE") => {
    setAttachmentModes((current) => ({ ...current, [questionId]: mode }));
    setAnswers((current) => ({ ...current, [questionId]: "" }));
    setFiles((current) => ({ ...current, [questionId]: null }));
    setRemovedFileQuestionIds((current) => {
      const next = new Set(current);
      const hadExistingFile = initialApplication?.answers.some(
        (answer) =>
          answer.question_id === questionId &&
          answer.question_type === "FILE" &&
          Boolean(answer.answer),
      );
      if (mode === "LINK" && hadExistingFile) next.add(questionId);
      else next.delete(questionId);
      return next;
    });
    setErrors((current) => ({ ...current, [`question-${questionId}`]: "" }));
    setSubmitError(null);
  };

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!firstDepartment) next.firstDepartment = "1지망 부서를 선택해주세요.";
    if (firstDepartment && firstDepartment === secondDepartment) {
      next.secondDepartment = "1지망과 다른 부서를 선택해주세요.";
    }
    questions.forEach((question) => {
      const answer = answers[question.question_id] ?? "";
      if (
        question.type === "FILE" ||
        (question.type === "ATTACHMENT" &&
          attachmentModes[question.question_id] === "FILE")
      ) {
        const file = files[question.question_id];
        const retainedFile = initialApplication?.answers.some(
          (item) =>
            item.question_id === question.question_id &&
            item.question_type === "FILE" &&
            Boolean(item.answer) &&
            !removedFileQuestionIds.has(question.question_id),
        );
        if (question.required && !file && !retainedFile) {
          next[`question-${question.question_id}`] = "필수 파일입니다.";
        } else if (file) {
          const fileError = attachmentFileError(file);
          if (fileError) next[`question-${question.question_id}`] = fileError;
        }
        return;
      }
      if (question.required && !answer.trim()) {
        next[`question-${question.question_id}`] = "필수 문항입니다.";
      } else if (answer.length > question.max_length) {
        next[`question-${question.question_id}`] =
          `${question.max_length}자 이내로 작성해주세요.`;
      } else if (
        (question.type === "LINK" || question.type === "ATTACHMENT") &&
        answer.trim()
      ) {
        try {
          const url = new URL(answer.trim());
          if (!["http:", "https:"].includes(url.protocol)) throw new Error();
        } catch {
          next[`question-${question.question_id}`] =
            "http 또는 https 링크를 입력해주세요.";
        }
      }
    });
    if (interviewPlan?.required && interviewSlots.size === 0) {
      next.interviewSlots = "면접 가능 시간을 한 칸 이상 선택해주세요.";
    }
    return next;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      isSubmitting ||
      isCancelling ||
      (isEditMode && !initialApplication?.can_modify) ||
      (!isEditMode && !isAcknowledged)
    )
      return;
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      document.getElementById(Object.keys(nextErrors)[0]!)?.focus();
      return;
    }

    if (isEditMode) {
      setConfirmAction("modify");
    } else {
      void saveApplication();
    }
  };

  const saveApplication = async () => {
    const departmentChoices: StaffApplicationSubmitRequest["department_choices"] =
      [{ department_id: Number(firstDepartment), priority: 1 }];
    if (secondDepartment) {
      departmentChoices.push({
        department_id: Number(secondDepartment),
        priority: 2,
      });
    }

    setErrors({});
    setSubmitError(null);
    setDuplicate(false);
    setIsSubmitting(true);
    try {
      const body = {
        department_choices: departmentChoices,
        answers: questions.map((question) => ({
          question_id: question.question_id,
          answer:
            question.type === "FILE" ||
            (question.type === "ATTACHMENT" &&
              attachmentModes[question.question_id] === "FILE")
              ? ""
              : (answers[question.question_id]?.trim() ?? ""),
        })),
        interview_slots: interviewPlan
          ? toInterviewSlotRequest(interviewSlots)
          : [],
      };
      if (initialApplication) {
        const updated = await updateStaffApplication(
          recruitment.recruitment_id,
          {
            ...body,
            removed_file_question_ids: Array.from(removedFileQuestionIds),
          },
          files,
        );
        onUpdated?.(updated);
      } else {
        const result = await submitStaffApplication(
          recruitment.recruitment_id,
          body,
          files,
        );
        onSubmitted?.(result, {
          first:
            departments.find(
              (item) => String(item.department_id) === firstDepartment,
            )?.name ?? "-",
          second:
            departments.find(
              (item) => String(item.department_id) === secondDepartment,
            )?.name ?? null,
        });
      }
    } catch (error) {
      const info = await getStaffApplicationErrorInfo(error);
      if (info.code === "FOR154-409") {
        setDuplicate(true);
      } else {
        setSubmitError(info.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelApplication = async () => {
    if (!initialApplication || isCancelling) return;
    setIsCancelling(true);
    setSubmitError(null);
    try {
      await cancelStaffApplication(recruitment.recruitment_id);
      onCancelled?.();
    } catch (error) {
      setSubmitError((await getStaffApplicationErrorInfo(error)).message);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <form className="mx-auto max-w-[792px] space-y-10" onSubmit={handleSubmit}>
      <section className="space-y-5" aria-labelledby="department-heading">
        <div>
          <h2
            id="department-heading"
            className="text-title-l-mobile sm:text-title-l font-bold"
          >
            지원 부서
          </h2>
          <p className="text-text-subtle mt-2 text-sm">
            최소 1개 이상의 부서를 선택해주세요.
          </p>
        </div>
        <SelectBox
          id="firstDepartment"
          title="1지망"
          required
          value={firstDepartment}
          options={departmentOptions}
          placeholder="부서를 선택해주세요"
          error={errors.firstDepartment}
          onChange={(value) => {
            setFirstDepartment(value);
            setSecondDepartment((current) =>
              current === value ? null : current,
            );
            setErrors((current) => ({ ...current, firstDepartment: "" }));
          }}
        />
        <SelectBox
          id="secondDepartment"
          title="2지망"
          value={secondDepartment}
          options={[
            { value: "none", label: "선택 안 함" },
            ...departmentOptions.filter(
              (option) => option.value !== firstDepartment,
            ),
          ]}
          placeholder="부서를 선택해주세요"
          error={errors.secondDepartment}
          onChange={(value) => {
            setSecondDepartment(value === "none" ? null : value);
            setErrors((current) => ({ ...current, secondDepartment: "" }));
          }}
        />
      </section>

      <section className="space-y-6 whitespace-pre-wrap break-words" aria-labelledby="answers-heading">
        <h2
          id="answers-heading"
          className="text-title-l-mobile sm:text-title-l font-bold"
        >
          지원서 문항
        </h2>
        {questions.map((question, index) => {
          const id = `question-${question.question_id}`;
          if (question.type === "FILE" || question.type === "ATTACHMENT") {
            const mode =
              question.type === "FILE"
                ? "FILE"
                : (attachmentModes[question.question_id] ?? "LINK");
            const selectedFile = files[question.question_id];
            const existingFile = initialApplication?.answers.find(
              (answer) =>
                answer.question_id === question.question_id &&
                answer.question_type === "FILE",
            )?.answer;
            return (
              <div
                key={question.question_id}
                id={id}
                tabIndex={-1}
                className={
                  question.type === "ATTACHMENT"
                    ? "grid grid-cols-[128px_minmax(0,1fr)] gap-x-3 gap-y-1 [&>div]:min-w-0 [&>label]:col-span-2"
                    : "flex flex-col gap-1"
                }
              >
                <Label id={`${id}-label`}>
                  {index + 1}. {question.label}
                  {question.required && (
                    <span
                      className="text-text-danger ml-0.5"
                      aria-hidden="true"
                    >
                      *
                    </span>
                  )}
                </Label>
                {question.description && (
                  <Label size="s" className="text-text-subtle">
                    {question.description}
                  </Label>
                )}
                {question.type === "ATTACHMENT" && (
                  <SelectBox
                    id={`${id}-type`}
                    title="첨부 방식"
                    titleClassName="sr-only"
                    value={mode}
                    placeholder="유형"
                    options={[
                      { value: "LINK", label: "링크" },
                      { value: "FILE", label: "파일" },
                    ]}
                    onChange={(next) =>
                      changeAttachmentMode(
                        question.question_id,
                        next as "LINK" | "FILE",
                      )
                    }
                    size="md"
                  />
                )}
                {mode === "FILE" ? (
                  <>
                    {existingFile &&
                      !selectedFile &&
                      !removedFileQuestionIds.has(question.question_id) && (
                        <div
                          className={`border-border-gray-light flex items-center justify-between gap-3 rounded-lg border px-4 py-3 ${question.type === "ATTACHMENT" ? "col-start-2" : ""}`}
                        >
                          <button
                            type="button"
                            className="text-text-primary min-w-0 truncate underline underline-offset-2"
                            onClick={() =>
                              void downloadPrivateFile(
                                `api/v1/staff-recruitments/${recruitment.recruitment_id}/applications/me/files/${question.question_id}`,
                                existingFile,
                              ).catch(() =>
                                setSubmitError("파일을 내려받지 못했습니다."),
                              )
                            }
                          >
                            {existingFile}
                          </button>
                          <button
                            type="button"
                            className="text-text-subtle shrink-0 underline underline-offset-2"
                            onClick={() =>
                              setRemovedFileQuestionIds((current) =>
                                new Set(current).add(question.question_id),
                              )
                            }
                          >
                            파일 제거
                          </button>
                        </div>
                      )}
                    <FileUpload
                      ariaLabelledBy={`${id}-label`}
                      ariaDescribedBy={errors[id] ? `${id}-error` : undefined}
                      invalid={Boolean(errors[id])}
                      required={question.required}
                      description="파일 1개, 최대 5MB"
                      multiple={false}
                      maxFiles={1}
                      files={selectedFile ? [selectedFile] : []}
                      onUpload={async (file) => {
                        const fileError = attachmentFileError(file);
                        if (fileError) {
                          setErrors((current) => ({
                            ...current,
                            [id]: fileError,
                          }));
                          return false;
                        }
                        setFiles((current) => ({
                          ...current,
                          [question.question_id]: file,
                        }));
                        setRemovedFileQuestionIds((current) => {
                          const next = new Set(current);
                          next.delete(question.question_id);
                          return next;
                        });
                        setErrors((current) => ({ ...current, [id]: "" }));
                        setSubmitError(null);
                        return true;
                      }}
                      onRemove={() =>
                        setFiles((current) => ({
                          ...current,
                          [question.question_id]: null,
                        }))
                      }
                      className={
                        question.type === "ATTACHMENT"
                          ? "col-start-2 p-3"
                          : undefined
                      }
                    />
                  </>
                ) : (
                  <TextInput
                    id={`${id}-link`}
                    aria-label="링크"
                    length="full"
                    inputMode="url"
                    placeholder="웹사이트 링크를 입력해주세요"
                    maxLength={question.max_length}
                    value={answers[question.question_id] ?? ""}
                    onChange={(event) =>
                      updateAnswer(question.question_id, event.target.value)
                    }
                  />
                )}
                {errors[id] && (
                  <Label
                    id={`${id}-error`}
                    size="s"
                    className="text-text-danger mt-1"
                  >
                    {errors[id]}
                  </Label>
                )}
              </div>
            );
          }
          const common = {
            id,
            title: `${index + 1}. ${question.label}`,
            description: question.description ?? undefined,
            required: question.required,
            maxLength: question.max_length,
            value: answers[question.question_id] ?? "",
            error: errors[id],
            onChange: (
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => updateAnswer(question.question_id, event.target.value),
          };
          return question.type === "LONG_TEXT" ? (
            <TextArea key={question.question_id} {...common} size="large" />
          ) : (
            <TextInput
              key={question.question_id}
              {...common}
              length="full"
              {...(question.type === "LINK"
                ? {
                    inputMode: "url" as const,
                    placeholder: "웹사이트 링크를 입력해주세요",
                  }
                : {})}
            />
          );
        })}
        {questions.length === 0 && (
          <p
            role="alert"
            className="text-text-danger rounded-3 border p-4 text-sm"
          >
            등록된 지원 문항이 없어 현재 제출할 수 없습니다.
          </p>
        )}

        {interviewPlan && (
          <div id="interviewSlots" className="flex flex-col gap-3">
            <Label size="m" className="text-text-basic font-bold">
              {`${questions.length + 1}. ${
                interviewPlan.guide ?? "면접 가능 시간을 표시해주세요."
              }`}
              {interviewPlan.required && (
                <span className="text-text-danger ml-1" aria-hidden="true">
                  *
                </span>
              )}
            </Label>
            <InterviewAvailabilityGrid
              plan={interviewPlan}
              value={interviewSlots}
              onChange={(next) => {
                setInterviewSlots(next);
                setErrors((current) => {
                  const updated = { ...current };
                  delete updated.interviewSlots;
                  return updated;
                });
                setSubmitError(null);
              }}
              disabled={isSubmitting || isCancelling}
              error={errors.interviewSlots}
            />
          </div>
        )}
      </section>

      {!isEditMode && (
        <section className="bg-gray-5 rounded-3 p-5 text-sm leading-6">
          <h2 className="text-text-basic text-[19px] font-bold leading-[1.5]">
            제출 전 확인
          </h2>
          <div className="mt-3">
            <Checkbox
              id="submissionAcknowledged"
              label="작성하신 개인정보와 답변은 운영 기록을 위해 FORIF DB에 보관됨을 확인하였습니다."
              checked={isAcknowledged}
              onChange={setIsAcknowledged}
            />
          </div>
        </section>
      )}

      {submitError && (
        <div
          role="alert"
          className="border-text-danger text-text-danger rounded-3 border p-4 text-sm"
        >
          {submitError}
        </div>
      )}

      <div
        className={
          isEditMode
            ? "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            : "flex justify-end"
        }
      >
        {isEditMode && (
          <Button
            variant="tertiary"
            type="button"
            size="large"
            disabled={isSubmitting || isCancelling}
            onClick={() => setConfirmAction("cancel")}
          >
            {isCancelling ? "취소 중..." : "지원 취소"}
          </Button>
        )}
        <Button
          type="submit"
          size="large"
          disabled={
            isSubmitting ||
            isCancelling ||
            (isEditMode
              ? !initialApplication?.can_modify || !hasChanges
              : !isAcknowledged) ||
            questions.length === 0 ||
            departments.length === 0
          }
        >
          {isSubmitting
            ? isEditMode
              ? "수정 중..."
              : "제출 중..."
            : isEditMode
              ? "수정"
              : "지원서 제출"}
        </Button>
      </div>
      {isEditMode && (
        <ActionConfirmModal
          isOpen={confirmAction !== null}
          target={confirmAction === "cancel" ? "운영진 지원" : "운영진 지원서"}
          action={confirmAction === "modify" ? "수정" : "취소"}
          cancelLabel={confirmAction === "cancel" ? "돌아가기" : undefined}
          confirmLabel={confirmAction === "cancel" ? "지원 취소" : undefined}
          onClose={() => setConfirmAction(null)}
          onConfirm={() => {
            const action = confirmAction;
            setConfirmAction(null);
            if (action === "modify") void saveApplication();
            if (action === "cancel") void cancelApplication();
          }}
        />
      )}
      <DuplicateStaffApplicationModal
        isOpen={duplicate}
        onClose={() =>
          router.push(
            `/my?section=staff-applications&recruitment_id=${recruitment.recruitment_id}`,
          )
        }
      />
    </form>
  );
}
