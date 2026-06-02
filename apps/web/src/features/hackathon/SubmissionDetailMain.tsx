"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { Badge, Body, Breadcrumb, Heading, Label } from "@ui/components/server";
import { Button } from "@ui/components/client";

import { useArchiveSubmissionDetail } from "@/hooks/hackathon";
import { HackathonSubmissionDetailSkeleton } from "@/components/skeleton/HackathonSkeleton";

interface SubmissionDetailMainProps {
  submissionId: number;
}

const ROLE_LABEL: Record<string, string> = {
  LEADER: "팀장",
  MEMBER: "팀원",
};

function formatDate(value?: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
}

export function SubmissionDetailMain({
  submissionId,
}: SubmissionDetailMainProps) {
  const router = useRouter();
  const { submission, loading, error } =
    useArchiveSubmissionDetail(submissionId);

  const submittedAt = useMemo(
    () => formatDate(submission?.created_at),
    [submission?.created_at],
  );

  if (loading) {
    return <HackathonSubmissionDetailSkeleton />;
  }

  if (error || !submission) {
    return (
      <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
        <div className="rounded-3 border-border-gray-light bg-surface-white flex min-h-[40vh] flex-col items-center justify-center gap-4 border p-10 text-center">
          <Body size="m" className="text-text-subtle">
            {error ?? "제출물을 찾을 수 없습니다."}
          </Body>
          <Button variant="secondary" onClick={() => router.back()}>
            돌아가기
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "홈", href: "/" },
            { label: "해커톤", href: "/hackathon" },
            { label: "아카이브", href: "/hackathon/archive" },
            { label: submission.project_name },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="rounded-3 border-border-gray-light bg-surface-white mb-8 border p-8 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Label size="xs" className="text-text-subtle font-bold">
            {submission.team_name}
          </Label>
          {submission.awarded &&
            submission.awards.map((award) => (
              <Badge
                key={award.award_id}
                label={award.award_name}
                variant="warning"
                appearance="solid-pastel"
                size="small"
              />
            ))}
        </div>

        <Heading size="l" className="text-text-basic mb-3">
          {submission.project_name}
        </Heading>
        <Body size="m" className="text-text-subtle whitespace-pre-wrap">
          {submission.summary}
        </Body>

        {/* Tech stacks */}
        {submission.tech_stacks.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {submission.tech_stacks.map((tech) => (
              <span
                key={tech}
                className="bg-surface-primary-subtler text-text-primary text-label-xs inline-flex h-6 items-center rounded-full px-2.5 font-semibold"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="mt-6 flex flex-wrap gap-2">
          <a
            href={submission.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2 border-border-gray-light text-label-s text-text-basic hover:border-border-primary hover:text-text-primary inline-flex h-10 items-center border px-4 font-semibold transition-colors"
          >
            GitHub
          </a>
          {submission.deploy_url && (
            <a
              href={submission.deploy_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2 border-border-gray-light text-label-s text-text-basic hover:border-border-primary hover:text-text-primary inline-flex h-10 items-center border px-4 font-semibold transition-colors"
            >
              배포 사이트
            </a>
          )}
          {submission.presentation_file && (
            <a
              href={submission.presentation_file}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2 border-border-gray-light text-label-s text-text-basic hover:border-border-primary hover:text-text-primary inline-flex h-10 items-center border px-4 font-semibold transition-colors"
            >
              발표 자료
            </a>
          )}
        </div>
      </section>

      {/* Cover image */}
      {submission.image_url && (
        <section className="rounded-3 border-border-gray-light bg-surface-white mb-8 overflow-hidden border shadow-sm">
          <Image
            src={submission.image_url}
            alt={`${submission.project_name} 대표 이미지`}
            width={1200}
            height={675}
            className="h-auto w-full object-cover"
          />
        </section>
      )}

      {/* Body */}
      <section className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_300px]">
        {/* Description */}
        <div>
          <Heading size="xs" className="text-text-basic mb-4">
            프로젝트 소개
          </Heading>
          {submission.description ? (
            <Body
              size="m"
              className="text-text-basic whitespace-pre-wrap leading-8"
            >
              {submission.description}
            </Body>
          ) : (
            <Body size="m" className="text-text-subtle">
              등록된 상세 설명이 없습니다.
            </Body>
          )}
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          {/* Team members */}
          <div className="rounded-3 border-border-gray-light bg-surface-white border p-5 shadow-sm">
            <Label size="xs" className="text-text-subtle mb-3 block font-bold">
              팀 ({submission.team_name})
            </Label>
            {submission.team_members.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {submission.team_members.map((member) => (
                  <li
                    key={member.user_id}
                    className="flex items-center justify-between"
                  >
                    <Body size="s" className="text-text-basic">
                      {member.user_name}
                    </Body>
                    <span className="text-text-subtle text-label-xs">
                      {ROLE_LABEL[member.role] ?? member.role}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <Body size="s" className="text-text-subtle">
                팀 구성원 정보가 없습니다.
              </Body>
            )}
          </div>

          {/* Awards */}
          {submission.awarded && submission.awards.length > 0 && (
            <div className="rounded-3 border-border-gray-light bg-surface-white border p-5 shadow-sm">
              <Label
                size="xs"
                className="text-text-subtle mb-3 block font-bold"
              >
                수상 내역
              </Label>
              <ul className="flex flex-col gap-2">
                {submission.awards.map((award) => (
                  <li
                    key={award.award_id}
                    className="flex items-center justify-between gap-2"
                  >
                    <Body size="s" className="text-text-basic font-semibold">
                      {award.award_name}
                    </Body>
                    {typeof award.award_rank === "number" && (
                      <span className="text-text-subtle text-label-xs">
                        {award.award_rank}위
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Meta */}
          {submittedAt && (
            <div className="rounded-3 border-border-gray-light bg-surface-white border p-5 shadow-sm">
              <Label
                size="xs"
                className="text-text-subtle mb-1 block font-bold"
              >
                제출일
              </Label>
              <Body size="s" className="text-text-basic">
                {submittedAt}
              </Body>
            </div>
          )}
        </aside>
      </section>

      {/* Back */}
      <div className="mt-12">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => router.push("/hackathon/archive")}
        >
          아카이브로 돌아가기
        </Button>
      </div>
    </main>
  );
}
