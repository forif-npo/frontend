"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring } from "motion/react";

interface UseScrollSpyOptions {
  offset?: number;
  defaultId?: string;
}

export function useScrollSpy(
  sectionIds: readonly string[],
  { offset = 120, defaultId = sectionIds[0] ?? "" }: UseScrollSpyOptions = {},
) {
  const [activeId, setActiveId] = useState(defaultId);

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const updateActiveId = () => {
      const scrollPosition = window.scrollY + offset;
      let nextActiveId = defaultId;

      for (const id of sectionIds) {
        const section = document.getElementById(id);

        if (section && scrollPosition >= section.offsetTop) {
          nextActiveId = id;
        }
      }

      setActiveId((prev) => (prev === nextActiveId ? prev : nextActiveId));
    };

    updateActiveId();
    window.addEventListener("scroll", updateActiveId, { passive: true });
    window.addEventListener("resize", updateActiveId);

    return () => {
      window.removeEventListener("scroll", updateActiveId);
      window.removeEventListener("resize", updateActiveId);
    };
  }, [defaultId, offset, sectionIds]);

  return activeId;
}

interface UseScrollFollowerOptions {
  topOffset?: number;
  bottomOffset?: number;
}

export function useScrollFollower<
  TContainer extends HTMLElement,
  TFollower extends HTMLElement,
>({ topOffset = 120, bottomOffset = 32 }: UseScrollFollowerOptions = {}) {
  const containerRef = useRef<TContainer | null>(null);
  const followerRef = useRef<TFollower | null>(null);
  const targetY = useMotionValue(0);
  const y = useSpring(targetY, {
    stiffness: 520,
    damping: 46,
    mass: 0.35,
  });

  useEffect(() => {
    let frame = 0;

    const updatePosition = () => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const container = containerRef.current;
        const follower = followerRef.current;

        if (!container || !follower) return;

        const containerTop =
          container.getBoundingClientRect().top + window.scrollY;
        const scrollStart = containerTop - topOffset;
        const maxY = Math.max(
          0,
          container.offsetHeight - follower.offsetHeight - bottomOffset,
        );
        const nextY = Math.min(Math.max(window.scrollY - scrollStart, 0), maxY);

        targetY.set(nextY);
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [bottomOffset, targetY, topOffset]);

  return { containerRef, followerRef, y };
}
