"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";

interface RevealProps {
  children: ReactNode;
  /** 등장 지연(초) */
  delay?: number;
  className?: string;
}

/** 뷰포트에 들어올 때 아래에서 위로 부드럽게 나타나는 래퍼 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
