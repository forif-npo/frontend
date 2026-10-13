import type { StaffRecruitmentRound } from "@core/types/staff-recruitment";
import { Button } from "@ui/components/client";
import { Link, PageState } from "@ui/components/server";
import { PageHeader } from "@/components/PageHeader";
import {
  APPLICATION_STATUS_LABELS,
  formatRecruitmentPeriod,
  recruitmentStatusMessage,
} from "./presentation";

export function StaffRecruitmentView({
  recruitment,
  failed = false,
}: {
  recruitment: StaffRecruitmentRound | null;
  failed?: boolean;
}) {
  if (failed) {
    return (
      <PageState
        eyebrow="운영진 모집"
        title="모집 정보를 불러오지 못했어요"
        description="잠시 후 다시 시도하거나 공지사항에서 최신 모집 소식을 확인해주세요."
        actions={
          <Link href="/support/announcements">
            <Button variant="primary">공지사항 보기</Button>
          </Link>
        }
      />
    );
  }

  if (!recruitment) {
    return (
      <PageState
        eyebrow="운영진 모집"
        title="현재 공개된 운영진 모집이 없어요"
        description="새 모집 일정은 공지사항을 통해 안내드릴게요."
        actions={
          <Link href="/support/announcements">
            <Button variant="primary">공지사항 보기</Button>
          </Link>
        }
      />
    );
  }

  return (
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      <PageHeader
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "동아리", href: "/club" },
          { label: "운영진 모집" },
        ]}
        title={recruitment.title}
        description={recruitment.summary ?? "FORIF 운영진 모집 안내입니다."}
        titleAddon={
          <span className="bg-primary-5 text-primary-60 rounded-full px-3 py-1 text-sm font-bold">
            {APPLICATION_STATUS_LABELS[recruitment.application_status]}
          </span>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-8">
          <section aria-labelledby="recruitment-description">
            <h2
              id="recruitment-description"
              className="text-title-l-mobile sm:text-title-l text-text-basic font-bold"
            >
              모집 안내
            </h2>
            <p className="text-text-basic mt-4 whitespace-pre-wrap text-[16px] leading-7">
              {recruitment.description ?? "등록된 모집 안내가 없습니다."}
            </p>
          </section>

          <section aria-labelledby="recruitment-departments">
            <h2
              id="recruitment-departments"
              className="text-title-l-mobile sm:text-title-l text-text-basic font-bold"
            >
              모집 부서
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {recruitment.departments
                .filter((department) => department.active)
                .sort((a, b) => a.display_order - b.display_order)
                .map((department) => (
                  <article
                    key={department.department_id}
                    className="border-border-gray rounded-3 border bg-white p-5"
                  >
                    <h3 className="text-text-basic font-bold">
                      {department.name}
                    </h3>
                    {department.description && (
                      <p className="text-text-subtle mt-2 text-sm leading-6">
                        {department.description}
                      </p>
                    )}
                  </article>
                ))}
            </div>
          </section>

          {recruitment.questions.length > 0 && (
            <section aria-labelledby="recruitment-questions">
              <h2
                id="recruitment-questions"
                className="text-title-l-mobile sm:text-title-l text-text-basic font-bold"
              >
                지원서 문항
              </h2>
              <ol className="mt-4 space-y-3">
                {[...recruitment.questions]
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((question, index) => (
                    <li
                      key={question.question_id}
                      className="border-border-gray rounded-3 border p-4 text-sm"
                    >
                      <span className="text-primary-60 font-bold">
                        {index + 1}.
                      </span>{" "}
                      <span className="text-text-basic font-semibold">
                        {question.label}
                      </span>
                      {question.required && (
                        <span className="text-text-danger ml-1">필수</span>
                      )}
                    </li>
                  ))}
              </ol>
            </section>
          )}
        </div>

        <aside className="border-border-gray rounded-3 h-fit border bg-white p-5 lg:sticky lg:top-24">
          <p className="text-text-subtle text-sm">모집 기간</p>
          <p className="text-text-basic mt-2 font-bold">
            {formatRecruitmentPeriod(
              recruitment.starts_at,
              recruitment.ends_at,
            )}
          </p>
          <p className="text-text-subtle mt-4 text-sm leading-6">
            {recruitmentStatusMessage(
              recruitment.application_status,
              recruitment.application_unavailable_reason,
            )}
          </p>
          <Button className="mt-5 w-full" disabled>
            {recruitment.application_open
              ? "지원서는 3단계에서 열립니다"
              : APPLICATION_STATUS_LABELS[recruitment.application_status]}
          </Button>
          <p className="text-text-subtle mt-3 text-xs leading-5">
            지원 자격과 접수 가능 여부는 서버에서 최종 확인합니다.
          </p>
        </aside>
      </div>
    </main>
  );
}
