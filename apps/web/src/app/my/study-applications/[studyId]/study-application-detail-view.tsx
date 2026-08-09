"use client";

import Link from "next/link";
import { Badge, Body, Heading } from "@ui/components/server";
import { Button } from "@ui/components/client";
import type { StudyApplicationDetail } from "@core/study-application/api";

const STATUS_LABELS: Record<StudyApplicationDetail["study_status"], string> = {
  PENDING: "승인 대기",
  RE_APPLIED: "재신청",
  REJECTED: "반려",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  EASY: "쉬움",
  SEMI_EASY: "조금 쉬움",
  NORMAL: "보통",
  SEMI_HARD: "조금 어려움",
  HARD: "어려움",
};

const WEEKDAY_LABELS = [
  "일요일",
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
];

export function StudyApplicationDetailView({
  application,
}: {
  application: StudyApplicationDetail;
}) {
  const { study } = application;
  return (
    <main className="max-w-main mx-auto px-4 py-12 pb-24 sm:px-6 md:pb-32">
      <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge
              label={STATUS_LABELS[application.study_status]}
              variant="primary"
              appearance="solid-pastel"
              size="medium"
            />
            {study.tags.map((tag) => (
              <Badge
                key={tag}
                label={tag}
                variant="info"
                appearance="solid-pastel"
                size="medium"
              />
            ))}
          </div>
          <Heading size="l" className="text-text-bolder">
            {study.study_name}
          </Heading>
          <Body size="l" className="text-text-subtle">
            스터디 개설 신청서
          </Body>
        </div>

        <div className="flex gap-3">
          <Link href="/my?section=study-manage&tab=study-applications">
            <Button variant="secondary" size="large">
              목록으로
            </Button>
          </Link>
          {application.can_modify ? (
            <Link href={`/studies/create?application_id=${study.id}`}>
              <Button variant="primary" size="large">
                {application.study_status === "REJECTED"
                  ? "수정 후 재신청"
                  : "수정"}
              </Button>
            </Link>
          ) : (
            <p className="text-text-subtle self-center text-[14px]">
              스터디 개설 신청 기간이 종료되어 수정할 수 없습니다.
            </p>
          )}
        </div>
      </div>

      {application.reject_reason && (
        <section className="bg-surface-danger-subtler text-text-danger mb-8 rounded-xl p-5">
          <h2 className="mb-2 text-[17px] font-bold">반려 사유</h2>
          <p className="whitespace-pre-wrap text-[15px] leading-[1.6]">
            {application.reject_reason}
          </p>
        </section>
      )}

      <div className="space-y-10">
        <section>
          <h2 className="mb-4 text-[21px] font-bold">스터디 개요</h2>
          <dl className="border-border-gray-light divide-divider-gray-light rounded-xl border px-5">
            <InfoRow
              label="멘토"
              value={[study.primary_mentor_name, study.secondary_mentor_name]
                .filter(Boolean)
                .join(", ")}
            />
            <InfoRow label="한 줄 소개" value={study.one_liner} />
            <InfoRow
              label="난이도"
              value={formatDifficulty(study.difficulty)}
            />
            <InfoRow label="진행 시간" value={formatStudyTime(study)} />
            <InfoRow label="진행 장소" value={formatLocation(study)} />
            <InfoRow
              label="모집 인원"
              value={study.capacity ? `${study.capacity}명` : null}
            />
            <InfoRow
              label="면접"
              value={
                study.requires_interview
                  ? study.interview_date
                    ? `진행 (${formatDate(study.interview_date)})`
                    : "진행 (일정 미정)"
                  : "진행하지 않음"
              }
            />
          </dl>
        </section>

        <section>
          <h2 className="mb-4 text-[21px] font-bold">스터디 소개</h2>
          <p className="bg-surface-gray-subtler text-text-basic whitespace-pre-wrap rounded-xl p-5 text-[16px] leading-[1.6]">
            {study.explanation || study.goal || "-"}
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-[21px] font-bold">커리큘럼</h2>
          {study.plans.length === 0 ? (
            <p className="text-text-subtle">등록된 커리큘럼이 없습니다.</p>
          ) : (
            <div className="border-border-gray-light overflow-x-auto rounded-xl border">
              <table className="w-full min-w-[680px] text-left text-[15px]">
                <thead className="bg-surface-gray-subtler">
                  <tr>
                    <th className="px-4 py-3">주차</th>
                    <th className="px-4 py-3">진행 날짜</th>
                    <th className="px-4 py-3">주제</th>
                    <th className="px-4 py-3">내용</th>
                  </tr>
                </thead>
                <tbody className="divide-divider-gray-light">
                  {study.plans.map((plan) => (
                    <tr key={plan.id}>
                      <td className="px-4 py-3">{plan.week_num}주차</td>
                      <td className="px-4 py-3">{formatDate(plan.date)}</td>
                      <td className="px-4 py-3">{plan.section || "-"}</td>
                      <td className="whitespace-pre-wrap px-4 py-3">
                        {plan.content || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-[21px] font-bold">참고자료</h2>
          {study.references.length === 0 ? (
            <p className="text-text-subtle">등록된 참고자료가 없습니다.</p>
          ) : (
            <ul className="border-border-gray-light divide-divider-gray-light overflow-hidden rounded-xl border">
              {study.references.map((reference) => (
                <li
                  key={reference.id}
                  className="text-text-basic flex flex-wrap items-center gap-2 px-4 py-3 text-[15px]"
                >
                  <Badge
                    label={
                      reference.reference_type === "FILE" ? "파일" : "링크"
                    }
                    variant="info"
                    appearance="solid-pastel"
                    size="small"
                  />
                  {reference.reference_type === "URL" && reference.content ? (
                    <a
                      href={reference.content}
                      target="_blank"
                      rel="noreferrer"
                      className="text-text-primary break-all underline underline-offset-2"
                    >
                      {reference.content}
                    </a>
                  ) : (
                    <span className="break-all">
                      {reference.content || "-"}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[140px_1fr] sm:gap-4">
      <dt className="text-text-subtle text-[15px] font-bold">{label}</dt>
      <dd className="text-text-basic whitespace-pre-wrap text-[15px]">
        {value || "-"}
      </dd>
    </div>
  );
}

function formatDifficulty(value: string | null) {
  return value ? (DIFFICULTY_LABELS[value] ?? value) : "-";
}

function formatStudyTime(study: StudyApplicationDetail["study"]) {
  const weekday =
    study.week_day === null ? "" : (WEEKDAY_LABELS[study.week_day] ?? "");
  const time = [study.start_time, study.end_time].filter(Boolean).join(" ~ ");
  return [weekday, time].filter(Boolean).join(" ") || "-";
}

function formatLocation(study: StudyApplicationDetail["study"]) {
  if (study.is_online) return "온라인";
  return (
    [study.location, study.location_detail].filter(Boolean).join(" ") || "-"
  );
}

function formatDate(value: string | null) {
  return value ? value.slice(0, 10) : "-";
}
