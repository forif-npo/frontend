"use client";

import { Accordion } from "@ui/components/client";
import { Tag } from "@ui/components/server";

import type { FaqPost } from "../types/faq.type";
import { FAQ_TAG_STYLE } from "../constants/faq.tag.constants";

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
    const tagStyle = FAQ_TAG_STYLE[item.tag]?.className ?? "px-2 py-0.5";

    return {
      title: item.title,
      children: (
        <div className="space-y-3">
          <div>
            <Tag label={item.tag} size="small" className={tagStyle} />
          </div>
          <div className="whitespace-pre-wrap text-sm leading-7 text-gray-800">
            {item.content}
          </div>
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
