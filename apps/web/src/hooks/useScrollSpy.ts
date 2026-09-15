"use client";
import { useEffect, useState } from "react";

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

        if (!section) continue;

        // offsetTop은 루트에 걸린 zoom이 반영되지 않아 scrollY와 좌표계가 어긋난다.
        // 문서 기준 좌표로 변환해 비교한다.
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;

        if (scrollPosition >= sectionTop) {
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
