"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "@repo/assets/icons/lucide";
import { getFaqs } from "@/features/support/faqs/api/faqs.api";
import type { FaqPost } from "@/features/support/faqs/types/faq.type";
import { MobileContentCard } from "./MobileContentCard";

export function MobileFAQSection() {
  const [faqs, setFaqs] = useState<FaqPost[]>([]);

  useEffect(() => {
    getFaqs()
      .then((items) => setFaqs(items.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <MobileContentCard
      icon={CalendarDays}
      title="자주 묻는 질문"
      moreHref="/support/faqs"
      items={faqs.map((faq) => ({ id: faq.postId, title: faq.title }))}
    >
      {faqs.length === 0 && (
        <p className="text-text-subtle text-body-s leading-[1.5]">
          등록된 FAQ가 없습니다.
        </p>
      )}
    </MobileContentCard>
  );
}
