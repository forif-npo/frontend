"use client";

import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import { Select } from "@ui/components/client";
import { Badge, Breadcrumb } from "@ui/components/server";
import Image from "next/image";
import { safeImageSrc } from "@/utils/image";

interface TeamMember {
  id: number;
  user_id: number;
  user_name: string;
  phone_num: string;
  act_year: number;
  act_semester: number;
  user_title: string | null;
  club_department: string | null;
  intro_tag: string | null;
  self_intro: string | null;
  prof_img_url: string | null;
  graduate_year: number | null;
}

const DEFAULT_YEAR = 2026;
const DEFAULT_SEMESTER = 1;
const LATEST_YEAR = 2026;
const EARLIEST_YEAR = 2018;
const DEFAULT_PROFILE_IMAGE_SRC = "/forif-circle.svg";

const YEAR_OPTIONS = Array.from(
  { length: LATEST_YEAR - EARLIEST_YEAR + 1 },
  (_, i) => {
    const year = LATEST_YEAR - i;

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

const TITLE_PRIORITY: Record<string, number> = {
  회장: 1,
  부회장: 2,
  팀장: 3,
};

const getTitlePriority = (title: string | null) =>
  title ? (TITLE_PRIORITY[title] ?? 4) : 4;

export default function TeamPage() {
  const [year, setYear] = useState(DEFAULT_YEAR);
  const [semester, setSemester] = useState(DEFAULT_SEMESTER);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeam = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient
        .get(`api/v1/forif-team/${year}/${semester}`)
        .json<ApiResponse<TeamMember[]>>();
      const data = res.data ?? [];
      const sorted = [...data].sort(
        (a, b) =>
          getTitlePriority(a.user_title) - getTitlePriority(b.user_title),
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
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "홈", href: "/" },
            { label: "동아리", href: "/club" },
            { label: "운영진 소개" },
          ]}
        />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">운영진 소개</h1>
        <p className="mt-2 text-sm text-gray-500">
          지식의 선순환을 실천합니다.
        </p>
      </div>

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
        <p className="max-w-xl text-xs leading-5 text-gray-500 md:text-right">
          * 2024년 2학기 이전 운영진으로 활동하셨다면, contact@forif.org로
          문의해주세요!
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3 border-border-gray-light h-[360px] animate-pulse border bg-gray-100"
            />
          ))}
        </div>
      ) : team.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-500">
          해당 학기의 운영진 정보가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {team.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </main>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  const [hovered, setHovered] = useState(false);
  const profileImageSrc =
    safeImageSrc(member.prof_img_url) ?? DEFAULT_PROFILE_IMAGE_SRC;
  const [imageSrc, setImageSrc] = useState(profileImageSrc);
  const overlayText = [
    `${member.act_year}-${member.act_semester}`,
    member.club_department,
    member.user_title,
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    setImageSrc(profileImageSrc);
  }, [profileImageSrc]);

  return (
    <div
      className="rounded-3 border-border-gray-light bg-surface-white focus-visible:ring-primary-20 relative flex cursor-pointer flex-col overflow-hidden border px-6 pb-6 pt-14 text-center shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered((prev) => !prev)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setHovered((prev) => !prev);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${member.user_name} 운영진 정보`}
    >
      <div className="mx-auto mb-5 flex justify-center">
        <Image
          src={imageSrc}
          alt={member.user_name || "FORIF 운영진"}
          width={120}
          height={120}
          className="h-[120px] w-[120px] rounded-full object-cover"
          onError={() => {
            if (imageSrc !== DEFAULT_PROFILE_IMAGE_SRC) {
              setImageSrc(DEFAULT_PROFILE_IMAGE_SRC);
            }
          }}
        />
      </div>

      <div className="flex min-h-[140px] flex-col items-center justify-center">
        <p className="text-text-basic text-xl font-bold">{member.user_name}</p>
        <p className="text-text-subtle mb-3 text-sm">
          {member.club_department}
        </p>
        <div className="mb-3 flex flex-wrap justify-center gap-1.5">
          {member.user_title && (
            <Badge
              label={member.user_title}
              variant="primary"
              appearance="solid-pastel"
              size="small"
            />
          )}
          {member.intro_tag && (
            <Badge
              label={member.intro_tag}
              variant="info"
              appearance="solid-pastel"
              size="small"
            />
          )}
        </div>
        <p className="text-text-subtle line-clamp-2 text-sm">
          {member.self_intro}
        </p>
      </div>

      <div
        className={`pointer-events-none absolute inset-0 flex items-center justify-center bg-gray-900/75 px-6 transition-opacity duration-300 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-sm font-semibold leading-6 text-white">
          {overlayText}
        </p>
      </div>
    </div>
  );
}
