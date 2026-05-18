"use client";

import { useRouter } from "next/navigation";

import { AngleIcon } from "@repo/assets/icons/krds";

import type { AnnouncementPost } from "../types/announcement.type";

type AnnouncementListItemProps = {
  item: AnnouncementPost;
};

export function AnnouncementListItem({ item }: AnnouncementListItemProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/support/announcements/${item.postId}`)}
      className="border-divider-gray-light flex w-full cursor-pointer items-center justify-between gap-6 border-t bg-white px-0 py-6 text-left"
    >
      <div className="flex min-w-0 flex-col gap-2">
        <div className="truncate text-base font-bold text-gray-900">
          {item.title}
        </div>
        <div className="text-sm text-gray-500">
          {new Date(item.createdAt).toLocaleDateString("ko-KR")}
        </div>
      </div>

      <AngleIcon className="h-5 w-5 shrink-0 -rotate-90 text-gray-500" />
    </button>
  );
}
