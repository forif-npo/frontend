"use client";

import { useEffect, useMemo, useState } from "react";
import { getAnnouncements } from "../api/announcements.api";
import type { AnnouncementPost } from "../types/announcement.type";

type UseAnnouncementListOptions = {
  query: string;
  page: number;
  pageSize: number;
};

const normalize = (v: string) => v.trim().toLowerCase();

export const useAnnouncementList = ({
  query,
  page,
  pageSize,
}: UseAnnouncementListOptions) => {
  const [allItems, setAllItems] = useState<AnnouncementPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setErrorMessage(null);

    getAnnouncements()
      .then((items) => {
        if (!mounted) return;

        const sorted = [...items].sort((a, b) => {
          const at = new Date(a.createdAt).getTime();
          const bt = new Date(b.createdAt).getTime();
          return bt - at;
        });

        setAllItems(sorted);
      })
      .catch((e) => {
        if (!mounted) return;
        setErrorMessage(
          e instanceof Error ? e.message : "공지사항 조회에 실패했습니다.",
        );
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return allItems;

    return allItems.filter((it) => {
      const title = normalize(it.title);
      const content = normalize(it.content);
      return title.includes(q) || content.includes(q);
    });
  }, [allItems, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const items = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);

  return { items, total, totalPages, page: safePage, isLoading, errorMessage };
};
