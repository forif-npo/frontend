"use client";
import { useEffect, useState } from "react";
import type { StaffApplicationDetail } from "@core/types/staff-recruitment";
import { formatStaffRecruitmentDepartment } from "@core/staff-recruitment";
import { formatSlotDate, formatSlotTime } from "@core/time-slot";
import { formatPhoneNumber } from "@core/utils/phone-number";
import { downloadPrivateFile } from "@core/utils/private-file-download";
import { Button } from "@ui/components/client";
import { InlineErrorState, InlineLoadingState, Link, PageState } from "@ui/components/server";
import { getMyStaffApplication, getStaffInterviewPlan, getStaffRecruitment } from "./api";
import { getStaffApplicationErrorInfo } from "./application-error";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatInterviewDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  const label = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
  return `${label}(${formatSlotDate(value).weekday})`;
}

function formatInterviewTimes(minutes: number[], slotMinutes: number | null) {
  if (!slotMinutes) return minutes.map(formatSlotTime).join(", ");

  const ranges: string[] = [];
  let start = minutes[0];
  let last = start;
  for (const minute of minutes.slice(1)) {
    if (minute === last + slotMinutes) {
      last = minute;
      continue;
    }
    ranges.push(
      start === last
        ? formatSlotTime(start)
        : `${formatSlotTime(start)} ~ ${formatSlotTime(last + slotMinutes)}`,
    );
    start = minute;
    last = minute;
  }
  ranges.push(
    start === last
      ? formatSlotTime(start)
      : `${formatSlotTime(start)} ~ ${formatSlotTime(last + slotMinutes)}`,
  );
  return ranges.join(", ");
}

export function MyStaffApplicationView({
  recruitmentId,
  submitted,
  embedded = false,
}: {
  recruitmentId: number;
  submitted: boolean;
  embedded?: boolean;
}) {
  const [application, setApplication] = useState<StaffApplicationDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [interviewSlotMinutes, setInterviewSlotMinutes] = useState<
    number | null
  >(null);
  const [requiredQuestionIds, setRequiredQuestionIds] = useState<Set<number>>(
    new Set(),
  );
  const [error, setError] = useState<{
    code: string | null;
    message: string;
  } | null>(null);

  useEffect(() => {
    let active = true;
    getMyStaffApplication(recruitmentId)
      .then(async (data) => {
        let slotMinutes: number | null = null;
        if (data.interview_slots.length > 0) {
          try {
            slotMinutes =
              (await getStaffInterviewPlan(recruitmentId))?.slot_minutes ??
              null;
          } catch {
            // 설정을 조회할 수 없어도 저장된 가능 시각은 보여 준다.
          }
        }
        if (active) {
          setInterviewSlotMinutes(slotMinutes);
          setApplication(data);
        }
      })
      .catch(async (reason) => {
        const info = await getStaffApplicationErrorInfo(reason);
        if (active) setError(info);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [recruitmentId]);

  useEffect(() => {
    let active = true;
    getStaffRecruitment(recruitmentId)
      .then((recruitment) => {
        if (active) {
          setApplicationOpen(recruitment.application_open);
          setRequiredQuestionIds(
            new Set(
              recruitment.questions
                .filter((question) => question.required)
                .map((question) => question.question_id),
            ),
          );
        }
      })
      .catch(() => {
        if (active) {
          setApplicationOpen(false);
          setRequiredQuestionIds(new Set());
        }
      });
    return () => {
      active = false;
    };
  }, [recruitmentId]);

  if (loading) {
    if (embedded) {
      return (
        <InlineLoadingState
          message="지원서를 불러오는 중입니다."
          textClassName="text-base"
        />
      );
    }
    return (
      <PageState
        title="지원서를 불러오는 중입니다"
        description="잠시만 기다려주세요."
      />
    );
  }

  if (!application) {
    const missing = error?.code === "FOR155-404";
    if (embedded) {
      return (
        <InlineErrorState
          message={
            missing
              ? "제출한 지원서를 찾을 수 없습니다."
              : (error?.message ?? "지원서를 불러오지 못했습니다.")
          }
          className="py-10"
        />
      );
    }
    return (
      <PageState
        eyebrow="내 운영진 지원서"
        title={
          missing ? "제출한 지원서가 없습니다" : "지원서를 불러오지 못했습니다"
        }
        description={error?.message ?? "잠시 후 다시 시도해주세요."}
        actions={
          <Link href={`/club/recruit/${recruitmentId}/apply`}>
            <Button variant="primary">지원서 작성으로 이동</Button>
          </Link>
        }
      />
    );
  }

  const interviewSlotsByDate = new Map<string, number[]>();
  [...application.interview_slots]
    .sort(
      (first, second) =>
        first.date.localeCompare(second.date) ||
        first.start_minute - second.start_minute,
    )
    .forEach(({ date, start_minute }) => {
      const minutes = interviewSlotsByDate.get(date) ?? [];
      minutes.push(start_minute);
      interviewSlotsByDate.set(date, minutes);
    });

  const Container = embedded ? "div" : "main";
  return (
    <Container
      className={
        embedded ? "w-full" : "max-w-main mx-auto w-full px-4 py-10 lg:px-0"
      }
    >
      {submitted && (
        <div
          role="status"
          className="bg-primary-5 text-primary-60 rounded-3 mb-8 p-4 font-semibold"
        >
          지원서가 정상적으로 제출되었습니다.
        </div>
      )}
      {!embedded && (
        <div className="flex flex-col gap-2 border-b pb-6">
          <span className="text-primary-60 text-sm font-bold">
            내 운영진 지원서
          </span>
          <h1 className="text-title-l-mobile sm:text-title-l font-bold">
            제출 내역
          </h1>
          <p className="text-text-subtle text-sm">
            {formatDateTime(application.submitted_at)} 제출 · 제출 완료
          </p>
        </div>
      )}

      <section className={embedded ? "" : "mt-8"}>
        <h2 className="text-text-bolder text-body-l mb-4 font-bold">
          지원자 정보
        </h2>
        <dl className="rounded-3 border-border-gray-light bg-surface-white grid gap-4 border p-5 sm:grid-cols-2">
          <div>
            <dt className="text-text-subtle text-sm">이름</dt>
            <dd className="text-text-basic font-semibold">
              {application.applicant_name}
            </dd>
          </div>
          <div>
            <dt className="text-text-subtle text-sm">소속 학과</dt>
            <dd className="text-text-basic font-semibold">
              {application.applicant_department ?? "-"}
            </dd>
          </div>
          <div>
            <dt className="text-text-subtle text-sm">이메일</dt>
            <dd className="text-text-basic break-all font-semibold">
              {application.applicant_email}
            </dd>
          </div>
          <div>
            <dt className="text-text-subtle text-sm">연락처</dt>
            <dd className="text-text-basic font-semibold">
              {formatPhoneNumber(application.applicant_phone_num) || "-"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-8">
        <h2 className="text-text-bolder text-body-l mb-4 font-bold">
          지원 부서
        </h2>
        <dl className="rounded-3 border-border-gray-light bg-surface-white grid gap-4 border p-5 sm:grid-cols-2">
          {([1, 2] as const).map((priority) => {
            const department = application.applied_departments.find(
              (item) => item.priority === priority,
            );
            return (
              <div key={priority}>
                <dt className="text-text-subtle text-sm">
                  {priority}지망 부서
                </dt>
                <dd className="text-text-basic font-semibold">
                  {department
                    ? formatStaffRecruitmentDepartment(department.name)
                    : "-"}
                </dd>
              </div>
            );
          })}
        </dl>
      </section>

      <section className="mt-8">
        <h2 className="text-text-bolder text-body-l mb-4 font-bold">
          작성 답변
        </h2>
        <ol className="rounded-3 border-border-gray-light bg-surface-white space-y-6 border p-5">
          {application.answers.map((answer, index) => (
            <li key={answer.question_id}>
              <h3 className="text-text-bolder font-semibold">
                {index + 1}. {answer.question_label}
                {requiredQuestionIds.has(answer.question_id) && (
                  <>
                    <span
                      className="text-text-danger ml-0.5"
                      aria-hidden="true"
                    >
                      *
                    </span>
                    <span className="sr-only">(필수 문항)</span>
                  </>
                )}
              </h3>
              {answer.question_type === "FILE" && answer.answer ? (
                <button
                  type="button"
                  className="text-primary-60 mt-3 text-sm underline"
                  onClick={() =>
                    void downloadPrivateFile(
                      `api/v1/staff-recruitments/${application.recruitment_id}/applications/me/files/${answer.question_id}`,
                      answer.answer,
                    ).catch(() =>
                      setError({
                        code: null,
                        message: "파일을 내려받지 못했습니다.",
                      }),
                    )
                  }
                >
                  {answer.answer} 다운로드
                </button>
              ) : answer.question_type === "LINK" && answer.answer ? (
                <a
                  className="text-primary-60 mt-3 block break-all text-sm underline"
                  href={answer.answer}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {answer.answer}
                </a>
              ) : (
                <p className="text-text-basic mt-3 whitespace-pre-wrap break-words text-sm leading-6">
                  {answer.answer || "답변 없음"}
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>

      {interviewSlotsByDate.size > 0 && (
        <section className="mt-8">
          <h2 className="text-text-bolder text-body-l mb-4 font-bold">
            면접 가능 시각
          </h2>
          <ul className="rounded-3 border-border-gray-light bg-surface-white space-y-5 border p-5">
            {Array.from(interviewSlotsByDate, ([date, minutes]) => (
              <li key={date}>
                <h3 className="text-text-bolder font-semibold">
                  {formatInterviewDate(date)}
                </h3>
                <p className="text-text-basic mt-2 text-sm leading-6">
                  {formatInterviewTimes(minutes, interviewSlotMinutes)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {error && (
        <p role="alert" className="text-text-danger mt-4 text-sm">
          {error.message}
        </p>
      )}
      <div className="mt-8 flex justify-end">
        {applicationOpen ? (
          <Link href={`/club/recruit/${recruitmentId}/application/edit`}>
            <Button variant="primary" size="large">
              지원서 관리
            </Button>
          </Link>
        ) : (
          <Button variant="primary" size="large" disabled>
            지원서 관리
          </Button>
        )}
      </div>
    </Container>
  );
}
