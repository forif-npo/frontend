"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, SelectBox, TextArea, TextInput } from "@ui/components/client";
import type {
  StaffApplicationSubmitRequest,
  StaffRecruitmentRound,
} from "@core/types/staff-recruitment";
import { submitStaffApplication } from "./api";
import { getStaffApplicationErrorInfo } from "./application-error";

type FieldErrors = Record<string, string>;

export function StaffApplicationForm({
  recruitment,
}: {
  recruitment: StaffRecruitmentRound;
}) {
  const router = useRouter();
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
  const [firstDepartment, setFirstDepartment] = useState<string | null>(null);
  const [secondDepartment, setSecondDepartment] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [duplicate, setDuplicate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departmentOptions = departments.map((department) => ({
    value: String(department.department_id),
    label: department.name,
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

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!firstDepartment) next.firstDepartment = "1지망 부서를 선택해주세요.";
    if (firstDepartment && firstDepartment === secondDepartment) {
      next.secondDepartment = "1지망과 다른 부서를 선택해주세요.";
    }
    questions.forEach((question) => {
      const answer = answers[question.question_id] ?? "";
      if (question.required && !answer.trim()) {
        next[`question-${question.question_id}`] = "필수 문항입니다.";
      } else if (answer.length > question.max_length) {
        next[`question-${question.question_id}`] =
          `${question.max_length}자 이내로 작성해주세요.`;
      }
    });
    return next;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      document.getElementById(Object.keys(nextErrors)[0]!)?.focus();
      return;
    }

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
      await submitStaffApplication(recruitment.recruitment_id, {
        department_choices: departmentChoices,
        answers: questions.map((question) => ({
          question_id: question.question_id,
          answer: answers[question.question_id]?.trim() ?? "",
        })),
      });
      router.push(
        `/club/recruit/${recruitment.recruitment_id}/application?submitted=1`,
      );
      router.refresh();
    } catch (error) {
      const info = await getStaffApplicationErrorInfo(error);
      setDuplicate(info.code === "FOR154-409");
      setSubmitError(info.message);
    } finally {
      setIsSubmitting(false);
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
            1지망은 필수이며, 서로 다른 부서를 최대 2개까지 선택할 수 있습니다.
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
          title="2지망 (선택)"
          value={secondDepartment}
          options={[
            { value: "none", label: "선택 안 함" },
            ...departmentOptions.filter(
              (option) => option.value !== firstDepartment,
            ),
          ]}
          placeholder="선택하지 않아도 됩니다"
          error={errors.secondDepartment}
          onChange={(value) => {
            setSecondDepartment(value === "none" ? null : value);
            setErrors((current) => ({ ...current, secondDepartment: "" }));
          }}
        />
      </section>

      <section className="space-y-6" aria-labelledby="answers-heading">
        <h2
          id="answers-heading"
          className="text-title-l-mobile sm:text-title-l font-bold"
        >
          지원서 문항
        </h2>
        {questions.map((question, index) => {
          const id = `question-${question.question_id}`;
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
            <TextInput key={question.question_id} {...common} length="full" />
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
      </section>

      <section className="bg-gray-5 rounded-3 p-5 text-sm leading-6">
        <h2 className="font-bold">제출 전 확인</h2>
        <p className="text-text-subtle mt-1">
          지원서는 회차당 한 번만 제출할 수 있고 제출 후 수정할 수 없습니다.
          지원 당시 개인정보와 답변은 운영 기록을 위해 데이터베이스에 영구
          보관됩니다.
        </p>
      </section>

      {submitError && (
        <div
          role="alert"
          className="border-text-danger text-text-danger rounded-3 border p-4 text-sm"
        >
          {submitError}
          {duplicate && (
            <button
              type="button"
              className="ml-2 underline"
              onClick={() =>
                router.push(
                  `/club/recruit/${recruitment.recruitment_id}/application`,
                )
              }
            >
              내 지원서 보기
            </button>
          )}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          size="large"
          disabled={
            isSubmitting || questions.length === 0 || departments.length === 0
          }
        >
          {isSubmitting ? "제출 중..." : "지원서 제출"}
        </Button>
      </div>
    </form>
  );
}
