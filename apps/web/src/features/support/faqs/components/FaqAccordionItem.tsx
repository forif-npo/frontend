"use client";

import { useId, useState } from "react";
import type { FaqPost } from "../types/faq.type";
import { Tag } from "@ui/components/server";
import { FAQ_TAG_STYLE } from "../constants/faq.tag.constants";

type FaqAccordionItemProps = {
  item: FaqPost;
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`fill-none stroke-gray-500 transition-transform ${
        open ? "rotate-180" : "rotate-0"
      }`}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FaqAccordionItem({ item }: FaqAccordionItemProps) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  const tagStyle = FAQ_TAG_STYLE[item.tag]?.className ?? "px-3 py-0.5";
  const tagLabel = item.tag;

  return (
    <div
      className={`overflow-hidden rounded-2xl transition-colors ${
        open ? "bg-gray-10" : "bg-white"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full items-center justify-between gap-4 px-8 py-6 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="truncate text-base font-bold">{item.title}</div>
        </div>

        <div className="flex items-center gap-3">
          <Tag label={tagLabel} size="small" className={tagStyle} />
          <ChevronIcon open={open} />
        </div>
      </button>

      {open && (
        <div id={contentId} className="px-8 pb-8">
          <div className="rounded-xl bg-white px-6 py-5">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-gray-800">
              {item.content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
