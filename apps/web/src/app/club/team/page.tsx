"use client";

import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import { Select } from "@ui/components/client";
import { Breadcrumb } from "@ui/components/server";
import Image from "next/image";

interface TeamMember {
  act_year: number;
  act_semester: number;
  user_title: string;
  club_department: string;
  intro_tag: string | null;
  self_intro: string | null;
  prof_img_url: string | null;
  user: {
    id: number;
    name: string;
  };
}

const CURRENT_YEAR = 2025;
const CURRENT_SEMESTER = 2;

const YEAR_OPTIONS = Array.from({ length: 8 }, (_, i) => ({
  value: String(CURRENT_YEAR - i),
  label: `${CURRENT_YEAR - i}년`,
}));

const SEMESTER_OPTIONS = [
  { value: "1", label: "1학기" },
  { value: "2", label: "2학기" },
];

const TITLE_PRIORITY: Record<string, number> = {
  회장: 1,
  부회장: 2,
  팀장: 3,
};

export default function TeamPage() {
  const [year, setYear] = useState(CURRENT_YEAR);
  const [semester, setSemester] = useState(CURRENT_SEMESTER);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeam = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient
        .get("api/v1/forif-team", {
          searchParams: { year, semester },
        })
        .json<ApiResponse<TeamMember[]>>();
      const data = res.data ?? [];
      const sorted = [...data].sort(
        (a, b) =>
          (TITLE_PRIORITY[a.user_title] ?? 4) -
          (TITLE_PRIORITY[b.user_title] ?? 4),
      );
      setTeam(sorted);
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
    <div className="mx-auto max-w-[1100px] px-6 py-20">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "홈", href: "/" },
            { label: "동아리", href: "/club" },
            { label: "운영진 소개" },
          ]}
        />
      </div>

      {/* Title */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">FORIF TEAM</h1>
        <p className="mt-2 text-sm text-gray-500">
          지식의 선순환을 실천합니다.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
        <div className="flex gap-3">
          <Select
            id="team-year"
            size="sm"
            value={String(year)}
            onChange={(v) => setYear(Number(v))}
            placeholder="년도"
            options={YEAR_OPTIONS}
          />
          <Select
            id="team-semester"
            size="sm"
            value={String(semester)}
            onChange={(v) => setSemester(Number(v))}
            placeholder="학기"
            options={SEMESTER_OPTIONS}
          />
        </div>
        <p className="text-xs text-gray-400">
          * 2024년 2학기 이전 운영진으로 활동하셨다면, contact@forif.org로
          문의해주세요!
        </p>
      </div>

      {/* Team Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[360px] animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>
      ) : team.length === 0 ? (
        <div className="py-20 text-center text-gray-400">
          해당 학기의 운영진 정보가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {team.map((member) => (
            <TeamCard key={member.user.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-gray-200 p-6 text-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered((prev) => !prev)}
    >
      {/* Profile Image */}
      <div className="mx-auto mb-4 flex justify-center">
        <Image
          src={member.prof_img_url || "/forif-circle.png"}
          alt={member.user.name}
          width={120}
          height={120}
          className="h-[120px] w-[120px] rounded-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex min-h-[140px] flex-col items-center justify-center">
        <p className="text-xl font-bold">{member.user.name}</p>
        <p className="mb-2 text-sm text-gray-500">{member.club_department}</p>
        <div className="mb-2 flex flex-wrap justify-center gap-1.5">
          {member.user_title && (
            <span className="rounded-full bg-[#1D40BA] px-3 py-1 text-xs font-medium text-white">
              {member.user_title}
            </span>
          )}
          {member.intro_tag && (
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              {member.intro_tag}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">{member.self_intro}</p>
      </div>

      {/* Hover Overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black/70 transition-opacity duration-300 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-lg font-bold text-white">
          {member.act_year}-{member.act_semester} {member.club_department}{" "}
          {member.user_title}
        </p>
      </div>
    </div>
  );
}
