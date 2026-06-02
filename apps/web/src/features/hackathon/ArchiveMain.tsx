"use client";

import type { Hackathon, Submission, Award } from "@core/types/hackathon";
import { Badge, Body, Heading, Label } from "@ui/components/server";
import { Pagination, TextInput } from "@ui/components/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import { useDebounce } from "@/hooks/useDebounce";
import { HackathonArchiveSkeleton } from "@/components/skeleton/HackathonSkeleton";
import type { ArchiveHackathonDetail } from "@core/types/hackathon";

interface ArchiveMainProps {
  hackathons: Hackathon[];
}

export function ArchiveMain({ hackathons }: ArchiveMainProps) {
  const [selectedId, setSelectedId] = useState<number>(
    hackathons[0]?.hackathon_id ?? 0,
  );
  const [detail, setDetail] = useState<ArchiveHackathonDetail | null>(null);
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
          .json<ApiResponse<Submission[] | { content: Submission[] }>>(),
      ]);
      setDetail(detailRes.data);
      const rawSubs = submissionsRes.data;
      setSubmissions(
        Array.isArray(rawSubs)
          ? rawSubs
          : ((rawSubs as { content?: Submission[] })?.content ?? []),
      );
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
      {/* Header */}
      <section className="bg-surface-white border-border-gray-light rounded-3 mb-8 grid grid-cols-1 gap-6 border p-8 shadow-sm md:grid-cols-[1fr_380px]">
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
        {detail && (
          <div className="grid grid-cols-3 gap-3 self-center">
            <Fact label="해커톤" value={`${detail.event_round}회`} />
            <Fact label="제출작" value={`${detail.submission_count}개`} />
            <Fact label="수상팀" value={`${detail.awards.length}팀`} />
          </div>
        )}
      </section>

      {/* Hackathon selector + Filters */}
      <section className="bg-surface-white border-border-gray-light rounded-3 mb-6 flex flex-wrap items-end gap-4 border p-5 shadow-sm">
        {hackathons.length > 1 && (
          <div className="min-w-[180px]">
            <label className="flex flex-col gap-1.5">
              <Label size="xs" className="text-text-subtle font-bold">
                해커톤 선택
              </Label>
              <select
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(Number(e.target.value));
                  setSearch("");
                  setSelectedTech("전체");
                }}
                className="border-input-border rounded-2 bg-input-surface text-text-basic text-body-s focus:border-input-border-active focus:ring-primary-20 h-12 border px-4 focus:outline-none focus:ring-1"
              >
                {hackathons.map((h) => (
                  <option key={h.hackathon_id} value={h.hackathon_id}>
                    {h.title || `${h.event_round}회 해커톤`}
                  </option>
                ))}
              </select>
            </label>
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
          <label className="flex flex-col gap-1.5">
            <Label size="xs" className="text-text-subtle font-bold">
              기술 스택
            </Label>
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="border-input-border rounded-2 bg-input-surface text-text-basic text-body-s focus:border-input-border-active focus:ring-primary-20 h-12 border px-4 focus:outline-none focus:ring-1"
            >
              {techStacks.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
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
              className="rounded-3 border-border-gray-light bg-surface-white group flex flex-col border p-6 shadow-sm transition-shadow hover:shadow-md"
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
                <a
                  href={submission.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2 border-border-gray-light text-label-xs text-text-basic hover:border-border-primary hover:text-text-primary inline-flex h-8 items-center border px-3 font-semibold transition-colors"
                >
                  GitHub
                </a>
                {submission.deploy_url && (
                  <a
                    href={submission.deploy_url}
                    target="_blank"
                    rel="noopener noreferrer"
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

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-gray-subtler border-border-gray-light rounded-2 flex flex-col gap-1.5 border p-4">
      <Label size="xs" className="text-text-subtle">
        {label}
      </Label>
      <Body size="s" className="text-text-basic break-all font-bold">
        {value}
      </Body>
    </div>
  );
}
