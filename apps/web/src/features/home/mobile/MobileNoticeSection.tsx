"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronRight } from "@repo/assets/icons/lucide";
import { getAnnouncements } from "@/features/support/announcements/api/announcements.api";
import type { AnnouncementPost } from "@/features/support/announcements/types/announcement.type";

export function MobileNoticeSection() {
  const [notices, setNotices] = useState<AnnouncementPost[]>([]);

  useEffect(() => {
    getAnnouncements()
      .then((items) => setNotices(items.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-[#cdd1d5] p-6 shadow-[0px_0px_2px_0px_rgba(0,0,0,0.05),0px_4px_8px_0px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <CalendarDays
            size={24}
            strokeWidth={1.5}
            className="text-text-basic"
          />
          <span className="text-[19px] font-bold leading-[1.5] text-black">
            공지사항
          </span>
        </div>
        <Link
          href="/support/announcements"
          className="flex h-8 items-center gap-1 px-0.5 text-[17px] leading-[1.5] text-[#1e2124]"
        >
          더보기
          <ChevronRight size={20} className="text-[#1e2124]" />
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        {notices.length > 0 ? (
          notices.map((notice) => (
            <Link
              key={notice.postId}
              href={`/support/announcements/${notice.postId}`}
              className="truncate text-[17px] leading-[1.5] text-black"
            >
              {notice.title}
            </Link>
          ))
        ) : (
          <p className="text-text-subtle text-[15px] leading-[1.5]">
            등록된 공지사항이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
