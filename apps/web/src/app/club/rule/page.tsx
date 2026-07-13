"use client";

import { motion } from "motion/react";
import { Breadcrumb } from "@ui/components/server";
import { RULE, RULE_CHAPTERS } from "@/constants/club-rule";
import { useScrollFollower, useScrollSpy } from "@/hooks/useScrollSpy";

const RULE_CHAPTER_IDS = RULE_CHAPTERS.map(String);

export default function RulePage() {
  const activeChapterId = useScrollSpy(RULE_CHAPTER_IDS, { offset: 140 });
  const chapterNavigator = useScrollFollower<HTMLDivElement, HTMLDivElement>({
    topOffset: 120,
    bottomOffset: 32,
  });

  const scrollToChapter = (chapter: number) => {
    const section = document.getElementById(String(chapter));

    if (section) {
      window.scrollTo({
        top: section.offsetTop - 112,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "홈", href: "/" },
            { label: "동아리", href: "/club" },
            { label: "회칙" },
          ]}
        />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">회칙</h1>
        <p className="mt-2 text-sm text-gray-500">
          모든 포리프 행사 및 활동은 회칙에 근거합니다.
        </p>
      </div>

      <div
        ref={chapterNavigator.containerRef}
        className="flex flex-col gap-8 md:flex-row md:items-start"
      >
        <div className="prose prose-sm min-w-0 max-w-none flex-1">
          {RULE.split("\n").map((line, i) => {
            const trimmed = line.trimStart();

            if (trimmed.startsWith("# ")) {
              const chapterMatch = trimmed.match(/^# (\d+)장/);
              const chapterNum = chapterMatch
                ? Number(chapterMatch[1])
                : undefined;
              return (
                <h2
                  key={i}
                  id={chapterNum ? String(chapterNum) : undefined}
                  className={`mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900 ${
                    i === 0 ? "mt-0" : "mt-12"
                  }`}
                >
                  {trimmed.replace(/^# /, "")}
                </h2>
              );
            }
            if (trimmed.startsWith("## ")) {
              return (
                <h3
                  key={i}
                  className="mb-2 mt-6 text-lg font-semibold text-gray-800"
                >
                  {trimmed.replace(/^## /, "")}
                </h3>
              );
            }
            if (trimmed.startsWith("### ")) {
              return (
                <h4
                  key={i}
                  className="mb-2 mt-4 text-base font-semibold text-gray-700"
                >
                  {trimmed.replace(/^### /, "")}
                </h4>
              );
            }
            if (trimmed === "") return <div key={i} className="h-2" />;
            if (trimmed.match(/^\d+\./)) {
              return (
                <p
                  key={i}
                  className="my-1 pl-4 text-sm leading-7 text-gray-700"
                >
                  {trimmed}
                </p>
              );
            }
            return (
              <p key={i} className="my-1 text-sm leading-7 text-gray-700">
                {trimmed}
              </p>
            );
          })}
        </div>

        <div className="hidden w-[160px] shrink-0 md:block">
          <motion.div
            ref={chapterNavigator.followerRef}
            style={{ y: chapterNavigator.y }}
            className="will-change-transform"
          >
            <div className="flex gap-3">
              <div className="my-7 w-[3px] rounded bg-gray-200" />
              <div className="flex flex-col gap-1">
                <p className="mb-2 text-xs font-semibold text-gray-500">
                  회칙 목록
                </p>
                {RULE_CHAPTERS.map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => scrollToChapter(ch)}
                    className={`relative rounded-sm py-0.5 pl-3 text-left text-sm font-medium transition-colors ${
                      activeChapterId === String(ch)
                        ? "text-text-primary"
                        : "text-text-subtle hover:text-text-basic"
                    }`}
                  >
                    {activeChapterId === String(ch) && (
                      <motion.span
                        layoutId="rule-active-chapter"
                        className="bg-primary-50 absolute bottom-1 left-0 top-1 w-[3px] rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 34,
                        }}
                      />
                    )}
                    {ch}장
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
