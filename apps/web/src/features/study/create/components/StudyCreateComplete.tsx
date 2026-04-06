"use client";

import { Button } from "@ui/components/client";

interface StudyCreateCompleteProps {
  onGoToStudyList: () => void;
  onGoToApplication?: () => void;
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

export function StudyCreateComplete({
  onGoToStudyList,
  onGoToApplication,
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
        {onGoToApplication && (
          <Button
            variant="secondary"
            size="large"
            onClick={onGoToApplication}
            className="h-16 min-w-[98px] px-6"
          >
            신청서 확인
          </Button>
        )}
        <Button
          variant="primary"
          size="large"
          onClick={onGoToStudyList}
          className="h-16 min-w-[98px] px-6"
        >
          스터디 목록
        </Button>
      </div>
    </div>
  );
}
