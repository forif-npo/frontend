"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Body, Detail, Heading, Label } from "@ui/components/server";
import { Button, Modal } from "@ui/components/client";
import {
  PROGRAMMING_CARDS,
  RECOMMENDATION_QUESTIONS,
  GUIDE_TABS,
  getStudyRecommendation,
  type ProgrammingCard,
} from "@/constants/study-guide";
import { useScrollFollower, useScrollSpy } from "@/hooks/useScrollSpy";

// --- Components ---

const GUIDE_TAB_IDS = GUIDE_TABS.map(({ id }) => id);
const GUIDE_TAB_SCROLL_OFFSET = 96;

function ProgrammingCardButton({
  card,
  onClick,
}: {
  card: ProgrammingCard;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-border-gray-light bg-surface-white hover:border-border-primary rounded-3 flex h-[120px] flex-col items-center justify-center gap-2 border p-4 text-center transition-colors md:h-[140px]"
    >
      <Body size="m" weight="bold" className="break-keep">
        {card.title}
      </Body>
      <Detail size="s" className="text-text-subtle">
        자세히 보기
      </Detail>
    </button>
  );
}

function ProgrammingCardModal({
  card,
  onClose,
}: {
  card: ProgrammingCard | null;
  onClose: () => void;
}) {
  if (!card) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface-white rounded-4 relative w-full max-w-md p-8 shadow-lg">
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="text-text-subtle hover:text-text-basic absolute right-5 top-5 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6 6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <Heading size="xs" className="mb-4 pr-6">
          {card.title}
        </Heading>
        <Body
          size="s"
          className="text-text-basic max-h-[60vh] overflow-y-auto whitespace-pre-wrap leading-7"
        >
          {card.content}
        </Body>
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

  const isFinished = step >= RECOMMENDATION_QUESTIONS.length;

  const handleAnswer = (option: string) => {
    setAnswers((prev) => [...prev, option]);
    setStep((prev) => prev + 1);
  };

  const handleReset = () => {
    setStep(0);
    setAnswers([]);
  };

  const handleClose = () => {
    onClose();
    // 다음에 열 때 처음부터 시작하도록 초기화
    handleReset();
  };

  const q = RECOMMENDATION_QUESTIONS[step];

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title="나에게 맞는 스터디 찾기"
      showCancelButton={false}
    >
      {isFinished ? (
        (() => {
          const result = getStudyRecommendation(answers);
          const params = new URLSearchParams();
          if (result.tag) params.set("tag", result.tag);
          if (result.difficulty) params.set("difficulty", result.difficulty);
          const listHref = `/studies/list${
            params.toString() ? `?${params.toString()}` : ""
          }`;

          return (
            <div className="flex flex-col items-center gap-4 pb-2 text-center">
              <Label size="s" weight="bold" className="text-text-primary">
                추천 결과
              </Label>
              <Heading size="xs">{result.description}</Heading>

              <div className="border-border-gray-light bg-surface-primary-subtler rounded-3 mt-2 flex w-full flex-col gap-3 border p-5 text-left">
                {[
                  { label: "관심 분야", value: result.fieldLabel },
                  { label: "추천 난이도", value: result.difficultyLabel },
                  { label: "진행 방식", value: result.format },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-4">
                    <Body
                      size="s"
                      weight="bold"
                      className="text-text-subtle w-20 shrink-0"
                    >
                      {row.label}
                    </Body>
                    <Body size="s" weight="bold" className="text-text-primary">
                      {row.value}
                    </Body>
                  </div>
                ))}
              </div>

              <Body size="s" className="text-text-subtle">
                아래 버튼을 누르면 이 조건에 맞는 스터디를 모아서 보여드려요.
              </Body>

              <div className="mt-2 flex gap-3">
                <Button variant="tertiary" size="medium" onClick={handleReset}>
                  다시 하기
                </Button>
                <Link
                  href={listHref}
                  onClick={handleClose}
                  className="bg-button-primary-fill hover:bg-button-primary-fill-hover rounded-2 flex min-h-[48px] items-center justify-center px-6 transition-colors"
                >
                  <Label size="m" className="text-text-inverse-static">
                    추천 스터디 보기
                  </Label>
                </Link>
              </div>
            </div>
          );
        })()
      ) : (
        <div className="flex flex-col gap-4 pb-2">
          <div className="flex items-center justify-between">
            <Label size="s" weight="bold" className="text-text-primary">
              {q.title}
            </Label>
            <Detail size="s" className="text-text-subtle">
              {step + 1} / {RECOMMENDATION_QUESTIONS.length}
            </Detail>
          </div>
          <Body size="m" weight="bold">
            {q.text}
          </Body>
          <div className="flex flex-col gap-2">
            {q.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                className="border-border-gray-light hover:border-border-primary hover:bg-surface-primary-subtler rounded-2 border px-4 py-3 text-left transition-colors"
              >
                <Body size="s" className="text-text-basic">
                  {opt}
                </Body>
              </button>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <Label size="s" weight="bold" className="text-text-primary">
      {children}
    </Label>
  );
}

export default function StudyGuidePage() {
  const activeTab = useScrollSpy(GUIDE_TAB_IDS, { offset: 140 });
  const recommendationPanel = useScrollFollower<HTMLDivElement, HTMLDivElement>(
    {
      topOffset: 120,
    },
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ProgrammingCard | null>(
    null,
  );

  const handleTabClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y =
        el.getBoundingClientRect().top +
        window.scrollY -
        GUIDE_TAB_SCROLL_OFFSET;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div>
      <div className="border-border-gray-light bg-surface-primary-subtler border-b px-6 py-16 text-center">
        <Heading size="l">스터디 가이드</Heading>
        <Body size="m" className="text-text-subtle mt-2">
          나에게 맞는 스터디를 찾아보세요!
        </Body>
      </div>

      <div
        id="introduction"
        className="max-w-main mx-auto px-4 py-6 md:px-8 xl:px-12"
      >
        {/* Sticky Tabs */}
        <div className="bg-surface-white sticky top-0 z-10 -mx-4 overflow-x-auto px-4 md:-mx-8 md:px-8 xl:-mx-12 xl:px-12">
          <div className="border-border-gray-light flex border-b">
            {GUIDE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`relative shrink-0 px-4 py-3 transition-colors ${
                  activeTab === tab.id
                    ? "text-text-primary"
                    : "text-text-subtle hover:text-text-basic"
                }`}
              >
                <Label size="m" weight="bold">
                  {tab.label}
                </Label>
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="study-guide-active-tab"
                    className="bg-primary-50 absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 34,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div ref={recommendationPanel.containerRef} className="flex gap-8 pt-6">
          {/* Main Content */}
          <div className="min-w-0 flex-1">
            {/* 스터디 소개 */}
            <section>
              <SectionEyebrow>스터디 소개</SectionEyebrow>
              <Heading size="s" className="mb-3 mt-1">
                프로그래밍이 뭔가요?
              </Heading>
              <Body size="m" className="text-text-basic leading-7">
                프로그래밍은 다양한 분야로 나뉘며, 각 분야마다 특징적인 기술과
                도구를 사용합니다.
                <br />
                다음은 주요 프로그래밍 분야들입니다.
              </Body>
              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
                {PROGRAMMING_CARDS.map((card) => (
                  <ProgrammingCardButton
                    key={card.id}
                    card={card}
                    onClick={() => setSelectedCard(card)}
                  />
                ))}
              </div>
            </section>

            {/* 스터디 운영 방식 */}
            <section id="ongoing" className="mt-12">
              <SectionEyebrow>스터디 운영 방식</SectionEyebrow>
              <Heading size="s" className="mb-3 mt-1">
                스터디 진행 방식
              </Heading>
              <div className="flex flex-col gap-4">
                <Body size="m" className="text-text-basic leading-7">
                  포리프의 스터디는 크게 &apos;정규스터디&apos;와
                  &apos;자율스터디&apos;로 나누어집니다. 정규스터디는 또다시
                  강의형과 프로젝트형으로 나누어집니다.
                </Body>

                {/* 정규 스터디 */}
                <div>
                  <Body size="m" weight="bold">
                    1. 정규 스터디
                  </Body>
                  <Body size="m" className="text-text-basic mt-1 leading-7">
                    매 학기가 시작하며 다양한 지식을 갖춘 멘토님들이 스터디를
                    개설합니다. 이렇게 개설되는 스터디를
                    &apos;정규스터디&apos;라고 합니다.
                  </Body>
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
                        <Body size="s" weight="bold" className="w-20 shrink-0">
                          {item.label}
                        </Body>
                        <Body size="s" className="text-text-basic leading-7">
                          {item.desc}
                        </Body>
                      </li>
                    ))}
                    <li className="flex gap-4">
                      <Body size="s" weight="bold" className="w-20 shrink-0">
                        진행 방식
                      </Body>
                      <div className="leading-7">
                        <Body size="s" className="text-text-basic">
                          강의형과 프로젝트형으로 나누어집니다.
                        </Body>
                        <Body size="s" className="text-text-subtle mt-1">
                          - 강의형: 다인원을 대상으로 이루어지며, 멘토가
                          강의식으로 수업을 진행합니다. 일반적으로 기초스터디가
                          이에 해당합니다.
                        </Body>
                        <Body size="s" className="text-text-subtle mt-1">
                          - 프로젝트형: 소규모로 진행되며, 프로젝트 결과물을
                          만들어내는 것을 중심으로 진행됩니다. 기본적인
                          프로그래밍 능력이 요구됩니다.
                        </Body>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <Body size="s" weight="bold" className="w-20 shrink-0">
                        혜택
                      </Body>
                      <Body size="s" className="text-text-basic leading-7">
                        일정 요건 충족 시 수료증이 발급됩니다.
                      </Body>
                    </li>
                  </ul>
                </div>

                {/* 자율 스터디 */}
                <div className="mt-4">
                  <Body size="m" weight="bold">
                    2. 자율 스터디
                  </Body>
                  <Body size="m" className="text-text-basic mt-1 leading-7">
                    자율 스터디는 정규 스터디와는 다르게 학기가 시작된 후
                    부원들의 수요에 따라 개설되는 스터디입니다. 일반적으로
                    &apos;멘토&apos;는 존재하지 않으며, 함께 공부할 사람들이
                    모여 스터디를 진행합니다.
                  </Body>
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
                        <Body size="s" weight="bold" className="w-24 shrink-0">
                          {item.label}
                        </Body>
                        <Body size="s" className="text-text-basic leading-7">
                          {item.desc}
                        </Body>
                      </li>
                    ))}
                    <li className="flex gap-4">
                      <Body size="s" weight="bold" className="w-24 shrink-0">
                        혜택
                      </Body>
                      <div className="leading-7">
                        <Body size="s" className="text-text-basic">
                          스터디 별 기준에 따라 최대 5만원 지급
                        </Body>
                        <Body size="s" className="text-text-subtle mt-1">
                          * 자율스터디 수강은 포리프 인증서가 발급되지 않습니다.
                        </Body>
                        <Body size="s" className="text-text-subtle">
                          * 자율스터디는 출석체크 대상에 포함되지 않으며 정해진
                          회차나 일정이 없습니다.
                        </Body>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* 정규/자율 요약 */}
                <div className="border-border-gray-light rounded-3 mt-2 border p-5">
                  <Body size="s" className="text-text-basic leading-7">
                    위의 내용과 같이 포리프의 스터디는 크게 정규스터디와
                    자율스터디로 구성되어 있습니다.
                    <br />
                    학기 초, 부원모집 시 지원자들은 &apos;정규스터디&apos;에
                    지원하거나 &apos;자율부원&apos;에 지원합니다.
                    <br />
                    <br />
                    정규스터디 부원은 정규스터디와 자율스터디를 동시에 수강할
                    수도 있고, 정규스터디만 수강할 수도 있습니다. 반대로
                    자율부원은 정규스터디를 수강하지 않지만, 자율스터디를 수강할
                    수 있습니다.
                    <br />
                    <br />
                    자율부원은 스터디를 정규스터디 수강을 제외한 모든 포리프
                    행사 참여와 부원으로서의 혜택을 누릴 수 있습니다.
                  </Body>
                </div>
              </div>
            </section>

            {/* 스터디 진행 과정 */}
            <section id="procedure" className="mt-12">
              <SectionEyebrow>스터디 진행 과정</SectionEyebrow>
              <Heading size="s" className="mb-3 mt-1">
                우리의 한 학기는 이렇게 진행돼요.
              </Heading>
              <Body size="m" className="text-text-basic leading-7">
                정규 스터디 기준 15주 중 시험 기간을 고려하여 8주 이상의
                스터디가 진행됩니다.
                <br />
                스터디가 종료된 이후에는 한 학기의 마지막 행사인 해커톤이
                개최됩니다.
                <br />
                <br />
                이외에도 알고리즘 대회, 홈커밍 데이 등 학기별로 다양한 행사를
                진행합니다.
              </Body>
            </section>

            {/* 스터디 이수 */}
            <section id="completion" className="mt-12">
              <SectionEyebrow>스터디 수료</SectionEyebrow>
              <Heading size="s" className="mb-3 mt-1">
                스터디 이수와 수료증
              </Heading>
              <Body size="m" className="text-text-basic leading-7">
                스터디 총 수업 중 3/4 이상을 참석하고 해커톤에 참여했을 시
                스터디 이수 조건을 충족합니다.
                <br />
                스터디를 이수하면 해커톤이 끝난 뒤 수료증이 지급됩니다.
              </Body>
            </section>

            {/* 스터디 추천 */}
            <section id="recommendation" className="mt-12 pb-20">
              <SectionEyebrow>스터디 추천</SectionEyebrow>
              <Heading size="s" className="mb-3 mt-1">
                나에게 맞는 스터디는?
              </Heading>
              <Body size="m" className="text-text-basic leading-7">
                포리프의 스터디를 듣고싶지만, 어떤 스터디를 들어야 할 지 고민이
                된다면,
                <br />
                저희가 스터디 선택을 도와드릴게요!
                <br />
                아래의 테스트를 진행하여 관심 분야를 알아보고
                <br />
                강의 방식, 난이도, 관심 분야를 고려하여 본인에게 맞는 스터디를
                수강해보세요.
              </Body>
              <Button
                variant="secondary"
                size="medium"
                onClick={() => setModalOpen(true)}
                className="mt-8 w-full"
              >
                나에게 맞는 스터디 알아보기
              </Button>
            </section>
          </div>

          {/* Side Panel (Desktop) */}
          <aside className="hidden w-72 shrink-0 md:block">
            <div
              ref={recommendationPanel.followerRef}
              style={{ marginTop: recommendationPanel.offset }}
              className="border-border-gray-light rounded-3 border p-6 text-center"
            >
              <Body size="s" className="text-text-basic leading-6">
                포리프의 다양한 스터디 중 <br />
                어떤 스터디가 나에게 맞을까?
              </Body>
              <Button
                variant="primary"
                size="medium"
                onClick={() => setModalOpen(true)}
                className="mt-4 w-full"
              >
                나에게 맞는 스터디 알아보기
              </Button>
            </div>
          </aside>
        </div>
      </div>

      {/* Floating button on mobile */}
      <div className="fixed bottom-5 left-5 z-50 md:hidden">
        <button
          onClick={() => setModalOpen(true)}
          className="border-border-gray-light bg-surface-white flex h-14 w-14 items-center justify-center rounded-full border shadow-lg"
          aria-label="스터디 추천받기"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            className="text-text-primary"
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

      <ProgrammingCardModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </div>
  );
}
