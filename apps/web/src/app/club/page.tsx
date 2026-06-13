"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Body, Display, Heading, Label, Title } from "@ui/components/server";
import { Marquee } from "@/features/club/Marquee";
import { HistoryTimeline } from "@/features/club/HistoryTimeline";
import { StatCounter } from "@/features/club/StatCounter";
import { Reveal } from "@/features/club/Reveal";
import {
  CLUB_STATS,
  CLUB_VALUES,
  GALLERY_ITEMS,
} from "@/features/club/constants";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

function HeroSection() {
  return (
    <section className="relative flex h-[calc(var(--vh)-64px)] min-h-[560px] items-center justify-center overflow-hidden md:h-[calc(var(--vh)-80px)]">
      {/* Background */}
      <Image
        src="/images/about-bg.png"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/55" />

      {/* Title */}
      <div className="relative z-10 px-6 text-center">
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-[64px] font-bold leading-[1.05] tracking-tight text-white sm:text-[100px] lg:text-[140px]">
            about_
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        >
          <p className="text-[52px] font-bold leading-[1.1] tracking-tight text-white sm:text-[100px] lg:text-[140px]">
            <span className="text-text-primary">{"{ "}</span>
            FORIF
            <span className="text-text-primary">{" }"}</span>
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
        >
          <Body
            size="l"
            className="mx-auto mt-6 max-w-xl break-keep text-white/80"
          >
            프로그래밍을 하고 싶은 누구나, 포리프와 함께. 지식의 선순환을 꿈꾸는
            한양대학교 중앙 프로그래밍 동아리입니다.
          </Body>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.button
        type="button"
        aria-label="다음 섹션으로 이동"
        onClick={() =>
          document
            .getElementById("club-marquee")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer p-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5v14M19 12l-7 7-7-7"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.button>
    </section>
  );
}

function MarqueeSection() {
  return (
    <section
      id="club-marquee"
      className="bg-button-primary-fill flex scroll-mt-16 flex-col gap-10 overflow-hidden px-6 py-20 md:scroll-mt-0 md:px-16 md:py-28"
    >
      <Heading size="l" className="text-white">
        프로그래밍을 하고 싶은 누구나,
        <br />
        포리프와 함께.
      </Heading>
      <Marquee />
      <Heading size="l" className="self-end text-right text-white">
        지식의 선순환을.
      </Heading>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="bg-surface-white px-6 py-20 md:py-28">
      <div className="max-w-main mx-auto">
        <Reveal className="mb-12 text-center">
          <Label size="m" weight="bold" className="text-text-primary">
            FORIF IN NUMBERS
          </Label>
          <Heading size="m" className="mt-2">
            숫자로 보는 포리프
          </Heading>
        </Reveal>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {CLUB_STATS.map((stat) => (
            <StatCounter
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  return (
    <section className="bg-surface-gray-subtler px-6 py-20 md:py-28">
      <div className="max-w-main mx-auto">
        <Reveal className="mb-12 text-center">
          <Label size="m" weight="bold" className="text-text-primary">
            ACTIVITIES
          </Label>
          <Heading size="m" className="mt-2">
            우리는 이렇게 활동해요
          </Heading>
        </Reveal>

        {/* 고정 행 높이 그리드: 2×2 타일이 단독으로 한 행을 차지해도
            높이가 무너지지 않도록 auto-rows로 행 높이를 고정한다. */}
        <div className="grid auto-rows-[34vw] grid-cols-2 gap-4 md:auto-rows-[clamp(140px,18vw,210px)] md:grid-cols-4">
          {GALLERY_ITEMS.map((item, idx) => {
            // colSpan/rowSpan은 constants.ts에서 지정. Tailwind가 정적으로
            // 스캔할 수 있도록 완성된 클래스명을 그대로 매핑한다.
            const colClass = item.colSpan === 2 ? "col-span-2" : "col-span-1";
            const rowClass = item.rowSpan === 2 ? "row-span-2" : "row-span-1";
            return (
              <Reveal
                key={item.src}
                delay={idx * 0.08}
                className={`${colClass} ${rowClass}`}
              >
                <div className="rounded-4 group relative h-full w-full overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <Label
                    size="m"
                    weight="bold"
                    className="absolute bottom-4 left-4 text-white"
                  >
                    {item.caption}
                  </Label>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HistorySection() {
  return (
    <section className="bg-surface-white px-6 py-20 md:py-28">
      <div className="max-w-main mx-auto">
        <Reveal className="mb-16 text-center">
          <Label size="m" weight="bold" className="text-text-primary">
            HISTORY
          </Label>
          <Heading size="m" className="mt-2">
            강렬한 <span className="text-text-primary">FORIF</span>의 역사
          </Heading>
        </Reveal>
        <HistoryTimeline />
      </div>
    </section>
  );
}

function ValuesSection() {
  return (
    <section className="bg-surface-gray-subtler px-6 py-20 md:py-28">
      <div className="max-w-main mx-auto">
        <Reveal className="mb-12 text-center">
          <Label size="m" weight="bold" className="text-text-primary">
            OUR VALUES
          </Label>
          <Heading size="m" className="mt-2">
            포리프를 움직이는 <span className="text-text-primary">세 가지</span>
          </Heading>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {CLUB_VALUES.map((value, idx) => (
            <Reveal key={value.keyword} delay={idx * 0.1}>
              <div className="border-border-gray-light bg-surface-white rounded-4 flex h-full flex-col gap-3 border p-8">
                <Display size="s" className="text-text-primary">
                  0{idx + 1}
                </Display>
                <Label size="s" weight="bold" className="text-text-primary">
                  {value.keyword}
                </Label>
                <Title size="s">{value.title}</Title>
                <Body size="m" className="text-text-subtle leading-7">
                  {value.description}
                </Body>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingCTA() {
  return (
    <section className="bg-button-primary-fill flex flex-col items-center px-6 py-28 text-center md:py-36">
      <Reveal>
        <Heading size="l" className="text-white/70">
          <span className="text-white underline decoration-white/30 underline-offset-[6px]">
            지식의 선순환
          </span>
          이 일어날 수 있도록.
        </Heading>
      </Reveal>

      <Reveal delay={0.15}>
        <Body size="m" className="mt-4 text-white/60">
          한양대학교 중앙 프로그래밍 동아리
        </Body>
      </Reveal>

      <Reveal delay={0.3}>
        <Image
          src="/images/black_title.png"
          alt="FORIF"
          width={3600}
          height={1800}
          priority={false}
          className="mt-10 h-auto w-[200px] brightness-0 invert sm:w-[260px] lg:w-[320px]"
        />
      </Reveal>
    </section>
  );
}

export default function ClubPage() {
  return (
    <div>
      <HeroSection />
      <MarqueeSection />
      <StatsSection />
      <GallerySection />
      <HistorySection />
      <ValuesSection />
      <ClosingCTA />
    </div>
  );
}
