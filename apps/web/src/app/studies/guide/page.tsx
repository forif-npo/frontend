"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Body, Detail, Heading, Label } from "@ui/components/server";
import { Button, Modal } from "@ui/components/client";
import {
  GUIDE_TAB_SCROLL_OFFSET,
  PROGRAMMING_CARDS,
  GUIDE_TABS,
  RECOMMENDATION_MODAL_COPY,
  RECOMMENDATION_QUESTIONS,
  STUDY_GUIDE_CARD_CTA_LABEL,
  STUDY_GUIDE_HERO,
  STUDY_GUIDE_SECTIONS,
  STUDY_OPERATION_GUIDE,
  STUDY_RECOMMENDATION_CTA_LABEL,
  STUDY_RECOMMENDATION_SIDE_PANEL,
  getStudyRecommendation,
  type ProgrammingCard,
  type ProgrammingCardSection,
  type StudyGuideTableRow,
  type StudyTypeGuide,
} from "@/constants/study-guide";
import { useScrollFollower, useScrollSpy } from "@/hooks/useScrollSpy";

// --- Components ---

const GUIDE_TAB_IDS = GUIDE_TABS.map(({ id }) => id);

function GuideBody({
  text,
  size = "m",
  className = "",
}: {
  text: string;
  size?: "s" | "m";
  className?: string;
}) {
  return (
    <Body
      size={size}
      className={`text-text-basic whitespace-pre-line leading-7 ${className}`}
    >
      {text}
    </Body>
  );
}

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
        {STUDY_GUIDE_CARD_CTA_LABEL}
      </Detail>
    </button>
  );
}

function ProgrammingCardContent({
  sections,
}: {
  sections: ProgrammingCardSection[];
}) {
  return (
    <div className="flex flex-col gap-6">
      {sections.map((section) => (
        <section key={section.title} className="flex flex-col gap-2">
          <Label size="s" weight="bold" className="text-text-primary">
            {section.title}
          </Label>
          <GuideBody text={section.body} size="s" />
        </section>
      ))}
    </div>
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
      <div className="bg-surface-white rounded-4 relative w-full max-w-4xl p-8 shadow-lg md:p-10">
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
        <ProgrammingCardContent sections={card.sections} />
      </div>
    </div>
  );
}

function StudyGuideTable({ rows }: { rows: StudyGuideTableRow[] }) {
  return (
    <ul className="border-border-gray-light bg-surface-white rounded-3 mt-4 overflow-hidden border shadow-sm">
      {rows.map((row) => (
        <li
          key={row.label}
          className="border-border-gray-light grid border-b last:border-b-0 md:grid-cols-[150px_minmax(0,1fr)]"
        >
          <div className="bg-primary-5 border-border-gray-light flex items-center justify-center px-5 py-4 text-center md:border-r">
            <Body
              size="s"
              weight="bold"
              className="text-text-basic text-center"
            >
              {row.label}
            </Body>
          </div>
          <div className="px-5 py-4 leading-7">
            {row.lines.map((line, index) => (
              <Body
                key={`${row.label}-${line.text}`}
                size="s"
                className={`${
                  line.tone === "subtle"
                    ? "text-text-subtle"
                    : "text-text-basic"
                } ${index > 0 ? "mt-1" : ""}`}
              >
                {line.text}
              </Body>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}

function StudyTypeSection({
  studyType,
  className = "",
}: {
  studyType: StudyTypeGuide;
  className?: string;
}) {
  return (
    <div className={className}>
      <Body size="m" weight="bold">
        {studyType.title}
      </Body>
      <GuideBody text={studyType.description} className="mt-1" />
      <StudyGuideTable rows={studyType.rows} />
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
      title={RECOMMENDATION_MODAL_COPY.title}
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
            <div className="flex flex-col items-center gap-5 pb-6 text-center">
              <Label size="s" weight="bold" className="text-text-primary">
                {RECOMMENDATION_MODAL_COPY.resultLabel}
              </Label>
              <Heading size="xs">{result.description}</Heading>

              <div className="border-border-gray-light bg-surface-primary-subtler rounded-3 mt-2 flex w-full flex-col gap-3 border p-5 text-left">
                {RECOMMENDATION_MODAL_COPY.resultRows.map((row) => (
                  <div key={row.label} className="flex items-center gap-4">
                    <Body
                      size="s"
                      weight="bold"
                      className="text-text-subtle w-20 shrink-0"
                    >
                      {row.label}
                    </Body>
                    <Body size="s" weight="bold" className="text-text-primary">
                      {result[row.key]}
                    </Body>
                  </div>
                ))}
              </div>

              <Body size="s" className="text-text-subtle">
                {RECOMMENDATION_MODAL_COPY.resultHelperText}
              </Body>

              <div className="mt-2 flex gap-3">
                <Button variant="tertiary" size="medium" onClick={handleReset}>
                  {RECOMMENDATION_MODAL_COPY.resetButtonLabel}
                </Button>
                <Link
                  href={listHref}
                  onClick={handleClose}
                  className="bg-button-primary-fill hover:bg-button-primary-fill-hover rounded-2 flex min-h-[48px] items-center justify-center px-6 transition-colors"
                >
                  <Label size="m" className="text-text-inverse-static">
                    {RECOMMENDATION_MODAL_COPY.listButtonLabel}
                  </Label>
                </Link>
              </div>
            </div>
          );
        })()
      ) : (
        <div className="flex flex-col gap-5 pb-6">
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
          <div className="flex flex-col gap-3">
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
        <Heading size="l">{STUDY_GUIDE_HERO.title}</Heading>
        <Body size="m" className="text-text-subtle mt-2">
          {STUDY_GUIDE_HERO.description}
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
              <SectionEyebrow>
                {STUDY_GUIDE_SECTIONS.introduction.eyebrow}
              </SectionEyebrow>
              <Heading size="s" className="mb-3 mt-1">
                {STUDY_GUIDE_SECTIONS.introduction.heading}
              </Heading>
              <GuideBody text={STUDY_GUIDE_SECTIONS.introduction.body} />
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
              <SectionEyebrow>{STUDY_OPERATION_GUIDE.eyebrow}</SectionEyebrow>
              <Heading size="s" className="mb-3 mt-1">
                {STUDY_OPERATION_GUIDE.heading}
              </Heading>
              <div className="flex flex-col gap-4">
                <GuideBody text={STUDY_OPERATION_GUIDE.body} />

                {STUDY_OPERATION_GUIDE.studyTypes.map((studyType, index) => (
                  <StudyTypeSection
                    key={studyType.title}
                    studyType={studyType}
                    className={index > 0 ? "mt-4" : ""}
                  />
                ))}

                {/* 정규/자율 요약 */}
                <div className="border-border-gray-light rounded-3 mt-2 border p-5">
                  <GuideBody text={STUDY_OPERATION_GUIDE.summary} size="s" />
                </div>
              </div>
            </section>

            {/* 스터디 진행 과정 */}
            <section id="procedure" className="mt-12">
              <SectionEyebrow>
                {STUDY_GUIDE_SECTIONS.procedure.eyebrow}
              </SectionEyebrow>
              <Heading size="s" className="mb-3 mt-1">
                {STUDY_GUIDE_SECTIONS.procedure.heading}
              </Heading>
              <GuideBody text={STUDY_GUIDE_SECTIONS.procedure.body} />
            </section>

            {/* 스터디 이수 */}
            <section id="completion" className="mt-12">
              <SectionEyebrow>
                {STUDY_GUIDE_SECTIONS.completion.eyebrow}
              </SectionEyebrow>
              <Heading size="s" className="mb-3 mt-1">
                {STUDY_GUIDE_SECTIONS.completion.heading}
              </Heading>
              <GuideBody text={STUDY_GUIDE_SECTIONS.completion.body} />
            </section>

            {/* 스터디 추천 */}
            <section id="recommendation" className="mt-12 pb-20">
              <SectionEyebrow>
                {STUDY_GUIDE_SECTIONS.recommendation.eyebrow}
              </SectionEyebrow>
              <Heading size="s" className="mb-3 mt-1">
                {STUDY_GUIDE_SECTIONS.recommendation.heading}
              </Heading>
              <GuideBody text={STUDY_GUIDE_SECTIONS.recommendation.body} />
              <Button
                variant="secondary"
                size="medium"
                onClick={() => setModalOpen(true)}
                className="mt-8 w-full"
              >
                {STUDY_RECOMMENDATION_CTA_LABEL}
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
              <GuideBody
                text={STUDY_RECOMMENDATION_SIDE_PANEL.description}
                size="s"
                className="leading-6"
              />
              <Button
                variant="primary"
                size="medium"
                onClick={() => setModalOpen(true)}
                className="mt-4 w-full"
              >
                {STUDY_RECOMMENDATION_SIDE_PANEL.buttonLabel}
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
          aria-label={STUDY_RECOMMENDATION_SIDE_PANEL.mobileLabel}
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
