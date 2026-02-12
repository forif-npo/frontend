"use client";

import { useState } from "react";
import Link from "next/link";

interface StudyApplyHelpPanelProps {
  defaultOpen?: boolean;
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.5 2.5L2.5 8.5M2.5 2.5L8.5 8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HelpCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6 6C6 4.89543 6.89543 4 8 4C9.10457 4 10 4.89543 10 6C10 7.10457 9.10457 8 8 8V9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 8V13M12 16H12.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.29167 1.375H4.125L5.04167 3.66667L3.66667 4.58333C4.125 5.95833 5.04167 6.875 6.41667 7.33333L7.33333 5.95833L9.625 6.875V8.70833C9.625 9.21459 9.21459 9.625 8.70833 9.625C4.15233 9.625 1.375 6.84767 1.375 2.29167C1.375 1.78541 1.78541 1.375 2.29167 1.375Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function QuestionIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1" />
      <path
        d="M4.125 4.125C4.125 3.36561 4.74061 2.75 5.5 2.75C6.25939 2.75 6.875 3.36561 6.875 4.125C6.875 4.88439 6.25939 5.5 5.5 5.5V6.1875"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="5.5" cy="7.5625" r="0.4375" fill="currentColor" />
    </svg>
  );
}

export function StudyApplyHelpPanel({
  defaultOpen = false,
}: StudyApplyHelpPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-[200px] z-50 flex h-10 items-center gap-2 rounded-l-md border border-r-0 border-[#b1b8be] bg-[#f4f5f6] px-3 shadow-lg"
      >
        <HelpCircleIcon className="text-text-subtle h-4 w-4" />
        <span className="text-text-basic text-[15px] leading-[1.5]">도움</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 right-0 top-[64px] z-50 flex w-full flex-col gap-8 border-l border-[#b1b8be] bg-[#f4f5f6] px-6 py-8 shadow-[0px_0px_2px_0px_rgba(0,0,0,0.08),0px_8px_16px_0px_rgba(0,0,0,0.12)] sm:px-10 sm:py-10 lg:bottom-48 lg:left-auto lg:top-[200px] lg:w-[390px]">
      {/* Header */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex w-full flex-col items-end">
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-10 min-w-10 items-center justify-center gap-1 rounded-md border border-[#58616a] bg-transparent px-3"
          >
            <span className="text-text-basic text-[15px] leading-[1.5]">
              접어두기
            </span>
            <CloseIcon className="text-text-basic h-[11px] w-[11px]" />
          </button>

          {/* Single Tab */}
          <div className="flex w-full items-center">
            <div className="flex items-start gap-2">
              <div className="border-secondary flex h-10 min-w-14 items-center justify-center border-b-[3px] px-1">
                <span className="text-secondary text-[17px] font-bold leading-[1.5]">
                  도움
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <h3 className="text-text-bolder text-[19px] font-bold leading-[1.5]">
            스터디 신청 중 어려움이 있으신가요?
          </h3>

          <div className="flex flex-wrap items-start gap-2">
            <div className="flex shrink-0 flex-col items-start justify-center">
              <InfoIcon className="text-text-subtle h-6 w-6" />
            </div>
            <p className="text-text-subtle flex-1 text-[17px] leading-[1.5]">
              버튼을 눌러 지금 나에게 필요한 여러 가지 정보를 확인해 보세요.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {/* Divider */}
          <div className="h-px w-full bg-[#cdd1d5]" />

          {/* 기타 문의/도움말 */}
          <div className="flex flex-col gap-4">
            <h4 className="text-text-bolder text-[17px] font-bold leading-[1.5]">
              기타 문의/도움말
            </h4>

            <div className="flex flex-col gap-3">
              <Link
                href="https://open.kakao.com/o/forif"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-basic flex h-5 items-center gap-0.5 px-0.5 text-[15px] leading-[1.5] hover:underline"
              >
                <PhoneIcon className="mr-0.5 h-[11px] w-[11px]" />
                <span>카카오톡 오픈 채널</span>
              </Link>
              <Link
                href="/faq"
                className="text-text-basic flex h-5 items-center gap-0.5 px-0.5 text-[15px] leading-[1.5] hover:underline"
              >
                <QuestionIcon className="mr-0.5 h-[11px] w-[11px]" />
                <span>자주 묻는 질문 확인하기</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
