"use client";
import { Accordion } from "@ui/components/client";
import { Badge, EmptyState, type BadgeProps } from "@ui/components/server";
import type { FaqPost } from "../types/faq.type";

type FaqAccordionListProps = {
  items: FaqPost[];
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

export function FaqAccordionList({ items }: FaqAccordionListProps) {
  if (items.length === 0) {
    return <EmptyState title="검색 결과가 없습니다." />;
  }

  const accordionItems = items.map((item) => {
    return {
      title: <span className="text-title-l">Q. {item.title}</span>,
      tagSlot: (
        <Badge
          label={item.tag}
          variant={getFaqTagVariant(item.tag)}
          appearance="solid-pastel"
          size="small"
        />
      ),
      children: (
        <p className="text-text-basic text-body-l whitespace-pre-line leading-8">
          {item.content}
        </p>
      ),
    };
  });

  return (
    <div className="mt-8">
      <Accordion
        items={accordionItems}
        contentClassName="px-4 pb-6 pt-0 md:px-6 md:pb-8"
      />
    </div>
  );
}
