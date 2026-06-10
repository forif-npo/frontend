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
    <div className="flex w-full items-start justify-center gap-[clamp(0.5rem,2.5vw,3rem)]">
      {units.map((unit, idx) => (
        <div
          key={unit.label}
          className="flex items-start gap-[clamp(0.5rem,2.5vw,3rem)]"
        >
          {idx > 0 && (
            <span className="text-text-disabled mt-1 select-none text-[clamp(2rem,9vw,9rem)] font-light leading-none">
              :
            </span>
          )}
          <div className="flex flex-col items-center gap-2">
            <span className="text-text-basic text-[clamp(2.5rem,12vw,11rem)] font-bold tabular-nums leading-none tracking-tight">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-text-subtle text-[0.625rem] font-bold tracking-[0.3em] sm:text-sm">
              {unit.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
