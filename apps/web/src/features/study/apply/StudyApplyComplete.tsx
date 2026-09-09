"use client";
import { Button } from "@ui/components/client";
import { formatPhoneNumber } from "@/hooks/useFormattedPhoneNumber";

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
  intro: string;
  isAutonomousStudy?: boolean;
  onGoToApplicationList: () => void;
  onApplySecondStudy?: () => void;
  showSecondStudyButton?: boolean;
}

export function StudyApplyComplete({
  studyName,
  userInfo,
  priority,
  intro,
  isAutonomousStudy = false,
  onGoToApplicationList,
  onApplySecondStudy,
  showSecondStudyButton = true,
}: StudyApplyCompleteProps) {
  return (
    <div className="mx-auto flex w-full max-w-[792px] flex-col items-center gap-8 pb-16 pt-10 sm:gap-12">
      {/* Title */}
      <h1 className="text-center text-[28px] font-bold leading-[1.5] sm:text-[40px]">
        <span className="text-text-primary">{studyName}</span>
        <br />
        <span className="text-text-bolder">스터디 지원이 완료되었습니다.</span>
      </h1>

      {/* Detail Card */}
      <div className="bg-surface-gray-subtle w-full rounded-xl p-5 sm:p-10">
        <div className="flex flex-col gap-6">
          {/* 신청 부원 정보 */}
          <div className="flex gap-3">
            <p className="text-text-bolder w-[112px] shrink-0 text-[15px] font-bold leading-[1.5] sm:w-[191px] sm:text-[19px]">
              신청 부원 정보
            </p>
            <div className="text-text-basic flex min-w-0 flex-col gap-2 break-words text-[15px] leading-[1.5] sm:gap-4 sm:text-[19px]">
              <p>{userInfo.studentId}</p>
              <p>{userInfo.department}</p>
              <p>{userInfo.name}</p>
              <p>{formatPhoneNumber(userInfo.phone)}</p>
            </div>
          </div>

          {/* 지원 순위 */}
          <div className="flex gap-3">
            <p className="text-text-bolder w-[112px] shrink-0 text-[15px] font-bold leading-[1.5] sm:w-[191px] sm:text-[19px]">
              지원 순위
            </p>
            <p className="text-text-basic text-[15px] leading-[1.5] sm:text-[19px]">
              {isAutonomousStudy ? "-" : priority}
            </p>
          </div>

          {/* 지원 사유 */}
          <div className="flex gap-3">
            <p className="text-text-bolder w-[112px] shrink-0 text-[15px] font-bold leading-[1.5] sm:w-[191px] sm:text-[19px]">
              지원 사유
            </p>
            <p className="text-text-basic min-w-0 flex-1 break-words text-[15px] leading-[1.5] sm:text-[19px]">
              {isAutonomousStudy ? "-" : intro}
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
        <Button
          variant="secondary"
          size="large"
          onClick={onGoToApplicationList}
          className="h-14 w-full sm:h-16 sm:w-[136px]"
        >
          지원서 확인
        </Button>
        {showSecondStudyButton && onApplySecondStudy && (
          <Button
            variant="primary"
            size="large"
            onClick={onApplySecondStudy}
            className="h-14 w-full sm:h-16 sm:w-[202px]"
          >
            2순위 지원하러 가기
          </Button>
        )}
      </div>
    </div>
  );
}
