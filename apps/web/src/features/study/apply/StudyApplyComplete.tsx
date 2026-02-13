"use client";

import { Button } from "@ui/components/client";
import Link from "next/link";

type UserInfo = {
  studentId: string;
  name: string;
  department: string;
  phone: string;
};

interface StudyApplyCompleteProps {
  studyName: string;
  userInfo: UserInfo;
  priority: "1순위" | "2순위";
  onGoToApplicationList: () => void;
  onApplySecondStudy?: () => void;
  showSecondStudyButton?: boolean;
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

export function StudyApplyComplete({
  studyName,
  userInfo,
  priority,
  onGoToApplicationList,
  onApplySecondStudy,
  showSecondStudyButton = true,
}: StudyApplyCompleteProps) {
  return (
    <div className="mx-auto mb-16 flex w-full max-w-[792px] flex-col items-center gap-8 pt-6 sm:gap-12 sm:pt-10">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-[28px] font-bold leading-[1.5] tracking-[1px] sm:text-[40px]">
          <span className="text-primary">{studyName}</span>
          <br />
          <span className="text-text-basic">스터디 신청이 완료되었습니다.</span>
        </h1>
      </div>

      {/* Content */}
      <div className="flex w-full flex-col gap-16">
        {/* Application Summary */}
        <div className="flex flex-col items-center gap-10">
          {/* Summary Card */}
          <div className="w-full rounded-[12px] bg-[#eef2f7] p-5 sm:p-10">
            <div className="flex flex-col gap-6">
              {/* User Info */}
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <p className="text-text-basic text-[17px] font-bold leading-[1.5] sm:w-[191px] sm:text-[19px]">
                  신청 부원 정보
                </p>
                <div className="text-text-basic flex flex-1 flex-col gap-2 text-[17px] leading-[1.5] sm:gap-4 sm:text-[19px]">
                  <p>{userInfo.studentId}</p>
                  <p>{userInfo.department}</p>
                  <p>{userInfo.name}</p>
                  <p>{userInfo.phone}</p>
                </div>
              </div>

              {/* Priority */}
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <p className="text-text-basic text-[17px] font-bold leading-[1.5] sm:w-[191px] sm:text-[19px]">
                  스터디 우선순위
                </p>
                <div className="text-text-basic flex flex-1 flex-col text-[17px] leading-[1.5] sm:text-[19px]">
                  <p>{priority}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="tertiary"
              size="large"
              onClick={onGoToApplicationList}
              className="h-16 min-w-[98px] px-6"
            >
              지원서 목록
            </Button>
            {showSecondStudyButton && onApplySecondStudy && (
              <Button
                variant="primary"
                size="large"
                onClick={onApplySecondStudy}
                className="h-16 min-w-[98px] px-6"
              >
                2순위 스터디 신청
              </Button>
            )}
          </div>
        </div>

        {/* Suggested Services */}
        <div className="w-full rounded-[12px] bg-[#f4f5f6] p-5 sm:p-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-5 border-b border-[#cdd1d5] pb-6">
              <h2 className="text-text-basic text-[19px] font-bold leading-[1.5]">
                이런 서비스는 어떠세요?
              </h2>
              <p className="text-text-basic text-[17px] leading-[1.5]">
                &apos;스터디 신청&apos; 서비스를 사용하는 부원들이 일반적으로
                함께 이용한 민원입니다.
              </p>
            </div>

            {/* Service Links */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <ServiceLink href="/study/list" label="스터디 목록" />
              <ServiceLink href="/club-room" label="동아리방" />
              <ServiceLink href="/about" label="동아리소개" />
              <ServiceLink href="/blog" label="기술 블로그" />
            </div>
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
