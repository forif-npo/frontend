"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";

const marqueeVariants = {
  animate: {
    x: [0, -1300],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop" as const,
        duration: 8,
        ease: "linear" as const,
      },
    },
  },
};

const marqueeVariants2 = {
  animate: {
    x: [-1300, 0],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop" as const,
        duration: 8,
        ease: "linear" as const,
      },
    },
  },
};

function FlowBox({
  children,
  type,
}: {
  children: ReactNode;
  type: "narrow" | "wide";
}) {
  const isWide = type === "wide";
  return (
    <div
      style={{
        paddingTop: 24,
        paddingBottom: 24,
        paddingLeft: isWide ? 48 : 32,
        paddingRight: isWide ? 48 : 32,
        borderRadius: 40,
        backgroundColor: isWide ? "white" : "rgba(255,255,255,0.5)",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          fontSize: "22pt",
          lineHeight: "28pt",
          color: "#1D40BA",
        }}
      >
        {children}
      </span>
    </div>
  );
}

export function Marquee() {
  return (
    <div
      style={{
        position: "relative",
        width: "var(--vw)",
        maxWidth: "100%",
        height: 240,
        overflow: "hidden",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          whiteSpace: "nowrap",
          display: "flex",
        }}
        variants={marqueeVariants}
        animate="animate"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 32,
            alignItems: "center",
            marginRight: 32,
          }}
        >
          <FlowBox type="wide"># 한양대학교 중앙동아리</FlowBox>
          <FlowBox type="narrow"># SHARE</FlowBox>
          <FlowBox type="wide"># 프로그래밍 동아리</FlowBox>
          <FlowBox type="narrow"># 프로그래밍 동아리</FlowBox>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 32,
            alignItems: "center",
            marginRight: 32,
          }}
        >
          <FlowBox type="wide"># 한양대학교 중앙동아리</FlowBox>
          <FlowBox type="narrow"># SHARE</FlowBox>
          <FlowBox type="wide"># 프로그래밍 동아리</FlowBox>
          <FlowBox type="narrow"># 프로그래밍 동아리</FlowBox>
        </div>
      </motion.div>
      <motion.div
        style={{
          position: "absolute",
          bottom: 0,
          whiteSpace: "nowrap",
          display: "flex",
        }}
        variants={marqueeVariants2}
        animate="animate"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 32,
            alignItems: "center",
            marginRight: 32,
          }}
        >
          <FlowBox type="wide"># FORIF</FlowBox>
          <FlowBox type="narrow"># 비전공자도 환영</FlowBox>
          <FlowBox type="wide"># 전공자도 환영</FlowBox>
          <FlowBox type="narrow"># GROWTH</FlowBox>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 32,
            alignItems: "center",
            marginRight: 32,
          }}
        >
          <FlowBox type="wide"># FORIF</FlowBox>
          <FlowBox type="narrow"># 비전공자도 환영</FlowBox>
          <FlowBox type="wide"># 전공자도 환영</FlowBox>
          <FlowBox type="narrow"># GROWTH</FlowBox>
        </div>
      </motion.div>
    </div>
  );
}
