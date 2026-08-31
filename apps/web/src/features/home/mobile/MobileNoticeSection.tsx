"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "@repo/assets/icons/lucide";
import { getAnnouncements } from "@/features/support/announcements/api/announcements.api";
import type { AnnouncementPost } from "@/features/support/announcements/types/announcement.type";
import { MobileContentCard } from "./MobileContentCard";

export function MobileNoticeSection() {
  const [notices, setNotices] = useState<AnnouncementPost[]>([]);

  useEffect(() => {
    getAnnouncements()
      .then((items) => setNotices(items.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <MobileContentCard
      icon={CalendarDays}
      title="공지사항"
      moreHref="/support/announcements"
      items={notices.map((notice) => ({
        id: notice.postId,
        title: notice.title,
        href: `/support/announcements/${notice.postId}`,
      }))}
    >
      {notices.length === 0 && (
        <p className="text-text-subtle text-body-s leading-[1.5]">
          등록된 공지사항이 없습니다.
        </p>
      )}
    </MobileContentCard>
  );
}
