"use client";

import { useState } from "react";
import { Badge } from "@ui/components/server";
import { Study } from "@/types/study";
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

const WEEK_DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

function getRecruitStatusBadge(status: string) {
  if (status === "APPLICABLE") {
    return { label: "신청중", variant: "primary" as const };
  }
  return { label: "마감", variant: "disabled" as const };
}

function getDifficultyBadge(difficulty: string) {
  const difficultyMap: Record<
    string,
    { label: string; variant: "success" | "warning" | "danger" }
  > = {
    EASY: { label: "초급", variant: "success" },
    SEMI_EASY: { label: "초중급", variant: "success" },
    NORMAL: { label: "중급", variant: "warning" },
    SEMI_HARD: { label: "중상급", variant: "warning" },
    HARD: { label: "고급", variant: "danger" },
  };
  return difficultyMap[difficulty] || { label: difficulty, variant: "warning" };
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
    >
      <path
        d="M8.5 11.5V8.5M8.5 5.5H8.505M15.5 8.5C15.5 12.366 12.366 15.5 8.5 15.5C4.63401 15.5 1.5 12.366 1.5 8.5C1.5 4.63401 4.63401 1.5 8.5 1.5C12.366 1.5 15.5 4.63401 15.5 8.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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
  const recruitBadge = getRecruitStatusBadge(study.recruit_status);
  const difficultyBadge = getDifficultyBadge(study.difficulty);
  const weekDayName = WEEK_DAY_NAMES[study.week_day];

  const curriculumData = [
    {
      week: 1,
      topic: "파이썬 입문 - 변수와 기본 연산",
      contents: [
        "파이썬 설치 및 개발 환경 설정",
        "변수의 개념과 선언 방법",
        "기본 데이터 타입 (정수, 실수, 문자열, 불리언)",
        "간단한 산술 연산과 문자열 연산",
        "실습: 간단한 계산기 프로그램 만들기",
      ],
    },
    {
      week: 2,
      topic: "프로그램의 흐름 제어 - 조건문과 반복문",
      contents: ["if, elif, else를 이용한 조건문"],
    },
    {
      week: 3,
      topic: "코드의 재사용 - 함수",
      contents: ["함수의 정의와 호출"],
    },
  ];

  const resources = [
    {
      title: "LLaMA: Open and Efficient Foundation Language Models",
      category: "링크/자료 연결",
      url: "#",
    },
    {
      title: "Attention Is All You Need",
      category: "논문 자료 연결",
      url: "#",
    },
    {
      title:
        "Adaptive Downstream in Spectrally Shiny REVEALING THE BEHAVIOR OF LARGE LANGUAGE MODELS ON KNOWLEDGE CONFLICT",
      category: "자료 연결/링크",
      url: "#",
    },
  ];

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
                  <Badge
                    label={difficultyBadge.label}
                    variant={difficultyBadge.variant}
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
                {difficultyBadge.label} (하 &lt; 최하 &lt; 중 &lt; 상 &lt; 최상)
              </td>
            </tr>
            <tr>
              <td className="text-text-subtle py-3 pr-3 text-[15px] font-bold leading-[1.5] md:py-4 md:pr-4 md:text-[17px]">
                멘토
              </td>
              <td className="text-text-basic py-3 text-[15px] leading-[1.5] md:py-4 md:text-[17px]">
                {study.primary_mentor_name}
                {study.secondary_mentor_name &&
                  `, ${study.secondary_mentor_name}`}
              </td>
            </tr>
            <tr>
              <td className="text-text-subtle py-3 pr-3 text-[15px] font-bold leading-[1.5] md:py-4 md:pr-4 md:text-[17px]">
                강의 일정
              </td>
              <td className="text-text-basic py-3 text-[15px] leading-[1.5] md:py-4 md:text-[17px]">
                30분 내외 강의 7회
              </td>
            </tr>
            <tr>
              <td className="text-text-subtle py-3 pr-3 text-[15px] font-bold leading-[1.5] md:py-4 md:pr-4 md:text-[17px]">
                강의시간
              </td>
              <td className="text-text-basic py-3 text-[15px] leading-[1.5] md:py-4 md:text-[17px]">
                매주 {weekDayName}요일 {study.start_time} ~ {study.end_time}
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
                </Link>
              </td>
            </tr>
            <tr>
              <td className="text-text-subtle py-3 pr-3 text-[15px] font-bold leading-[1.5] md:py-4 md:pr-4 md:text-[17px]">
                대상
              </td>
              <td className="text-text-basic py-3 text-[15px] leading-[1.5] md:py-4 md:text-[17px]">
                포리프 회원
              </td>
            </tr>
            <tr>
              <td className="text-text-subtle py-3 pr-3 text-[15px] font-bold leading-[1.5] md:py-4 md:pr-4 md:text-[17px]">
                비용 또는비
              </td>
              <td className="py-3 md:py-4">
                <Link
                  href="/fee"
                  className="text-text-primary cursor-pointer text-[15px] leading-[1.5] underline md:text-[17px]"
                >
                  회비 안내 확인
                </Link>
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
            <p
              className={`text-text-basic whitespace-pre-wrap text-[15px] leading-[1.5] md:text-[17px] ${
                !isIntroExpanded ? "line-clamp-6" : ""
              }`}
            >
              {study.explanation}
            </p>
            {!isIntroExpanded && (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[72px] bg-gradient-to-t from-[#f4f5f6] to-transparent" />
            )}
          </div>

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
        </div>
      </section>

      <section
        id="curriculum"
        className="flex scroll-mt-[120px] flex-col gap-6"
      >
        <h2 className="text-text-bolder text-[20px] font-bold leading-[1.5] md:text-[24px]">
          커리큘럼
        </h2>

        <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <div className="min-w-[550px]">
            <div className="flex">
              <div className="text-text-bolder w-[80px] shrink-0 border-b border-[#d6e0eb] bg-[#eef2f7] px-3 py-2 text-[14px] font-bold leading-[1.5] md:w-[120px] md:px-4 md:text-[15px]">
                주차
              </div>
              <div className="text-text-bolder w-[200px] shrink-0 border-b border-[#d6e0eb] bg-[#eef2f7] px-3 py-2 text-[14px] font-bold leading-[1.5] md:w-[320px] md:px-4 md:text-[15px]">
                주제
              </div>
              <div className="text-text-bolder flex-1 border-b border-[#d6e0eb] bg-[#eef2f7] px-3 py-2 text-[14px] font-bold leading-[1.5] md:px-4 md:text-[15px]">
                내용
              </div>
            </div>
            {curriculumData.map((item) =>
              item.contents.map((content, idx) => (
                <div key={`${item.week}-${idx}`} className="flex">
                  <div className="text-text-subtle w-[80px] shrink-0 border-b border-[#cdd1d5] bg-white px-3 py-2 text-[15px] leading-[1.5] md:w-[120px] md:px-4 md:py-3 md:text-[17px]">
                    {idx === 0 ? item.week : ""}
                  </div>
                  <div className="text-text-subtle w-[200px] shrink-0 border-b border-[#cdd1d5] bg-white px-3 py-2 text-[15px] leading-[1.5] md:w-[320px] md:px-4 md:py-3 md:text-[17px]">
                    {idx === 0 ? item.topic : ""}
                  </div>
                  <div className="text-text-subtle flex-1 border-b border-[#cdd1d5] bg-white px-3 py-2 text-[15px] leading-[1.5] md:px-4 md:py-3 md:text-[17px]">
                    {content}
                  </div>
                </div>
              )),
            )}
          </div>
        </div>
      </section>

      <section
        id="process"
        className="flex scroll-mt-[120px] flex-col gap-6 md:gap-10"
      >
        <h2 className="text-text-bolder text-[24px] font-bold leading-[1.5] tracking-[0.5px] md:text-[32px] md:tracking-[1px]">
          신청 방법 및 절차
        </h2>

        <div className="flex flex-col gap-10 md:gap-16">
          <div className="flex flex-col gap-4 md:gap-5">
            <h3 className="text-text-bolder text-[20px] font-bold leading-[1.5] md:text-[24px]">
              신청방법
            </h3>
            <div className="flex items-start gap-2">
              <div className="flex h-[24px] w-5 items-center pl-1 md:h-[26px] md:w-6 md:pl-2">
                <div className="h-1.5 w-1.5 rounded-[4px] bg-[#464c53]" />
              </div>
              <p className="text-text-subtle flex-1 text-[15px] leading-[1.5] md:text-[17px]">
                웹사이트를 통한 온라인 신청
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:gap-5">
            <h3 className="text-text-bolder text-[20px] font-bold leading-[1.5] md:text-[24px]">
              신청 및 처리 절차
            </h3>

            <div className="flex flex-col rounded-[12px] border border-[#b1b8be] bg-white p-4 md:p-8">
              <div className="flex w-full gap-4">
                <div className="flex shrink-0 flex-col items-start px-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#063a74]">
                    <span className="text-[15px] font-bold leading-[1.5] text-white">
                      1
                    </span>
                  </div>
                  <div className="flex flex-1 items-center justify-center self-stretch">
                    <div className="h-full w-px bg-[#d6e0eb]" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[17px] font-bold leading-[1.5] text-[#052b57]">
                      온라인 신청
                    </span>
                    <div className="hidden h-4 w-px bg-[#cdd1d5] md:block" />
                    <span className="text-text-basic text-[15px] leading-[1.5] md:text-[17px]">
                      2025.08.11 - 2025.08.12
                    </span>
                  </div>
                  <p className="text-text-subtle text-[15px] leading-[1.5] md:text-[17px]">
                    웹사이트를 통해 온라인으로 신청해주세요.
                  </p>
                </div>
              </div>

              <div className="flex h-8 w-10 items-center justify-center px-2">
                <div className="h-full w-px bg-[#d6e0eb]" />
              </div>

              <div className="flex w-full gap-4">
                <div className="flex shrink-0 flex-col items-start px-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#063a74]">
                    <span className="text-[15px] font-bold leading-[1.5] text-white">
                      2
                    </span>
                  </div>
                  <div className="flex flex-1 items-center justify-center self-stretch">
                    <div className="h-full w-px bg-[#d6e0eb]" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[17px] font-bold leading-[1.5] text-[#052b57]">
                      개별 면접
                    </span>
                    <div className="hidden h-4 w-px bg-[#cdd1d5] md:block" />
                    <span className="text-text-basic text-[15px] leading-[1.5] md:text-[17px]">
                      2025.08.13
                    </span>
                  </div>
                  <p className="text-text-subtle text-[15px] leading-[1.5] md:text-[17px]">
                    개별적으로 면접 보러 오세요.
                  </p>
                </div>
              </div>

              <div className="flex h-8 w-10 items-center justify-center px-2">
                <div className="h-full w-px bg-[#d6e0eb]" />
              </div>

              <div className="flex w-full gap-4">
                <div className="flex shrink-0 flex-col items-start px-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#063a74]">
                    <span className="text-[15px] font-bold leading-[1.5] text-white">
                      3
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[17px] font-bold leading-[1.5] text-[#052b57]">
                      부원 확정
                    </span>
                    <div className="hidden h-4 w-px bg-[#cdd1d5] md:block" />
                    <span className="text-text-basic text-[15px] leading-[1.5] md:text-[17px]">
                      2025.08.15
                    </span>
                  </div>
                  <p className="text-text-subtle text-[15px] leading-[1.5] md:text-[17px]">
                    카카오톡을 통해 합격 메세지가 전달됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            id="criteria"
            className="flex scroll-mt-[120px] flex-col gap-4 md:gap-6"
          >
            <h3 className="text-text-bolder text-[20px] font-bold leading-[1.5] md:text-[24px]">
              지원 대상 선정 기준
            </h3>

            <div className="flex flex-col gap-3 md:gap-4">
              <h4 className="text-text-bolder text-[17px] font-bold leading-[1.5] md:text-[19px]">
                연구 열정과 시간 투자 가능성
              </h4>

              <div className="flex flex-col gap-2 md:gap-3">
                <div className="flex items-start gap-2">
                  <div className="flex h-[24px] w-5 items-center pl-1 md:h-[26px] md:w-6 md:pl-2">
                    <div className="h-1.5 w-1.5 rounded-[4px] bg-[#464c53]" />
                  </div>
                  <p className="text-text-subtle flex-1 text-[15px] leading-[1.5] md:text-[17px]">
                    저학년/고학년 균형 선발
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex h-[24px] w-5 items-center pl-1 md:h-[26px] md:w-6 md:pl-2">
                    <div className="h-1.5 w-1.5 rounded-[4px] bg-[#464c53]" />
                  </div>
                  <p className="text-text-subtle flex-1 text-[15px] leading-[1.5] md:text-[17px]">
                    서류 탈락 시 개별 연락 및 타 스터디 지원 권장
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 rounded-[10px] border border-[#cdd1d5] bg-[#f4f5f6] p-3 md:rounded-[12px] md:p-4">
                <div className="flex items-center gap-2">
                  <InfoIcon className="h-4 w-4 shrink-0 text-[#464c53]" />
                  <span className="text-text-basic text-[15px] font-bold leading-[1.5] md:text-[17px]">
                    참고
                  </span>
                </div>
                <p className="text-text-subtle pl-6 text-[14px] leading-[1.5] md:pl-7 md:text-[15px]">
                  멘토는 멘티 신청 부원이 신규 부원이 아닐 경우 참여했던
                  스터디의 출석률을 확인할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="location"
        className="flex scroll-mt-[120px] flex-col gap-4 md:gap-6"
      >
        <h2 className="text-text-bolder text-[20px] font-bold leading-[1.5] md:text-[24px]">
          부가 정보
        </h2>

        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-text-basic text-[15px] font-bold leading-[1.5] md:text-[17px]">
              장소
            </h3>
          </div>
          <p className="text-text-basic flex items-center gap-1 text-[15px] leading-[1.5] md:text-[17px]">
            <LocationIcon className="h-4 w-4 shrink-0" />
            한양대학교 서울캠퍼스 학생회관 7층호
          </p>

          <div className="flex h-[200px] w-full items-center justify-center overflow-hidden rounded-[8px] bg-[#e5e8eb] md:h-[300px]">
            <p className="text-text-subtle text-[14px] md:text-[15px]">
              지도 영역 (Kakao Map)
            </p>
          </div>
        </div>
      </section>

      <section id="resources" className="flex scroll-mt-[120px] flex-col gap-6">
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
                  <th className="text-text-subtle w-[80px] px-3 py-3 text-right text-[14px] font-bold leading-[1.5] md:w-[120px] md:px-6 md:py-4 md:text-[15px]">
                    분류
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e8eb]">
                {resources.map((resource, index) => (
                  <tr key={index} className="cursor-pointer hover:bg-[#f8f9fa]">
                    <td className="text-text-basic px-3 py-3 text-[14px] leading-[1.5] md:px-6 md:py-4 md:text-[15px]">
                      <Link
                        href={resource.url}
                        className="cursor-pointer hover:underline"
                      >
                        {resource.title}
                      </Link>
                    </td>
                    <td className="text-text-subtle px-3 py-3 text-right text-[14px] leading-[1.5] md:px-6 md:py-4 md:text-[15px]">
                      {resource.category}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
