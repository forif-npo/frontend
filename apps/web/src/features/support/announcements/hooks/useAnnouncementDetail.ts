"use client";

import { useEffect, useState } from "react";
import { getAnnouncementById } from "../api/announcements.api";
import type { AnnouncementPost } from "../types/announcement.type";

export const useAnnouncementDetail = (id: number) => {
  const [item, setItem] = useState<AnnouncementPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setErrorMessage(null);

    getAnnouncementById(id)
      .then((data) => {
        if (!mounted) return;
        setItem(data);
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
  }, [id]);

  return { item, isLoading, errorMessage };
};
