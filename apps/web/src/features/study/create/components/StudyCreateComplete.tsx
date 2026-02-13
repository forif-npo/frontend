"use client";

import { Button } from "@ui/components/client";
import Link from "next/link";

interface StudyCreateCompleteProps {
  onGoToStudyList: () => void;
}

function CheckCircleIcon() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="40" cy="40" r="36" fill="#063a74" />
      <path
        d="M24 40L35 51L56 29"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 4L10 8L6 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StudyCreateComplete({
  onGoToStudyList,
}: StudyCreateCompleteProps) {
  return (
    <div className="mx-auto mb-16 flex w-full max-w-[792px] flex-col items-center gap-8 pt-6 sm:gap-12 sm:pt-10">
      {/* Check Icon */}
      <CheckCircleIcon />

      {/* Title */}
      <div className="text-center">
        <h1 className="text-text-basic text-[28px] font-bold leading-[1.5] tracking-[1px] sm:text-[40px]">
          스터디 개설 신청이
          <br />
          완료되었습니다!
        </h1>
      </div>

      <p className="text-text-subtle text-center text-[17px] leading-[1.5]">
        신청서 검토 후 결과를 알려드리겠습니다.
      </p>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          variant="primary"
          size="large"
          onClick={onGoToStudyList}
          className="h-16 min-w-[98px] px-6"
        >
          스터디 보러 가기
        </Button>
      </div>

      {/* Suggested Services */}
      <div className="w-full rounded-[12px] bg-[#f4f5f6] p-5 sm:p-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5 border-b border-[#cdd1d5] pb-6">
            <h2 className="text-text-basic text-[19px] font-bold leading-[1.5]">
              이런 서비스는 어떠세요?
            </h2>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4">
            <ServiceLink href="/study/list" label="스터디 목록" />
            <ServiceLink href="/club-room" label="동아리방" />
            <ServiceLink href="/about" label="동아리소개" />
            <ServiceLink href="/blog" label="기술 블로그" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-text-basic flex h-8 items-center gap-1 rounded px-0.5 text-[17px] leading-[1.5] hover:underline"
    >
      {label}
      <ChevronRightIcon className="h-4 w-4" />
    </Link>
  );
}
