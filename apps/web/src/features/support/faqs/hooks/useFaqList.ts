"use client";

import { useEffect, useMemo, useState } from "react";
import { getFaqs } from "../api/faqs.api";
import type { FaqPost } from "../types/faq.type";

type UseFaqListOptions = {
  query: string;
  page: number;
  pageSize: number;
};

const normalize = (value: string) => value.trim().toLowerCase();

export const useFaqList = ({ query, page, pageSize }: UseFaqListOptions) => {
  const [allItems, setAllItems] = useState<FaqPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setErrorMessage(null);

    getFaqs()
      .then((items) => {
        if (!mounted) return;

        // 최신순 느낌으로 정렬(원하면 제거 가능)
        const sorted = [...items].sort((a, b) => {
          const at = new Date(a.createdAt).getTime();
          const bt = new Date(b.createdAt).getTime();
          return bt - at;
        });

        setAllItems(sorted);
      })
      .catch((e) => {
        if (!mounted) return;
        console.error("[useFaqList] getFaqs failed:", e);
        setErrorMessage("FAQ를 불러오지 못했습니다.");
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
      const tag = normalize(it.tag);
      return title.includes(q) || content.includes(q) || tag.includes(q);
    });
  }, [allItems, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const items = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);

  return {
    items,
    total,
    totalPages,
    page: safePage,
    isLoading,
    errorMessage,
  };
};
