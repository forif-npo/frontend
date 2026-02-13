"use client";

import { useRouter } from "next/navigation";
import type { AnnouncementPost } from "../types/announcement.type";

type AnnouncementListItemProps = {
  item: AnnouncementPost;
};

export function AnnouncementListItem({ item }: AnnouncementListItemProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/support/announcements/${item.post_id}`)}
      className="flex w-full flex-col gap-2 rounded-lg border border-gray-200 bg-white px-6 py-5 text-left hover:bg-gray-50"
    >
      <div className="text-sm text-gray-500">
        {new Date(item.created_at).toLocaleDateString("ko-KR")}
      </div>

      <div className="text-base font-medium text-gray-900">{item.title}</div>
    </button>
  );
}
