"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { Body, Display } from "@ui/components/server";

interface StatCounterProps {
  value: number;
  suffix?: string;
  label: string;
  /** 카운트업 지속 시간(ms) */
  duration?: number;
}

export function StatCounter({
  value,
  suffix = "",
  label,
  duration = 1400,
}: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic 으로 끝에서 부드럽게 멈춤
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 text-center">
      <Display size="s" className="text-text-primary">
        {count}
        {suffix}
      </Display>
      <Body size="m" className="text-text-subtle">
        {label}
      </Body>
    </div>
  );
}
