"use client";

import { Accordion } from "@ui/components/client";
import { Tag } from "@ui/components/server";

import type { FaqPost } from "../types/faq.type";

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

  const accordionItems = items.map((item) => {
    return {
      title: item.title,
      tagSlot: <Tag label={item.tag} size="small" />,
      children: (
        <div className="space-y-3 px-5">
          <div className="text-sm leading-7 text-gray-800">{item.content}</div>
        </div>
      ),
    };
  });

  return (
    <div className="mt-6">
      <Accordion items={accordionItems} />
    </div>
  );
}
