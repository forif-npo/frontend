"use client";

import { useState } from "react";
import { motion, useScroll } from "motion/react";
import { Breadcrumb } from "@ui/components/server";
import { RULE, RULE_CHAPTERS } from "@/constants/club-rule";

export default function RulePage() {
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();

  return (
    <div>
      <motion.div
        style={{
          scaleX: scrollYProgress,
          transformOrigin: "left",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: "#1D40BA",
          zIndex: 100,
        }}
      />
      <div className="max-w-main mx-auto px-6 py-20">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "홈", href: "/" },
              { label: "동아리", href: "/club" },
              { label: "회칙" },
            ]}
          />
        </div>

        {/* Title */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">회칙</h1>
          <p className="mt-2 text-sm text-gray-500">
            모든 포리프 행사 및 활동은 회칙에 근거합니다.
          </p>
        </div>

        <div className="flex gap-8">
          {/* Content */}
          <div className="prose prose-sm max-w-none flex-1">
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
                    className="mb-4 mt-12 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
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

          {/* Side Navigation */}
          <div className="hidden w-[160px] shrink-0 md:block">
            <div className="sticky top-20">
              <div className="flex gap-3">
                <div className="w-[3px] rounded bg-gray-200" />
                <div className="flex flex-col gap-1">
                  <p className="mb-2 text-xs font-semibold text-gray-500">
                    회칙 목록
                  </p>
                  {RULE_CHAPTERS.map((ch) => (
                    <a
                      key={ch}
                      href={`#${ch}`}
                      onClick={() => setActiveChapter(ch)}
                      className={`text-sm font-medium transition-colors ${
                        activeChapter === ch
                          ? "text-[#1D40BA]"
                          : "text-gray-400 hover:text-gray-700"
                      }`}
                    >
                      {ch}장
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
