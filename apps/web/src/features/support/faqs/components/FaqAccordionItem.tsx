"use client";

import { useId, useState } from "react";
import type { FaqPost } from "../types/faq.type";
import { Tag } from "@ui/components/server";
import { getFaqTagClassName } from "../constants/faq.tag.constants";

type FaqAccordionItemProps = {
  item: FaqPost;
};

export function FaqAccordionItem({ item }: FaqAccordionItemProps) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-gray-900">
            {item.title}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Tag
            label={item.tag}
            size="small"
            className={getFaqTagClassName(item.tag)}
          />

          <span className="text-gray-500">{open ? "▴" : "▾"}</span>
        </div>
      </button>

      {open && (
        <div
          id={contentId}
          className="border-t border-gray-200 bg-gray-50 px-6 py-5"
        >
          <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-gray-800">
            {item.content}
          </pre>
        </div>
      )}
    </div>
  );
}
