import type { StaffRecruitmentRound } from "@core/types/staff-recruitment";
import { formatStaffRecruitmentDepartment, formatStaffRecruitmentTitle } from "@core/staff-recruitment";
import { Button } from "@ui/components/client";
import { Link, PageState } from "@ui/components/server";
import { PageHeader } from "@/components/PageHeader";
import { MarkdownContent } from "@/components/MarkdownContent";
import { APPLICATION_STATUS_LABELS, formatRecruitmentDatePeriod } from "./presentation";
import { StaffApplicationEntryButton } from "./StaffApplicationEntryButton";

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

  const description = recruitment.description?.trim();
  const showDescription =
    description && description !== recruitment.summary?.trim();
  return (
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      <PageHeader
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "동아리", href: "/club" },
          { label: "운영진 모집" },
        ]}
        title={formatStaffRecruitmentTitle(
          recruitment.act_year,
          recruitment.act_semester,
        )}
        description={recruitment.summary ?? "FORIF 운영진 모집 안내입니다."}
        titleAddon={
          <span className="bg-primary-5 text-primary-60 rounded-full px-3 py-1 text-sm font-bold">
            {APPLICATION_STATUS_LABELS[recruitment.application_status]}
          </span>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-8">
          {showDescription && (
            <section aria-labelledby="recruitment-description">
              <h2
                id="recruitment-description"
                className="text-title-l-mobile sm:text-title-l text-text-basic font-bold"
              >
                모집 안내
              </h2>
              <div className="bg-surface-gray-subtler rounded-3 mt-4 p-5 sm:p-6">
                <MarkdownContent content={description} />
              </div>
            </section>
          )}

          <section aria-labelledby="recruitment-departments">
            <h2
              id="recruitment-departments"
              className="text-title-l-mobile sm:text-title-l text-text-basic font-bold"
            >
              모집 부서
            </h2>
            <div className="mt-4 grid gap-x-8 sm:grid-cols-2">
              {recruitment.departments
                .filter((department) => department.active)
                .sort((a, b) => a.display_order - b.display_order)
                .map((department) => (
                  <article
                    key={department.department_id}
                    className="border-divider-gray-light border-b py-4"
                  >
                    <h3 className="text-text-basic text-[17px] font-bold leading-[1.5]">
                      {formatStaffRecruitmentDepartment(department.name)}
                    </h3>
                    {department.description?.trim() && (
                      <p className="text-text-subtle mt-1 text-[15px] leading-6">
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
              <ol className="mt-4 space-y-5">
                {[...recruitment.questions]
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((question, index) => (
                    <li
                      key={question.question_id}
                      className="flex gap-3 text-[15px] leading-[1.5] md:text-[17px]"
                    >
                      <span className="text-text-primary shrink-0 font-bold">
                        {index + 1}.
                      </span>
                      <div className="min-w-0">
                        <p className="text-text-basic whitespace-pre-wrap break-words font-semibold">
                          {question.label}
                          {question.required && (
                            <span className="text-text-danger ml-2 text-sm font-normal">
                              필수
                            </span>
                          )}
                        </p>
                        {question.description?.trim() && (
                          <p className="text-text-subtle mt-1 whitespace-pre-wrap break-words text-sm leading-6">
                            {question.description}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
              </ol>
            </section>
          )}
        </div>

        <aside className="border-border-gray rounded-3 h-fit border bg-white p-5 lg:sticky lg:top-24">
          <p className="text-text-subtle text-sm">모집 기간</p>
          <p className="text-text-basic mt-2 font-bold">
            {formatRecruitmentDatePeriod(
              recruitment.starts_at,
              recruitment.ends_at,
            )}
          </p>
          {recruitment.application_open ? (
            <StaffApplicationEntryButton
              recruitmentId={recruitment.recruitment_id}
            />
          ) : (
            <Button className="mt-5 w-full" disabled>
              {APPLICATION_STATUS_LABELS[recruitment.application_status]}
            </Button>
          )}
        </aside>
      </div>
    </main>
  );
}
