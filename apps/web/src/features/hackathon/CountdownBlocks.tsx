"use client";

import { useEffect, useRef, useState } from "react";

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
    <div className="flex items-start justify-center gap-4 sm:gap-8 lg:gap-12">
      {units.map((unit, idx) => (
        <div
          key={unit.label}
          className="flex items-start gap-4 sm:gap-8 lg:gap-12"
        >
          {idx > 0 && (
            <span className="text-text-disabled mt-1 select-none text-6xl font-light leading-none sm:text-8xl lg:text-[9rem]">
              :
            </span>
          )}
          <div className="flex flex-col items-center gap-2">
            <span className="text-text-basic text-7xl font-bold tabular-nums leading-none tracking-tight sm:text-9xl lg:text-[11rem]">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-text-subtle text-xs font-bold tracking-[0.3em] sm:text-sm">
              {unit.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
