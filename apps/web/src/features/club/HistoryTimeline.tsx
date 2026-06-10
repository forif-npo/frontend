"use client";

import { motion } from "motion/react";
import { Body, Title } from "@ui/components/server";

const history: { year: number; content: string[] }[] = [
  { year: 2026, content: ["FORIF 웹 리뉴얼", "제 1회 초청 강연"] },
  { year: 2025, content: ["포리프 10주년 기념 행사", "제 15·16회 해커톤"] },
  {
    year: 2024,
    content: [
      "선배와의 만남",
      "HSPC 한양X세종 알고리즘 대회 개최",
      "제 2회 홈커밍데이",
      "제 13·14회 해커톤",
    ],
  },
  {
    year: 2023,
    content: [
      "한 학기 부원 수 200명 돌파",
      "HPEC 한양 알고리즘 대회 개최",
      "OOPARTS 연합 스터디",
      "제 1회 홈커밍데이",
      "제 11·12회 해커톤",
    ],
  },
  { year: 2021, content: ["한양대학교 중앙동아리 승격", "프로젝트 뭉공포"] },
  { year: 2020, content: ["한양대학교 준동아리 승격", "프로젝트 잔디심기"] },
  { year: 2018, content: ["청년참 지원사업 선정"] },
  { year: 2017, content: ["한양 학술타운 총장상 수상"] },
  { year: 2015, content: ["FORIF 창립", "소셜 벤처 동아리 선정"] },
];

function TimelineRow({
  year,
  content,
  isLast,
}: {
  year: number;
  content: string[];
  isLast: boolean;
}) {
  return (
    <motion.div
      className="relative flex gap-5 sm:gap-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ staggerChildren: 0.08 }}
    >
      {/* Year */}
      <motion.div
        className="w-12 shrink-0 pt-0.5 text-right sm:w-16"
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Title size="s" className="text-text-primary">
          {year}
        </Title>
      </motion.div>

      {/* Dot + vertical line */}
      <div className="relative flex flex-col items-center">
        <motion.span
          className="border-surface-white bg-button-primary-fill z-10 mt-1 h-4 w-4 rounded-full border-2 shadow-sm"
          variants={{
            hidden: { scale: 0 },
            visible: { scale: 1 },
          }}
          transition={{ duration: 0.4, ease: "backOut" }}
        />
        {!isLast && (
          <span className="bg-border-gray-light absolute top-1 h-full w-0.5" />
        )}
      </div>

      {/* Content */}
      <motion.div
        className="flex flex-col gap-1.5 pb-10"
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {content.map((label) => (
          <Body key={label} size="m" className="text-text-basic">
            {label}
          </Body>
        ))}
      </motion.div>
    </motion.div>
  );
}

export function HistoryTimeline() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col">
      {history.map((item, idx) => (
        <TimelineRow
          key={item.year}
          year={item.year}
          content={item.content}
          isLast={idx === history.length - 1}
        />
      ))}
    </div>
  );
}
