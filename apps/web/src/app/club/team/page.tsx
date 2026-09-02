"use client";

import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import { Button, Modal, Select } from "@ui/components/client";
import { EmptyState } from "@ui/components/server";
import Image from "next/image";
import { FORIF_CONTACT_INFO } from "@/constants/organization";
import { PageHeader } from "@/components/PageHeader";
import { getCurrentSemester, type Semester } from "@/features/semester/api";
import { TeamCard } from "@/features/club/team/TeamCard";
import { sortTeamMembers } from "@/features/club/team/sort-team-members";
import type { TeamMember } from "@/features/club/team/types";

const EARLIEST_YEAR = 2018;

/** 선택 가능한 연도는 활동 학기(서버 기준)까지만 노출한다 */
const buildYearOptions = (latestYear: number) =>
  Array.from(
    { length: Math.max(latestYear - EARLIEST_YEAR + 1, 1) },
    (_, i) => {
      const year = latestYear - i;

      return {
        value: String(year),
        label: `${year}년`,
      };
    },
  );

const SEMESTER_OPTIONS = [
  { value: "1", label: "1학기" },
  { value: "2", label: "2학기" },
];

export default function TeamPage() {
  // 활동 학기를 받아오기 전에는 조회하지 않는다 (없는 학기를 먼저 보여주지 않기 위함)
  const [active, setActive] = useState<Semester | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [semester, setSemester] = useState<number | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOrganizationChartOpen, setIsOrganizationChartOpen] = useState(false);

  useEffect(() => {
    getCurrentSemester().then((current) => {
      setActive(current);
      setYear(current.act_year);
      setSemester(current.act_semester);
    });
  }, []);

  const fetchTeam = useCallback(async () => {
    if (year === null || semester === null) return;
    setLoading(true);
    try {
      const res = await apiClient
        .get(`api/v1/forif-team/${year}/${semester}`)
        .json<ApiResponse<TeamMember[]>>();
      const data = res.data ?? [];
      setTeam(sortTeamMembers(data));
    } catch {
      setTeam([]);
    } finally {
      setLoading(false);
    }
  }, [year, semester]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  return (
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      <PageHeader
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "동아리", href: "/club" },
          { label: "운영진 소개" },
        ]}
        title="운영진 소개"
        description="지식의 선순환을 실천합니다."
      />

      <div className="mb-8 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
        <div className="flex flex-wrap gap-3">
          <Select
            id="team-year"
            size="sm"
            value={year === null ? "" : String(year)}
            onChange={(v) => setYear(Number(v))}
            placeholder="년도"
            options={buildYearOptions(
              active?.act_year ?? new Date().getFullYear(),
            )}
          />
          <Select
            id="team-semester"
            size="sm"
            value={semester === null ? "" : String(semester)}
            onChange={(v) => setSemester(Number(v))}
            placeholder="학기"
            options={SEMESTER_OPTIONS}
          />
          <Button
            type="button"
            variant="tertiary"
            size="small"
            onClick={() => setIsOrganizationChartOpen(true)}
          >
            조직도로 보기
          </Button>
        </div>
        <p className="max-w-xl text-xs leading-5 text-gray-500 md:text-right">
          * 2024년 2학기 이전 운영진으로 활동하셨다면,{" "}
          {FORIF_CONTACT_INFO.email}로 문의해주세요!
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3 border-border-gray-light bg-gray-5 h-[360px] animate-pulse border"
            />
          ))}
        </div>
      ) : team.length === 0 ? (
        <EmptyState title="해당 학기의 운영진 정보가 없습니다." />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {team.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      )}

      <Modal
        isOpen={isOrganizationChartOpen}
        onClose={() => setIsOrganizationChartOpen(false)}
        title="조직도"
        width="xl"
        showCancelButton={false}
        closeOnOverlayClick={false}
      >
        <Image
          src="/images/organization-chart-2026-2.png"
          alt="FORIF 조직도"
          width={836}
          height={836}
          className="h-auto w-full rounded-lg object-contain"
        />
      </Modal>
    </main>
  );
}
