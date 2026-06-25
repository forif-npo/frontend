"use client";

import type { Hackathon, Submission, Award } from "@core/types/hackathon";
import { Badge, Body, Breadcrumb, Heading, Label } from "@ui/components/server";
import { Pagination, Select, TextInput } from "@ui/components/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient } from "@core/utils/api-client";
import type { ApiResponse, CursorPageResponse } from "@core/types/api";
import { useDebounce } from "@/hooks/useDebounce";
import { HackathonArchiveSkeleton } from "@/components/skeleton/HackathonSkeleton";
import type { ArchiveHackathonDetail } from "@core/types/hackathon";

interface ArchiveMainProps {
  hackathons: Hackathon[];
}

export function ArchiveMain({ hackathons }: ArchiveMainProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number>(
    hackathons[0]?.hackathon_id ?? 0,
  );
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTech, setSelectedTech] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 9;
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(search, 500);

  const fetchDetail = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const [detailRes, submissionsRes] = await Promise.all([
        apiClient
          .get(`api/v1/archive/hackathons/${id}`)
          .json<ApiResponse<ArchiveHackathonDetail>>(),
        apiClient
          .get(`api/v1/archive/hackathons/${id}/submissions`)
          .json<ApiResponse<CursorPageResponse<Submission>>>(),
      ]);
      setSubmissions(submissionsRes.data?.content ?? []);
      setAwards(detailRes.data?.awards ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedId) fetchDetail(selectedId);
  }, [selectedId, fetchDetail]);

  const techStacks = useMemo(
    () => [
      "전체",
      ...Array.from(new Set(submissions.flatMap((s) => s.tech_stacks))),
    ],
    [submissions],
  );
  const hackathonOptions = useMemo(
    () =>
      hackathons.map((h) => ({
        value: String(h.hackathon_id),
        label: h.title || `${h.event_round}회 해커톤`,
      })),
    [hackathons],
  );
  const techOptions = useMemo(
    () => techStacks.map((tech) => ({ value: tech, label: tech })),
    [techStacks],
  );

  const filtered = useMemo(() => {
    setCurrentPage(1);
    return submissions.filter((s) => {
      const q = debouncedSearch.trim().toLowerCase();
      const matchesSearch =
        q.length === 0 ||
        s.project_name.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q);
      const matchesTech =
        selectedTech === "전체" || s.tech_stacks.includes(selectedTech);
      return matchesSearch && matchesTech;
    });
  }, [submissions, debouncedSearch, selectedTech]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  if (loading) {
    return <HackathonArchiveSkeleton />;
  }

  return (
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "홈", href: "/" },
            { label: "해커톤", href: "/hackathon" },
            { label: "아카이브" },
          ]}
        />
      </div>

      {/* Header */}
      <section className="bg-surface-white border-border-gray-light rounded-3 mb-8 border p-8 shadow-sm">
        <div>
          <Label
            size="xs"
            className="text-text-primary mb-3 block font-bold uppercase tracking-[0.15em]"
          >
            Archive
          </Label>
          <Heading size="l" className="text-text-basic mb-3">
            역대 해커톤 결과물
          </Heading>
          <Body size="m" className="text-text-subtle">
            종료된 해커톤의 제출작을 모아보고, 수상팀은 뱃지로 구분합니다.
          </Body>
        </div>
      </section>

      {/* Hackathon selector + Filters */}
      <section className="bg-surface-white border-border-gray-light rounded-3 mb-6 flex flex-wrap items-end gap-4 border p-5 shadow-sm">
        {hackathons.length > 1 && (
          <div className="min-w-[180px]">
            <div className="flex flex-col gap-1.5">
              <Label size="xs" className="text-text-subtle font-bold">
                해커톤 선택
              </Label>
              <Select
                id="archive-hackathon"
                value={String(selectedId)}
                onChange={(value) => {
                  setSelectedId(Number(value));
                  setSearch("");
                  setSelectedTech("전체");
                }}
                options={hackathonOptions}
                placeholder="해커톤 선택"
                size="md"
              />
            </div>
          </div>
        )}
        <div className="min-w-[200px] flex-1">
          <TextInput
            id="archive-search"
            title="검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="프로젝트명, 한 줄 소개"
            length="full"
          />
        </div>
        <div className="min-w-[180px]">
          <div className="flex flex-col gap-1.5">
            <Label size="xs" className="text-text-subtle font-bold">
              기술 스택
            </Label>
            <Select
              id="archive-tech-stack"
              value={selectedTech}
              onChange={setSelectedTech}
              options={techOptions}
              placeholder="기술 스택"
              size="md"
            />
          </div>
        </div>
      </section>

      {/* Project grid */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginated.map((submission) => {
          const award = awards.find(
            (a) => a.hackathon_team_id === submission.team_id,
          );
          return (
            <article
              key={submission.submission_id}
              role="link"
              tabIndex={0}
              onClick={() =>
                router.push(
                  `/hackathon/archive/submissions/${submission.submission_id}`,
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push(
                    `/hackathon/archive/submissions/${submission.submission_id}`,
                  );
                }
              }}
              className="rounded-3 border-border-gray-light bg-surface-white focus-visible:ring-primary-20 group flex cursor-pointer flex-col border p-6 shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2"
            >
              {/* Meta */}
              <div className="mb-3 flex items-center justify-between gap-3">
                <Label size="xs" className="text-text-subtle font-bold">
                  {submission.team_name}
                </Label>
                {award && (
                  <Badge
                    label={award.award_name}
                    variant="warning"
                    appearance="solid-pastel"
                    size="small"
                  />
                )}
              </div>

              {/* Content */}
              <Heading size="xxs" className="text-text-basic mb-2">
                {submission.project_name}
              </Heading>
              <Body
                size="s"
                className="text-text-subtle mb-4 line-clamp-3 min-h-[60px]"
              >
                {submission.summary}
              </Body>

              {/* Tags */}
              <div className="mb-4 mt-auto flex flex-wrap gap-1.5">
                {submission.tech_stacks.map((t) => (
                  <span
                    key={t}
                    className="bg-surface-primary-subtler text-text-primary text-label-xs inline-flex h-6 items-center rounded-full px-2.5 font-semibold"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="border-divider-gray-light flex flex-wrap gap-2 border-t pt-3">
                {submission.github_url && (
                  <a
                    href={submission.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-2 border-border-gray-light text-label-xs text-text-basic hover:border-border-primary hover:text-text-primary inline-flex h-8 items-center border px-3 font-semibold transition-colors"
                  >
                    GitHub
                  </a>
                )}
                {submission.deploy_url && (
                  <a
                    href={submission.deploy_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-2 border-border-gray-light text-label-xs text-text-basic hover:border-border-primary hover:text-text-primary inline-flex h-8 items-center border px-3 font-semibold transition-colors"
                  >
                    배포
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </main>
  );
}
