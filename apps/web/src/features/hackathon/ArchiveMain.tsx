"use client";

import type {
  Award,
  CompetitionType,
  Hackathon,
  Submission,
} from "@core/types/hackathon";
import { Badge, Body, Heading, Label } from "@ui/components/server";
import { Pagination, SelectBox } from "@ui/components/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient } from "@core/utils/api-client";
import {
  HACKATHON_TECH_STACK_OPTIONS,
  normalizeHackathonTechStack,
} from "@core/hackathon/tags";
import type { ApiResponse, CursorPageResponse } from "@core/types/api";
import { useDebounce } from "@/hooks/useDebounce";
import { HackathonArchiveSkeleton } from "@/components/skeleton/HackathonSkeleton";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";
import type { ArchiveHackathonDetail } from "@core/types/hackathon";
import { CompetitionTypeBadge } from "./CompetitionTypeBadge";
import {
  ARCHIVE_CARD_LINKS_CLASS_NAME,
  ARCHIVE_CARD_SUMMARY_MIN_HEIGHT_CLASS_NAME,
  ARCHIVE_ELEVATED_PANEL_CLASS_NAME,
  ARCHIVE_FILTER_WIDTH_CLASS_NAME,
  ArchiveExternalLinks,
  ArchiveTechStackBadges,
} from "./archive/ui";

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
  const [selectedCompetitionType, setSelectedCompetitionType] = useState<
    CompetitionType | "전체"
  >("전체");
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

  const hackathonOptions = useMemo(
    () =>
      [...hackathons].map((h) => ({
        value: String(h.hackathon_id),
        label: h.title
          ? `${h.event_round}회 · ${h.title}`
          : `${h.held_year}-${h.held_semester} · ${h.event_round}회`,
      })),
    [hackathons],
  );
  const techOptions = useMemo(
    () => [
      { value: "전체", label: "전체" },
      ...HACKATHON_TECH_STACK_OPTIONS.map((tech) => ({
        value: tech,
        label: tech,
      })),
    ],
    [],
  );
  const competitionTypeOptions = useMemo(
    () => [
      { value: "전체", label: "전체" },
      { value: "IDEATHON", label: "아이디어톤" },
      { value: "HACKATHON", label: "해커톤" },
    ],
    [],
  );

  const filtered = useMemo(() => {
    setCurrentPage(1);
    return submissions.filter((s) => {
      const q = debouncedSearch.trim().toLowerCase();
      const matchesSearch =
        q.length === 0 ||
        s.project_name.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.team_name.toLowerCase().includes(q);
      const matchesTech =
        selectedTech === "전체" ||
        s.tech_stacks.some(
          (techStack) =>
            normalizeHackathonTechStack(techStack) ===
            normalizeHackathonTechStack(selectedTech),
        );
      const matchesCompetitionType =
        selectedCompetitionType === "전체" ||
        s.competition_type === selectedCompetitionType;
      return matchesSearch && matchesTech && matchesCompetitionType;
    });
  }, [submissions, debouncedSearch, selectedTech, selectedCompetitionType]);

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
      <PageHeader
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "해커톤", href: "/hackathon" },
          { label: "아카이브" },
        ]}
        title="역대 해커톤 결과물"
        description="종료된 해커톤의 제출작을 확인해보세요."
      />

      {/* Search + Filters */}
      <section className="mb-7">
        <SearchBar
          value={search}
          onChange={setSearch}
          onSubmit={() => setCurrentPage(1)}
          placeholder="프로젝트명, 팀명, 한 줄 소개를 검색해보세요"
          className="mb-6 w-full md:!max-w-none"
        />

        <div className="bg-surface-secondary-subtler rounded-xl p-10">
          <div className="flex flex-wrap items-start gap-x-14 gap-y-6 max-md:flex-col">
            <div className="flex items-center gap-3 max-md:w-full">
              <Label className="text-text-basic whitespace-nowrap font-bold max-md:w-20">
                해커톤 회차
              </Label>
              <div
                className={`${ARCHIVE_FILTER_WIDTH_CLASS_NAME.hackathon} max-md:min-w-0 max-md:flex-1`}
              >
                <SelectBox
                  id="archive-hackathon"
                  value={String(selectedId)}
                  onChange={(value) => {
                    setSelectedId(Number(value));
                    setSearch("");
                    setSelectedTech("전체");
                    setSelectedCompetitionType("전체");
                    setCurrentPage(1);
                  }}
                  options={hackathonOptions}
                  placeholder="회차 선택"
                  size="md"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 max-md:w-full">
              <Label className="text-text-basic whitespace-nowrap font-bold max-md:w-20">
                기술 스택
              </Label>
              <div
                className={`${ARCHIVE_FILTER_WIDTH_CLASS_NAME.techStack} max-md:min-w-0 max-md:flex-1`}
              >
                <SelectBox
                  id="archive-tech-stack"
                  value={selectedTech}
                  onChange={setSelectedTech}
                  options={techOptions}
                  placeholder="전체"
                  size="md"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 max-md:w-full">
              <Label className="text-text-basic whitespace-nowrap font-bold max-md:w-20">
                대회 유형
              </Label>
              <div
                className={`${ARCHIVE_FILTER_WIDTH_CLASS_NAME.competitionType} max-md:min-w-0 max-md:flex-1`}
              >
                <SelectBox
                  id="archive-competition-type"
                  value={selectedCompetitionType}
                  onChange={(value) =>
                    setSelectedCompetitionType(
                      value as CompetitionType | "전체",
                    )
                  }
                  options={competitionTypeOptions}
                  placeholder="전체"
                  size="md"
                />
              </div>
            </div>
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
              className={`${ARCHIVE_ELEVATED_PANEL_CLASS_NAME} focus-visible:ring-primary-20 group flex cursor-pointer flex-col p-6 transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2`}
            >
              {/* Meta */}
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Label size="m" className="text-text-basic font-bold">
                    {submission.team_name}
                  </Label>
                  <CompetitionTypeBadge
                    competitionType={submission.competition_type}
                  />
                </div>
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
              <Heading size="s" className="text-text-basic mb-2">
                {submission.project_name}
              </Heading>
              <Body
                size="s"
                className={`text-text-subtle mb-4 line-clamp-3 ${ARCHIVE_CARD_SUMMARY_MIN_HEIGHT_CLASS_NAME}`}
              >
                {submission.summary}
              </Body>

              {/* Tags */}
              <div className="mb-4 mt-auto flex flex-wrap gap-1.5">
                <ArchiveTechStackBadges techStacks={submission.tech_stacks} />
              </div>

              {/* Links */}
              <ArchiveExternalLinks
                links={[
                  { label: "GitHub", href: submission.github_url },
                  { label: "배포", href: submission.deploy_url },
                ]}
                size="small"
                className={ARCHIVE_CARD_LINKS_CLASS_NAME}
                onLinkClick={(event) => event.stopPropagation()}
              />
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
