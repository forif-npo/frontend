"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface CountdownBlocksProps {
  targetDate: string;
  serverTime?: string;
}

function calcDiff(target: Date, now: Date) {
  const diff = Math.max(target.getTime() - now.getTime(), 0);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownBlocks({
  targetDate,
  serverTime,
}: CountdownBlocksProps) {
  const offsetRef = useRef(
    serverTime ? Date.now() - new Date(serverTime).getTime() : 0,
  );
  const [time, setTime] = useState(() =>
    calcDiff(new Date(targetDate), new Date(Date.now() - offsetRef.current)),
  );

  useEffect(() => {
    const target = new Date(targetDate);
    const tick = () =>
      setTime(calcDiff(target, new Date(Date.now() - offsetRef.current)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units =
    time.days > 0
      ? [
          { value: time.days, label: "DAYS" },
          { value: time.hours, label: "HOURS" },
          { value: time.minutes, label: "MIN" },
          { value: time.seconds, label: "SEC" },
        ]
      : [
          { value: time.hours, label: "HOURS" },
          { value: time.minutes, label: "MIN" },
          { value: time.seconds, label: "SEC" },
        ];

  return (
    <div className="flex items-center gap-3 sm:gap-5">
      {units.map((unit, idx) => (
        <div key={unit.label} className="flex items-center gap-3 sm:gap-5">
          {idx > 0 && (
            <span className="text-text-disabled mb-7 select-none text-4xl font-light sm:text-6xl">
              :
            </span>
          )}
          <FlipUnit value={unit.value} label={unit.label} />
        </div>
      ))}
    </div>
  );
}

function FlipUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="rounded-2 sm:rounded-3 bg-surface-white border-border-gray-light relative h-[96px] w-[78px] overflow-hidden border shadow-sm sm:h-[148px] sm:w-[124px] lg:h-[172px] lg:w-[144px]">
        {/* Top half darker line */}
        <div className="bg-border-gray-light absolute inset-x-0 top-1/2 z-10 h-px" />
        {/* Subtle inner shadow for depth */}
        <div className="rounded-2 sm:rounded-3 absolute inset-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]" />

        <AnimatePresence mode="popLayout">
          <motion.div
            key={display}
            initial={{ y: -20, opacity: 0, filter: "blur(4px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: 20, opacity: 0, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-text-primary text-5xl font-extrabold tabular-nums tracking-tight sm:text-7xl lg:text-8xl">
              {display}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="text-text-subtle text-xs font-bold tracking-widest sm:text-sm">
        {label}
      </span>
    </div>
  );
}
