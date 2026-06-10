"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";

const ROW_ONE = [
  { label: "# 한양대학교 중앙동아리", wide: true },
  { label: "# SHARE", wide: false },
  { label: "# 프로그래밍 동아리", wide: true },
  { label: "# 지식의 선순환", wide: false },
];

const ROW_TWO = [
  { label: "# FORIF", wide: true },
  { label: "# 비전공자도 환영", wide: false },
  { label: "# 전공자도 환영", wide: true },
  { label: "# GROWTH", wide: false },
];

function FlowBox({ children, wide }: { children: ReactNode; wide: boolean }) {
  return (
    <div
      className={`whitespace-nowrap rounded-full py-5 ${
        wide ? "bg-surface-white px-12" : "bg-surface-white/50 px-8"
      }`}
    >
      <span className="text-text-primary text-xl font-bold sm:text-2xl">
        {children}
      </span>
    </div>
  );
}

function MarqueeRow({
  items,
  direction,
}: {
  items: typeof ROW_ONE;
  direction: "left" | "right";
}) {
  const distance = direction === "left" ? [0, -1300] : [-1300, 0];

  return (
    <div className="relative w-full overflow-hidden">
      <motion.div
        className="flex w-max gap-8"
        animate={{ x: distance }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 18,
            ease: "linear",
          },
        }}
      >
        {/* 끊김 없는 무한 루프를 위해 같은 묶음을 두 번 렌더 */}
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center gap-8">
            {items.map((item) => (
              <FlowBox key={item.label} wide={item.wide}>
                {item.label}
              </FlowBox>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function Marquee() {
  return (
    <div className="flex w-full flex-col gap-6">
      <MarqueeRow items={ROW_ONE} direction="left" />
      <MarqueeRow items={ROW_TWO} direction="right" />
    </div>
  );
}
