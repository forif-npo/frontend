"use client";

import type { AnnouncementPost } from "../types/announcement.type";
import { EmptyState } from "@ui/components/server";
import { AnnouncementListItem } from "./AnnouncementListItem";

type Props = { items: AnnouncementPost[] };

export function AnnouncementList({ items }: Props) {
  if (items.length === 0) {
    return <EmptyState title="검색 결과가 없습니다." />;
  }

  return (
    <div className="mt-4 space-y-3">
      {items.map((it) => (
        <AnnouncementListItem key={it.postId} item={it} />
      ))}
    </div>
  );
}
