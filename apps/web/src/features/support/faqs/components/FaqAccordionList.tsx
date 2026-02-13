"use client";

import type { FaqPost } from "../types/faq.type";
import { FaqAccordionItem } from "./FaqAccordionItem";

type FaqAccordionListProps = {
  items: FaqPost[];
};

export function FaqAccordionList({ items }: FaqAccordionListProps) {
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
        <FaqAccordionItem key={it.post_id} item={it} />
      ))}
    </div>
  );
}
