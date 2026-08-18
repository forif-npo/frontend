"use client";

import { STUDY_DIFFICULTY_GUIDE } from "@/constants/study";
import { QuestionBubble } from "@repo/assets/icons/krds";
import { Modal } from "@ui/components/client";
import { useState } from "react";

export function DifficultyGuideTooltip() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="스터디 난이도 가이드 보기"
        aria-haspopup="dialog"
        className="focus-visible:ring-primary rounded-sm p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        onClick={() => setIsOpen(true)}
      >
        <QuestionBubble width={20} height={20} />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="스터디 난이도 가이드"
        width="m"
        showCancelButton={false}
        showFooterBorder={false}
      >
        <ul className="flex flex-col pb-6">
          {STUDY_DIFFICULTY_GUIDE.map((difficulty) => (
            <li key={difficulty.label} className="py-2 first:pt-0 last:pb-0">
              <p className="text-text-basic text-base font-bold leading-6">
                <span className="text-warning-30" aria-hidden="true">
                  {difficulty.stars}{" "}
                </span>
                {difficulty.label}
              </p>
              <p className="text-text-subtle mt-1 text-[15px] leading-6">
                {difficulty.description}
              </p>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
}
