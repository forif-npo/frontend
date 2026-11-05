"use client";

import { useEffect, useState } from "react";
import type { StaffApplicationDetail } from "@core/types/staff-recruitment";
import { Button } from "@ui/components/client";
import { Link, PageState } from "@ui/components/server";
import { getMyStaffApplication } from "./api";
import { getStaffApplicationErrorInfo } from "./application-error";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export function MyStaffApplicationView({
  recruitmentId,
  submitted,
}: {
  recruitmentId: number;
  submitted: boolean;
}) {
  const [application, setApplication] = useState<StaffApplicationDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{
    code: string | null;
    message: string;
  } | null>(null);

  useEffect(() => {
    let active = true;
    getMyStaffApplication(recruitmentId)
      .then((data) => active && setApplication(data))
      .catch(async (reason) => {
        const info = await getStaffApplicationErrorInfo(reason);
        if (active) setError(info);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [recruitmentId]);

  if (loading) {
    return (
      <PageState
        title="지원서를 불러오는 중입니다"
        description="잠시만 기다려주세요."
      />
    );
  }

  if (!application) {
    const missing = error?.code === "FOR155-404";
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

  return (
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      {submitted && (
        <div
          role="status"
          className="bg-primary-5 text-primary-60 rounded-3 mb-8 p-4 font-semibold"
        >
          지원서가 정상적으로 제출되었습니다.
        </div>
      )}
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

      <section className="rounded-3 mt-8 grid gap-3 border p-5 sm:grid-cols-2">
        <div>
          <span className="text-text-subtle text-sm">이름</span>
          <p className="font-semibold">{application.applicant_name}</p>
        </div>
        <div>
          <span className="text-text-subtle text-sm">소속 학과</span>
          <p className="font-semibold">
            {application.applicant_department ?? "-"}
          </p>
        </div>
        <div>
          <span className="text-text-subtle text-sm">이메일</span>
          <p className="break-all font-semibold">
            {application.applicant_email}
          </p>
        </div>
        <div>
          <span className="text-text-subtle text-sm">연락처</span>
          <p className="font-semibold">
            {application.applicant_phone_num ?? "-"}
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold">지원 부서</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {[...application.applied_departments]
            .sort((a, b) => a.priority - b.priority)
            .map((department) => (
              <li
                key={department.department_id}
                className="rounded-3 border p-4"
              >
                <span className="text-primary-60 text-sm font-bold">
                  {department.priority}지망
                </span>
                <p className="mt-1 font-semibold">{department.name}</p>
              </li>
            ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold">작성 답변</h2>
        <ol className="mt-4 space-y-5">
          {application.answers.map((answer, index) => (
            <li key={answer.question_id} className="rounded-3 border p-5">
              <h3 className="font-semibold">
                {index + 1}. {answer.question_label}
              </h3>
              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6">
                {answer.answer || "답변 없음"}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <p className="text-text-subtle mt-8 text-sm">
        제출한 지원서는 수정하거나 취소할 수 없습니다.
      </p>
    </main>
  );
}
