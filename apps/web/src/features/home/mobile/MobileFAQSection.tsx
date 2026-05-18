"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronRight } from "@repo/assets/icons/lucide";
import { getFaqs } from "@/features/support/faqs/api/faqs.api";
import type { FaqPost } from "@/features/support/faqs/types/faq.type";

export function MobileFAQSection() {
  const [faqs, setFaqs] = useState<FaqPost[]>([]);

  useEffect(() => {
    getFaqs()
      .then((items) => setFaqs(items.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-[#cdd1d5] p-6 shadow-[0px_0px_2px_0px_rgba(0,0,0,0.05),0px_4px_8px_0px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <CalendarDays
            size={24}
            strokeWidth={1.5}
            className="text-text-basic"
          />
          <span className="text-[19px] font-bold leading-[1.5] text-black">
            자주 묻는 질문
          </span>
        </div>
        <Link
          href="/support/faqs"
          className="flex h-8 items-center gap-1 px-0.5 text-[17px] leading-[1.5] text-[#1e2124]"
        >
          더보기
          <ChevronRight size={20} className="text-[#1e2124]" />
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        {faqs.length > 0 ? (
          faqs.map((faq) => (
            <p
              key={faq.postId}
              className="truncate text-[17px] leading-[1.5] text-black"
            >
              {faq.title}
            </p>
          ))
        ) : (
          <p className="text-text-subtle text-[15px] leading-[1.5]">
            등록된 FAQ가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
