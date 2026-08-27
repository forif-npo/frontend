"use client";

import { Accordion } from "@ui/components/client";
import { Badge, type BadgeProps } from "@ui/components/server";

import type { FaqPost } from "../types/faq.type";

type FaqAccordionListProps = {
  items: FaqPost[];
  hasQuery?: boolean;
};

const FAQ_TAG_VARIANTS: Record<string, BadgeProps["variant"]> = {
  스터디: "info",
  동아리: "primary",
  가입: "success",
  부원: "success",
  회비: "warning",
  시설: "danger",
  기타: "disabled",
};

function getFaqTagVariant(tag: string): BadgeProps["variant"] {
  return FAQ_TAG_VARIANTS[tag.trim()] ?? "primary";
}

export function FaqAccordionList({
  items,
  hasQuery = false,
}: FaqAccordionListProps) {
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
      leadingSlot: (
        <span
          aria-hidden="true"
          className="bg-primary-50 text-text-basic-inverse inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-bold"
        >
          Q
        </span>
      ),
      tagSlot: (
        <Badge
          label={item.tag}
          variant={getFaqTagVariant(item.tag)}
          appearance="solid-pastel"
          size="small"
        />
      ),
      children: (
        <div className="flex items-start gap-[14px]">
          <span className="flex h-10 w-10 shrink-0 items-start justify-center">
            <span
              aria-hidden="true"
              className="border-border-information bg-information-5 text-text-information inline-flex h-7 w-7 items-center justify-center rounded-lg border text-sm font-bold"
            >
              A
            </span>
          </span>
          <p className="whitespace-pre-line text-sm leading-7 text-gray-800">
            {item.content}
          </p>
        </div>
      ),
    };
  });

  return (
    <div className="mt-6">
      <Accordion
        items={accordionItems}
        defaultOpenIndex={hasQuery ? 0 : null}
      />
    </div>
  );
}
