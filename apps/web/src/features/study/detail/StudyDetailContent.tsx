"use client";

import { Badge } from "@ui/components/server";
import { Button } from "@ui/components/client";
import { Study } from "@/types/study";
import Link from "next/link";

interface StudyDetailContentProps {
  study: Study;
  onApply: () => void;
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

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
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

export function StudyDetailContent({
  study,
  onApply,
}: StudyDetailContentProps) {
  const recruitBadge = getRecruitStatusBadge(study.recruit_status);
  const difficultyBadge = getDifficultyBadge(study.difficulty);
  const weekDayName = WEEK_DAY_NAMES[study.week_day];

  const curriculumData = [
    {
      week: 1,
      date: "2025.09.01",
      content: "파이썬 기초: 변수, 자료형, 연산자",
      note: "",
      subItems: [
        "파이썬 기초 환경 설정",
        "자료형 소개 (정수, 실수, 문자열, 불리언)",
        "기본 연산자와 문자열 포맷팅",
      ],
    },
    {
      week: 2,
      date: "2025.09.08",
      content: "조건문과 반복문",
      note: "",
      subItems: [
        "조건문 (if, elif, else)",
        "반복문 (for, while)",
        "break, continue 활용",
      ],
    },
    {
      week: 3,
      date: "2025.09.15",
      content: "함수와 모듈",
      note: "",
      subItems: [],
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
    <div className="flex w-full flex-col gap-16">
      <section className="flex gap-12">
        <div className="flex-1">
          <h2 className="text-text-bolder mb-6 text-[24px] font-bold leading-[1.5]">
            스터디 개요
          </h2>

          <table className="w-full">
            <tbody className="divide-y divide-[#e5e8eb]">
              <tr>
                <td className="text-text-subtle w-[120px] whitespace-nowrap py-4 pr-4 text-[17px] font-bold leading-[1.5]">
                  태그
                </td>
                <td className="py-4">
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
                <td className="text-text-subtle py-4 pr-4 text-[17px] font-bold leading-[1.5]">
                  난이도
                </td>
                <td className="text-text-basic py-4 text-[17px] leading-[1.5]">
                  {difficultyBadge.label} (하 &lt; 최하 &lt; 중 &lt; 상 &lt;
                  최상)
                </td>
              </tr>
              <tr>
                <td className="text-text-subtle py-4 pr-4 text-[17px] font-bold leading-[1.5]">
                  멘토
                </td>
                <td className="text-text-basic py-4 text-[17px] leading-[1.5]">
                  {study.primary_mentor_name}
                  {study.secondary_mentor_name &&
                    `, ${study.secondary_mentor_name}`}
                </td>
              </tr>
              <tr>
                <td className="text-text-subtle py-4 pr-4 text-[17px] font-bold leading-[1.5]">
                  강의 일정
                </td>
                <td className="text-text-basic py-4 text-[17px] leading-[1.5]">
                  30분 내외 강의 7회
                </td>
              </tr>
              <tr>
                <td className="text-text-subtle py-4 pr-4 text-[17px] font-bold leading-[1.5]">
                  강의시간
                </td>
                <td className="text-text-basic py-4 text-[17px] leading-[1.5]">
                  매주 {weekDayName}요일 {study.start_time} ~ {study.end_time}
                </td>
              </tr>
              <tr>
                <td className="text-text-subtle py-4 pr-4 text-[17px] font-bold leading-[1.5]">
                  장소
                </td>
                <td className="py-4">
                  <Link
                    href="#location"
                    className="text-text-primary text-[17px] leading-[1.5] underline"
                  >
                    {study.location}
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="text-text-subtle py-4 pr-4 text-[17px] font-bold leading-[1.5]">
                  대상
                </td>
                <td className="text-text-basic py-4 text-[17px] leading-[1.5]">
                  포리프 회원
                </td>
              </tr>
              <tr>
                <td className="text-text-subtle py-4 pr-4 text-[17px] font-bold leading-[1.5]">
                  비용 또는비
                </td>
                <td className="py-4">
                  <Link
                    href="/fee"
                    className="text-text-primary text-[17px] leading-[1.5] underline"
                  >
                    회비 안내 확인
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="sticky top-6 h-fit w-[280px] shrink-0">
          <div className="flex flex-col gap-4 rounded-[12px] border border-[#b1b8be] bg-white p-6">
            <div className="flex flex-col gap-1">
              <p className="text-text-subtle text-[15px] leading-[1.5]">
                이 스터디를 듣고 싶다면
              </p>
              <p className="text-text-bolder text-[19px] font-bold leading-[1.5]">
                지금바로신청하세요!
              </p>
            </div>

            <Button
              variant="primary"
              size="large"
              onClick={onApply}
              disabled={study.recruit_status !== "APPLICABLE"}
              className="h-14 w-full"
            >
              {study.recruit_status === "APPLICABLE"
                ? "스터디 신청"
                : "모집 마감"}
            </Button>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-text-bolder text-[24px] font-bold leading-[1.5]">
          스터디 상세 소개
        </h2>

        <div className="rounded-[12px] border border-[#e5e8eb] bg-[#f8f9fa] p-8">
          <p className="text-text-basic whitespace-pre-wrap text-[17px] leading-[1.8]">
            {study.explanation}
          </p>

          <div className="mt-6 border-t border-[#e5e8eb] pt-6">
            <Link
              href="#"
              className="text-text-primary text-[15px] leading-[1.5] underline"
            >
              스터디 소개 자료 확인 바로가기 →
            </Link>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-text-bolder text-[24px] font-bold leading-[1.5]">
          커리큘럼
        </h2>

        <div className="overflow-hidden rounded-[8px] border border-[#e5e8eb]">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f4f5f6]">
                <th className="text-text-subtle w-[60px] px-4 py-4 text-center text-[15px] font-bold leading-[1.5]">
                  주차
                </th>
                <th className="text-text-subtle w-[140px] px-4 py-4 text-left text-[15px] font-bold leading-[1.5]">
                  일시
                </th>
                <th className="text-text-subtle px-4 py-4 text-left text-[15px] font-bold leading-[1.5]">
                  강의내용
                </th>
                <th className="text-text-subtle w-[160px] px-4 py-4 text-left text-[15px] font-bold leading-[1.5]">
                  비고
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e8eb]">
              {curriculumData.map((item) => (
                <tr key={item.week}>
                  <td className="text-text-basic px-4 py-4 text-center text-[15px] leading-[1.5]">
                    {item.week}
                  </td>
                  <td className="text-text-basic px-4 py-4 text-[15px] leading-[1.5]">
                    {item.date} ({weekDayName})
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-text-basic text-[15px] font-medium leading-[1.5]">
                        {item.content}
                      </span>
                      {item.subItems.length > 0 && (
                        <ul className="text-text-subtle list-inside list-disc text-[13px] leading-[1.6]">
                          {item.subItems.map((subItem, idx) => (
                            <li key={idx}>{subItem}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </td>
                  <td className="text-text-subtle px-4 py-4 text-[15px] leading-[1.5]">
                    {item.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-text-bolder text-[24px] font-bold leading-[1.5]">
          신청 방법 및 절차
        </h2>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
              신청방법
            </h3>
            <ul className="text-text-basic list-inside list-disc text-[17px] leading-[1.8]">
              <li>포리프 홈페이지 통해 온라인 신청</li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
              신청 및 자격 발표
            </h3>

            <div className="flex flex-col rounded-[12px] border border-[#b1b8be] bg-white p-8">
              <div className="flex w-full gap-4">
                <div className="flex shrink-0 flex-col items-center px-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#063a74]">
                    <span className="text-[15px] font-bold leading-[1.5] text-white">
                      1
                    </span>
                  </div>
                  <div className="flex flex-1 items-center justify-center">
                    <div className="h-full w-px bg-[#d6e0eb]" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[17px] font-bold leading-[1.5] text-[#052b57]">
                      온라인 신청
                    </span>
                    <div className="h-4 w-px bg-[#cdd1d5]" />
                    <span className="text-text-basic text-[17px] leading-[1.5]">
                      2025.08.11 - 2025.08.12
                    </span>
                  </div>
                  <p className="text-text-subtle text-[17px] leading-[1.5]">
                    웹사이트를 통해 온라인으로 신청해주세요.
                  </p>
                </div>
              </div>

              <div className="flex h-8 w-10 items-center justify-center px-2">
                <div className="h-full w-px bg-[#d6e0eb]" />
              </div>

              <div className="flex w-full gap-4">
                <div className="flex shrink-0 flex-col items-center px-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#063a74]">
                    <span className="text-[15px] font-bold leading-[1.5] text-white">
                      2
                    </span>
                  </div>
                  <div className="flex flex-1 items-center justify-center">
                    <div className="h-full w-px bg-[#d6e0eb]" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[17px] font-bold leading-[1.5] text-[#052b57]">
                      개별 면접
                    </span>
                    <div className="h-4 w-px bg-[#cdd1d5]" />
                    <span className="text-text-basic text-[17px] leading-[1.5]">
                      2025.08.13
                    </span>
                  </div>
                  <p className="text-text-subtle text-[17px] leading-[1.5]">
                    개별적으로 면접 보러 오세요.
                  </p>
                </div>
              </div>

              <div className="flex h-8 w-10 items-center justify-center px-2">
                <div className="h-full w-px bg-[#d6e0eb]" />
              </div>

              <div className="flex w-full gap-4">
                <div className="flex shrink-0 flex-col items-center px-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#063a74]">
                    <span className="text-[15px] font-bold leading-[1.5] text-white">
                      3
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[17px] font-bold leading-[1.5] text-[#052b57]">
                      부원 확정
                    </span>
                    <div className="h-4 w-px bg-[#cdd1d5]" />
                    <span className="text-text-basic text-[17px] leading-[1.5]">
                      2025.08.15
                    </span>
                  </div>
                  <p className="text-text-subtle text-[17px] leading-[1.5]">
                    카카오톡을 통해 합격 메세지가 전달됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-text-bolder text-[24px] font-bold leading-[1.5]">
          자격 대상 선정 기준
        </h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
              한 구 참석가능 시간 자격요건
            </h3>
            <p className="text-text-basic text-[17px] leading-[1.8]">
              스터디 시간에 맞춰 참석 가능해야 합니다.
            </p>
            <ul className="text-text-basic ml-4 list-inside list-disc text-[17px] leading-[1.8]">
              <li>
                스터디 참석률 80% 이상 유지 (총 8주 중 7회 이상 출석 필수)
              </li>
            </ul>
          </div>

          <div className="flex items-start gap-3 rounded-[8px] bg-[#fff8e6] p-4">
            <WarningIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#b8860b]" />
            <p className="text-[15px] leading-[1.5] text-[#8b6914]">
              참고로, 포리프 회원 가입이 되어 있지 않은 분은 신청이 불가합니다
              (스터디 시작 전 회원 가입 필수)
            </p>
          </div>
        </div>
      </section>

      <section id="location" className="flex flex-col gap-6">
        <h2 className="text-text-bolder text-[24px] font-bold leading-[1.5]">
          부가 정보
        </h2>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-text-basic text-[17px] font-bold leading-[1.5]">
              장소
            </h3>
          </div>
          <p className="text-text-basic flex items-center gap-1 text-[17px] leading-[1.5]">
            <LocationIcon className="h-4 w-4" />
            한양대학교 서울캠퍼스 학생회관 7층호
          </p>

          <div className="flex h-[300px] w-full items-center justify-center overflow-hidden rounded-[8px] bg-[#e5e8eb]">
            <p className="text-text-subtle text-[15px]">
              지도 영역 (Kakao Map)
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-text-bolder text-[24px] font-bold leading-[1.5]">
          관련 자료
        </h2>

        <div className="overflow-hidden rounded-[8px] border border-[#e5e8eb]">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f4f5f6]">
                <th className="text-text-subtle px-6 py-4 text-left text-[15px] font-bold leading-[1.5]">
                  제목
                </th>
                <th className="text-text-subtle w-[120px] px-6 py-4 text-right text-[15px] font-bold leading-[1.5]">
                  분류
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e8eb]">
              {resources.map((resource, index) => (
                <tr key={index} className="cursor-pointer hover:bg-[#f8f9fa]">
                  <td className="text-text-basic px-6 py-4 text-[15px] leading-[1.5]">
                    <Link href={resource.url} className="hover:underline">
                      {resource.title}
                    </Link>
                  </td>
                  <td className="text-text-subtle px-6 py-4 text-right text-[15px] leading-[1.5]">
                    {resource.category}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
