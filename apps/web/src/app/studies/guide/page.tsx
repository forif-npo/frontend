"use client";

import { useState } from "react";
import Link from "next/link";
import { Heading } from "@ui/components/server";
import {
  PROGRAMMING_CARDS,
  RECOMMENDATION_QUESTIONS,
  GUIDE_TABS,
  type ProgrammingCard,
} from "@/constants/study-guide";

// --- Components ---

function FlippableCard({ card }: { card: ProgrammingCard }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="cursor-pointer"
      style={{ perspective: "1000px", height: 200 }}
      onClick={() => setIsFlipped((v) => !v)}
    >
      <div
        className="relative h-full w-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-4 text-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <p className="break-keep text-base font-bold text-gray-900">
            {card.title}
          </p>
          <p className="mt-2 text-xs text-gray-400">클릭하여 자세히 보기</p>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 overflow-auto rounded-xl border border-gray-200 bg-white p-4"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <p className="whitespace-pre-wrap text-xs leading-6 text-gray-700">
            {card.content}
          </p>
        </div>
      </div>
    </div>
  );
}

function RecommendationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  if (!open) return null;

  const isFinished = step >= RECOMMENDATION_QUESTIONS.length;

  const handleAnswer = (option: string) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);
    setStep(step + 1);
  };

  const handleReset = () => {
    setStep(0);
    setAnswers([]);
  };

  const q = RECOMMENDATION_QUESTIONS[step];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>

        {isFinished ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-lg font-bold text-gray-900">
              스터디 추천이 완료되었어요!
            </p>
            <p className="text-sm text-gray-500">
              스터디 목록에서 관심 있는 스터디를 찾아보세요.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleReset}
                className="rounded-lg border border-gray-300 px-5 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                다시 하기
              </button>
              <Link
                href="/studies/list"
                onClick={onClose}
                className="rounded-lg bg-[#1D40BA] px-5 py-2 text-sm text-white hover:bg-[#1634a0]"
              >
                스터디 목록 보기
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#1D40BA]">
                {q.title}
              </span>
              <span className="text-xs text-gray-400">
                {step + 1} / {RECOMMENDATION_QUESTIONS.length}
              </span>
            </div>
            <p className="text-sm font-medium leading-6 text-gray-900">
              {q.text}
            </p>
            <div className="flex flex-col gap-2">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className="rounded-lg border border-gray-200 px-4 py-3 text-left text-sm text-gray-700 hover:border-[#1D40BA] hover:bg-blue-50"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudyGuidePage() {
  const [activeTab, setActiveTab] = useState("introduction");
  const [modalOpen, setModalOpen] = useState(false);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div>
      <div className="border-b border-gray-100 bg-[#F5F7FF] px-6 py-16 text-center">
        <Heading size="l">스터디 가이드</Heading>
        <p className="mt-2 text-sm text-gray-500">
          나에게 맞는 스터디를 찾아보세요!
        </p>
      </div>

      <div
        id="introduction"
        className="max-w-main mx-auto px-4 py-6 md:px-8 xl:px-12"
      >
        {/* Sticky Tabs */}
        <div className="sticky top-0 z-10 -mx-4 overflow-x-auto bg-white px-4 md:-mx-8 md:px-8 xl:-mx-12 xl:px-12">
          <div className="flex border-b border-gray-200">
            {GUIDE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`shrink-0 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-[#1D40BA] text-[#1D40BA]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-8 pt-6">
          {/* Main Content */}
          <div className="min-w-0 flex-1">
            {/* 스터디 소개 */}
            <section>
              <p className="text-sm font-medium text-gray-500">스터디 소개</p>
              <h2 className="mb-3 mt-1 text-2xl font-bold text-gray-900">
                프로그래밍이 뭔가요?
              </h2>
              <p className="text-sm leading-7 text-gray-700">
                프로그래밍은 다양한 분야로 나뉘며, 각 분야마다 특징적인 기술과
                도구를 사용합니다.
                <br />
                다음은 주요 프로그래밍 분야들입니다.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
                {PROGRAMMING_CARDS.map((card) => (
                  <FlippableCard key={card.id} card={card} />
                ))}
              </div>
            </section>

            {/* 스터디 운영 방식 */}
            <section id="ongoing" className="mt-12">
              <p className="text-sm font-medium text-gray-500">
                스터디 운영 방식
              </p>
              <h2 className="mb-3 mt-1 text-2xl font-bold text-gray-900">
                스터디 진행 방식
              </h2>
              <div className="flex flex-col gap-4">
                <p className="text-sm leading-7 text-gray-700">
                  포리프의 스터디는 크게 &apos;정규스터디&apos;와
                  &apos;자율스터디&apos;로 나누어집니다. 정규스터디는 또다시
                  강의형과 프로젝트형으로 나누어집니다.
                </p>

                {/* 정규 스터디 */}
                <div>
                  <p className="font-semibold text-gray-800">1. 정규 스터디</p>
                  <p className="mt-1 text-sm leading-7 text-gray-700">
                    매 학기가 시작하며 다양한 지식을 갖춘 멘토님들이 스터디를
                    개설합니다. 이렇게 개설되는 스터디를
                    &apos;정규스터디&apos;라고 합니다.
                  </p>
                  <ul className="mt-3 flex flex-col gap-3">
                    {[
                      { label: "모집", desc: "3월 / 9월 초 부원 모집 기간" },
                      {
                        label: "진행 횟수",
                        desc: "총 15주 중 중간고사 / 기말고사 기간을 고려하여 8주 이상의 스터디가 진행됩니다.",
                      },
                      {
                        label: "진행 일시",
                        desc: "주 1회, 멘토가 지정한 요일과 시간에 진행됩니다.",
                      },
                      {
                        label: "개설 스터디",
                        desc: "개설 스터디는 매 학기마다 다르며, 포리프는 매 학기 다양한 분야의 스터디가 개설되고 있습니다.",
                      },
                    ].map((item) => (
                      <li key={item.label} className="flex gap-4">
                        <span className="w-20 shrink-0 text-sm font-semibold text-gray-900">
                          {item.label}
                        </span>
                        <span className="text-sm leading-7 text-gray-700">
                          {item.desc}
                        </span>
                      </li>
                    ))}
                    <li className="flex gap-4">
                      <span className="w-20 shrink-0 text-sm font-semibold text-gray-900">
                        진행 방식
                      </span>
                      <div className="text-sm leading-7 text-gray-700">
                        <p>강의형과 프로젝트형으로 나누어집니다.</p>
                        <p className="mt-1 text-xs text-gray-500">
                          - 강의형: 다인원을 대상으로 이루어지며, 멘토가
                          강의식으로 수업을 진행합니다. 일반적으로 기초스터디가
                          이에 해당합니다.
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          - 프로젝트형: 소규모로 진행되며, 프로젝트 결과물을
                          만들어내는 것을 중심으로 진행됩니다. 기본적인
                          프로그래밍 능력이 요구됩니다.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="w-20 shrink-0 text-sm font-semibold text-gray-900">
                        혜택
                      </span>
                      <span className="text-sm leading-7 text-gray-700">
                        일정 요건 충족 시 수료증이 발급됩니다.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 자율 스터디 */}
                <div className="mt-4">
                  <p className="font-semibold text-gray-800">2. 자율 스터디</p>
                  <p className="mt-1 text-sm leading-7 text-gray-700">
                    자율 스터디는 정규 스터디와는 다르게 학기가 시작된 후
                    부원들의 수요에 따라 개설되는 스터디입니다. 일반적으로
                    &apos;멘토&apos;는 존재하지 않으며, 함께 공부할 사람들이
                    모여 스터디를 진행합니다.
                  </p>
                  <ul className="mt-3 flex flex-col gap-3">
                    {[
                      { label: "모집", desc: "3월 / 9월 중순" },
                      {
                        label: "진행 횟수 및 일시",
                        desc: "스터디원들간의 조율로 진행 계획을 세웁니다.",
                      },
                      {
                        label: "개설 방법",
                        desc: "운영진측에 스터디 계획서를 제출하면 스터디 홍보가 진행됩니다.",
                      },
                    ].map((item) => (
                      <li key={item.label} className="flex gap-4">
                        <span className="w-24 shrink-0 text-sm font-semibold text-gray-900">
                          {item.label}
                        </span>
                        <span className="text-sm leading-7 text-gray-700">
                          {item.desc}
                        </span>
                      </li>
                    ))}
                    <li className="flex gap-4">
                      <span className="w-24 shrink-0 text-sm font-semibold text-gray-900">
                        혜택
                      </span>
                      <div className="text-sm leading-7 text-gray-700">
                        <p>스터디 별 기준에 따라 최대 5만원 지급</p>
                        <p className="mt-1 text-xs text-gray-500">
                          * 자율스터디 수강은 포리프 인증서가 발급되지 않습니다.
                        </p>
                        <p className="text-xs text-gray-500">
                          * 자율스터디는 출석체크 대상에 포함되지 않으며 정해진
                          회차나 일정이 없습니다.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* 정규/자율 요약 */}
                <div className="mt-2 rounded-xl border border-gray-200 p-5 text-sm leading-7 text-gray-700">
                  위의 내용과 같이 포리프의 스터디는 크게 정규스터디와
                  자율스터디로 구성되어 있습니다.
                  <br />
                  학기 초, 부원모집 시 지원자들은 &apos;정규스터디&apos;에
                  지원하거나 &apos;자율부원&apos;에 지원합니다.
                  <br />
                  <br />
                  정규스터디 부원은 정규스터디와 자율스터디를 동시에 수강할 수도
                  있고, 정규스터디만 수강할 수도 있습니다. 반대로 자율부원은
                  정규스터디를 수강하지 않지만, 자율스터디를 수강할 수 있습니다.
                  <br />
                  <br />
                  자율부원은 스터디를 정규스터디 수강을 제외한 모든 포리프 행사
                  참여와 부원으로서의 혜택을 누릴 수 있습니다.
                </div>
              </div>
            </section>

            {/* 스터디 진행 과정 */}
            <section id="procedure" className="mt-12">
              <p className="text-sm font-medium text-gray-500">
                스터디 진행 과정
              </p>
              <h2 className="mb-3 mt-1 text-2xl font-bold text-gray-900">
                우리의 한 학기는 이렇게 진행돼요.
              </h2>
              <p className="text-sm leading-7 text-gray-700">
                정규 스터디 기준 15주 중 시험 기간을 고려하여 8주 이상의
                스터디가 진행됩니다.
                <br />
                스터디가 종료된 이후에는 한 학기의 마지막 행사인 해커톤이
                개최됩니다.
                <br />
                <br />
                이외에도 알고리즘 대회, 홈커밍 데이 등 학기별로 다양한 행사를
                진행합니다.
              </p>
            </section>

            {/* 스터디 이수 */}
            <section id="completion" className="mt-12">
              <p className="text-sm font-medium text-gray-500">스터디 수료</p>
              <h2 className="mb-3 mt-1 text-2xl font-bold text-gray-900">
                스터디 이수와 수료증
              </h2>
              <p className="text-sm leading-7 text-gray-700">
                스터디 총 수업 중 3/4 이상을 참석하고 해커톤에 참여했을 시
                스터디 이수 조건을 충족합니다.
                <br />
                스터디를 이수하면 해커톤이 끝난 뒤 수료증이 지급됩니다.
              </p>
            </section>

            {/* 스터디 추천 */}
            <section id="recommendation" className="mt-12 pb-20">
              <p className="text-sm font-medium text-gray-500">스터디 추천</p>
              <h2 className="mb-3 mt-1 text-2xl font-bold text-gray-900">
                나에게 맞는 스터디는?
              </h2>
              <p className="text-sm leading-7 text-gray-700">
                포리프의 스터디를 듣고싶지만, 어떤 스터디를 들어야 할 지 고민이
                된다면,
                <br />
                저희가 스터디 선택을 도와드릴게요!
                <br />
                아래의 테스트를 진행하여 관심 분야를 알아보고
                <br />
                강의 방식, 난이도, 관심 분야를 고려하여 본인에게 맞는 스터디를
                수강해보세요.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="mt-8 w-full rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                나에게 맞는 스터디 알아보기
              </button>
            </section>
          </div>

          {/* Side Panel (Desktop) */}
          <aside className="hidden w-72 shrink-0 md:block">
            <div className="sticky top-16 rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-sm leading-6 text-gray-700">
                포리프의 다양한 스터디 중 <br />
                어떤 스터디가 나에게 맞을까?
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="mt-4 w-full rounded-lg bg-[#1D40BA] py-3 text-sm font-semibold text-white hover:bg-[#1634a0]"
              >
                나에게 맞는 스터디 알아보기
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Floating button on mobile */}
      <div className="fixed bottom-5 left-5 z-50 md:hidden">
        <button
          onClick={() => setModalOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-300 bg-white shadow-lg"
          aria-label="스터디 추천받기"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#1D40BA]"
          >
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <RecommendationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
