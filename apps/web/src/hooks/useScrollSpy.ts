"use client";

import { useEffect, useRef, useState } from "react";

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
}

export function useScrollFollower<
  TContainer extends HTMLElement,
  TFollower extends HTMLElement,
>({ topOffset = 120 }: UseScrollFollowerOptions = {}) {
  const containerRef = useRef<TContainer | null>(null);
  const followerRef = useRef<TFollower | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let frame = 0;

    const updatePosition = () => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const container = containerRef.current;
        const follower = followerRef.current;

        if (!container || !follower) return;

        const zoomValue = Number.parseFloat(
          window.getComputedStyle(document.documentElement).zoom,
        );
        const pageZoom =
          Number.isFinite(zoomValue) && zoomValue > 0 ? zoomValue : 1;
        const currentMarginTop = Number.parseFloat(
          window.getComputedStyle(follower).marginTop,
        );
        const normalizedMarginTop = Number.isFinite(currentMarginTop)
          ? currentMarginTop
          : 0;
        const naturalTop =
          follower.getBoundingClientRect().top +
          window.scrollY -
          normalizedMarginTop * pageZoom;
        const nextY = Math.max(
          (window.scrollY + topOffset - naturalTop) / pageZoom,
          0,
        );

        setOffset((prev) => (Math.abs(prev - nextY) < 0.5 ? prev : nextY));
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
  }, [topOffset]);

  return { containerRef, followerRef, offset };
}
