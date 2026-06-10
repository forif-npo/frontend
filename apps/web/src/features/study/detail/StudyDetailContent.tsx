"use client";

import { useState, useRef, useEffect } from "react";
import { Badge } from "@ui/components/server";
import { Study } from "@/types/study";
import { KakaoMap } from "@/components/KakaoMap";
import { AnnouncementMarkdown } from "@/features/support/announcements/components/AnnouncementMarkdown";
import {
  formatStudyTimeRange,
  getDifficultyLabel,
  getRecruitStatusLabel,
  getRecruitStatusBadgeVariant,
  getWeekDayLabel,
} from "@/constants/study";
import Link from "next/link";

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
    >
      <path
        d="M4.5 6.5L8.5 10.5L12.5 6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface StudyDetailContentProps {
  study: Study;
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M8 8.5C9.10457 8.5 10 7.60457 10 6.5C10 5.39543 9.10457 4.5 8 4.5C6.89543 4.5 6 5.39543 6 6.5C6 7.60457 6.89543 8.5 8 8.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 14.5C8 14.5 13 10.5 13 6.5C13 3.73858 10.7614 1.5 8 1.5C5.23858 1.5 3 3.73858 3 6.5C3 10.5 8 14.5 8 14.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StudyDetailContent({ study }: StudyDetailContentProps) {
  const [isIntroExpanded, setIsIntroExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = introRef.current;
    if (el) {
      setIsClamped(el.scrollHeight > el.clientHeight + 2);
    }
  }, [study.explanation]);

  const recruitBadge = {
    label: getRecruitStatusLabel(study.recruit_status),
    variant: getRecruitStatusBadgeVariant(study.recruit_status),
  };
  const weekDayName = getWeekDayLabel(study.week_day);
  const difficultyLabel = getDifficultyLabel(study.difficulty);

  const plans = study.plans ?? [];
  const references = study.references ?? [];

  const visiblePlans = plans;

  const mentorNames =
    study.mentors && study.mentors.length > 0
      ? study.mentors.map((m) => m.mentor_name).join(", ")
      : [study.primary_mentor_name, study.secondary_mentor_name]
          .filter(Boolean)
          .join(", ");

  return (
    <div className="flex w-full flex-col gap-10 md:gap-16">
      <section id="overview" className="scroll-mt-[120px]">
        <h2 className="text-text-bolder mb-4 text-[20px] font-bold leading-[1.5] md:mb-6 md:text-[24px]">
          스터디 개요
        </h2>

        <table className="w-full">
          <tbody className="divide-y divide-[#e5e8eb]">
            <tr>
              <td className="text-text-subtle w-[80px] whitespace-nowrap py-3 pr-3 text-[15px] font-bold leading-[1.5] md:w-[120px] md:py-4 md:pr-4 md:text-[17px]">
                태그
              </td>
              <td className="py-3 md:py-4">
                <div className="flex flex-wrap items-center gap-1">
                  <Badge
                    label={recruitBadge.label}
                    variant={recruitBadge.variant}
                    appearance="solid-pastel"
                    size="medium"
                  />
                  {study.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      label={tag}
                      variant="primary"
                      appearance="solid-pastel"
                      size="medium"
                    />
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td className="text-text-subtle py-3 pr-3 text-[15px] font-bold leading-[1.5] md:py-4 md:pr-4 md:text-[17px]">
                난이도
              </td>
              <td className="text-text-basic py-3 text-[15px] leading-[1.5] md:py-4 md:text-[17px]">
                {difficultyLabel}
              </td>
            </tr>
            {study.goal && (
              <tr>
                <td className="text-text-subtle py-3 pr-3 text-[15px] font-bold leading-[1.5] md:py-4 md:pr-4 md:text-[17px]">
                  목표
                </td>
                <td className="text-text-basic py-3 text-[15px] leading-[1.5] md:py-4 md:text-[17px]">
                  {study.goal}
                </td>
              </tr>
            )}
            <tr>
              <td className="text-text-subtle py-3 pr-3 text-[15px] font-bold leading-[1.5] md:py-4 md:pr-4 md:text-[17px]">
                요일/시간
              </td>
              <td className="text-text-basic py-3 text-[15px] leading-[1.5] md:py-4 md:text-[17px]">
                매주 {weekDayName}요일{" "}
                {formatStudyTimeRange(study.start_time, study.end_time)}
              </td>
            </tr>
            <tr>
              <td className="text-text-subtle py-3 pr-3 text-[15px] font-bold leading-[1.5] md:py-4 md:pr-4 md:text-[17px]">
                장소
              </td>
              <td className="py-3 md:py-4">
                <Link
                  href="#location"
                  className="text-text-primary cursor-pointer text-[15px] leading-[1.5] underline md:text-[17px]"
                >
                  {study.location}
                  {study.location_detail && ` ${study.location_detail}`}
                </Link>
              </td>
            </tr>
            <tr>
              <td className="text-text-subtle py-3 pr-3 text-[15px] font-bold leading-[1.5] md:py-4 md:pr-4 md:text-[17px]">
                멘토
              </td>
              <td className="text-text-basic py-3 text-[15px] leading-[1.5] md:py-4 md:text-[17px]">
                {mentorNames}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="intro" className="flex scroll-mt-[120px] flex-col gap-6">
        <h2 className="text-text-bolder text-[20px] font-bold leading-[1.5] md:text-[24px]">
          스터디 상세 소개
        </h2>

        <div className="flex flex-col items-center gap-4 rounded-[12px] bg-[#f4f5f6] p-4 md:gap-6 md:p-8">
          <div className="relative w-full overflow-hidden">
            <div
              ref={introRef}
              className={`${!isIntroExpanded && isClamped ? "line-clamp-6" : ""}`}
            >
              <AnnouncementMarkdown content={study.explanation} />
            </div>
            {!isIntroExpanded && isClamped && (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[72px] bg-gradient-to-t from-[#f4f5f6] to-transparent" />
            )}
          </div>

          {isClamped && (
            <>
              <div className="h-px w-full bg-[#cdd1d5]" />

              <button
                onClick={() => setIsIntroExpanded(!isIntroExpanded)}
                className="text-text-basic flex cursor-pointer items-center gap-1 text-[15px] leading-[1.5] md:text-[17px]"
              >
                {isIntroExpanded ? "접기" : "스터디 소개 자세히 보기"}
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform ${isIntroExpanded ? "rotate-180" : ""}`}
                />
              </button>
            </>
          )}
        </div>
      </section>

      {visiblePlans.length > 0 && (
        <section
          id="curriculum"
          className="flex scroll-mt-[120px] flex-col gap-6"
        >
          <h2 className="text-text-bolder text-[20px] font-bold leading-[1.5] md:text-[24px]">
            커리큘럼
          </h2>

          <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
            <div className="min-w-[400px]">
              <div className="flex">
                <div className="text-text-bolder w-[64px] shrink-0 border-b border-[#d6e0eb] bg-[#eef2f7] px-3 py-2 text-[14px] font-bold leading-[1.5] md:w-[80px] md:px-4 md:text-[15px]">
                  주차
                </div>
                <div className="text-text-bolder flex-1 border-b border-[#d6e0eb] bg-[#eef2f7] px-3 py-2 text-[14px] font-bold leading-[1.5] md:px-4 md:text-[15px]">
                  주제
                </div>
                {visiblePlans.some((p) => p.content) && (
                  <div className="text-text-bolder flex-1 border-b border-[#d6e0eb] bg-[#eef2f7] px-3 py-2 text-[14px] font-bold leading-[1.5] md:px-4 md:text-[15px]">
                    내용
                  </div>
                )}
              </div>
              {visiblePlans.map((plan) => (
                <div key={plan.id} className="flex">
                  <div className="text-text-subtle w-[64px] shrink-0 border-b border-[#cdd1d5] bg-white px-3 py-2 text-[15px] leading-[1.5] md:w-[80px] md:px-4 md:py-3 md:text-[17px]">
                    {plan.week_num}
                  </div>
                  <div className="text-text-subtle flex-1 border-b border-[#cdd1d5] bg-white px-3 py-2 text-[15px] leading-[1.5] md:px-4 md:py-3 md:text-[17px]">
                    {plan.section === "." ? "" : plan.section}
                  </div>
                  {visiblePlans.some((p) => p.content) && (
                    <div className="text-text-subtle flex-1 border-b border-[#cdd1d5] bg-white px-3 py-2 text-[15px] leading-[1.5] md:px-4 md:py-3 md:text-[17px]">
                      {plan.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="process" className="flex scroll-mt-[120px] flex-col gap-6">
        <h2 className="text-text-bolder text-[20px] font-bold leading-[1.5] md:text-[24px]">
          신청 방법
        </h2>

        <div className="flex items-start gap-2">
          <div className="flex h-[24px] w-5 items-center pl-1 md:h-[26px] md:w-6 md:pl-2">
            <div className="h-1.5 w-1.5 rounded-[4px] bg-[#464c53]" />
          </div>
          <p className="text-text-subtle flex-1 text-[15px] leading-[1.5] md:text-[17px]">
            웹사이트를 통한 온라인 신청
          </p>
        </div>

        {study.requires_interview && (
          <div className="flex items-start gap-2">
            <div className="flex h-[24px] w-5 items-center pl-1 md:h-[26px] md:w-6 md:pl-2">
              <div className="h-1.5 w-1.5 rounded-[4px] bg-[#464c53]" />
            </div>
            <p className="text-text-subtle flex-1 text-[15px] leading-[1.5] md:text-[17px]">
              개별 면접 진행
            </p>
          </div>
        )}
      </section>

      {study.selection_criteria && (
        <section
          id="criteria"
          className="flex scroll-mt-[120px] flex-col gap-4 md:gap-6"
        >
          <h2 className="text-text-bolder text-[20px] font-bold leading-[1.5] md:text-[24px]">
            지원 대상 선정 기준
          </h2>
          <p className="text-text-subtle text-[15px] leading-[1.5] md:text-[17px]">
            {study.selection_criteria}
          </p>
        </section>
      )}

      <section
        id="location"
        className="flex scroll-mt-[120px] flex-col gap-4 md:gap-6"
      >
        <h2 className="text-text-bolder text-[20px] font-bold leading-[1.5] md:text-[24px]">
          부가 정보
        </h2>

        <div className="flex flex-col gap-3 md:gap-4">
          <h3 className="text-text-basic text-[15px] font-bold leading-[1.5] md:text-[17px]">
            장소
          </h3>
          <p className="text-text-basic flex items-center gap-1 text-[15px] leading-[1.5] md:text-[17px]">
            <LocationIcon className="h-4 w-4 shrink-0" />
            {study.location}
            {study.location_detail && ` ${study.location_detail}`}
          </p>

          <KakaoMap placeName={study.location} />
        </div>
      </section>

      {references.length > 0 && (
        <section
          id="resources"
          className="flex scroll-mt-[120px] flex-col gap-6"
        >
          <h2 className="text-text-bolder text-[20px] font-bold leading-[1.5] md:text-[24px]">
            관련 자료
          </h2>

          <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
            <div className="min-w-[360px] overflow-hidden rounded-[8px] border border-[#e5e8eb]">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f4f5f6]">
                    <th className="text-text-subtle px-3 py-3 text-left text-[14px] font-bold leading-[1.5] md:px-6 md:py-4 md:text-[15px]">
                      제목
                    </th>
                    {references.some((r) => r.category) && (
                      <th className="text-text-subtle w-[80px] px-3 py-3 text-right text-[14px] font-bold leading-[1.5] md:w-[120px] md:px-6 md:py-4 md:text-[15px]">
                        분류
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e8eb]">
                  {references.map((resource, index) => (
                    <tr
                      key={index}
                      className="cursor-pointer hover:bg-[#f8f9fa]"
                    >
                      <td className="text-text-basic px-3 py-3 text-[14px] leading-[1.5] md:px-6 md:py-4 md:text-[15px]">
                        {resource.url ? (
                          <Link
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cursor-pointer hover:underline"
                          >
                            {resource.title}
                          </Link>
                        ) : (
                          resource.title
                        )}
                      </td>
                      {references.some((r) => r.category) && (
                        <td className="text-text-subtle px-3 py-3 text-right text-[14px] leading-[1.5] md:px-6 md:py-4 md:text-[15px]">
                          {resource.category}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
