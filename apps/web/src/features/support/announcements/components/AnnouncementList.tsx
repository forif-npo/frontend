"use client";

import type { AnnouncementPost } from "../types/announcement.type";
import { AnnouncementListItem } from "./AnnouncementListItem";

type Props = { items: AnnouncementPost[] };

export function AnnouncementList({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-gray-500">
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {items.map((it) => (
        <AnnouncementListItem key={it.post_id} item={it} />
      ))}
    </div>
  );
}
