"use client";

import { Button } from "@ui/components/client";

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
  onGoToApplicationList: () => void;
  onApplySecondStudy?: () => void;
  showSecondStudyButton?: boolean;
}

export function StudyApplyComplete({
  studyName,
  userInfo,
  priority,
  intro,
  onGoToApplicationList,
  onApplySecondStudy,
  showSecondStudyButton = true,
}: StudyApplyCompleteProps) {
  return (
    <div className="mx-auto flex w-full max-w-[792px] flex-col items-center gap-12 pb-16 pt-10">
      {/* Title */}
      <h1 className="text-center text-[40px] font-bold leading-[1.5]">
        <span className="text-[#0b50d0]">{studyName}</span>
        <br />
        <span className="text-text-bolder">스터디 지원이 완료되었습니다.</span>
      </h1>

      {/* Detail Card */}
      <div className="w-full rounded-xl bg-[#eef2f7] p-10">
        <div className="flex flex-col gap-6">
          {/* 신청 부원 정보 */}
          <div className="flex gap-3">
            <p className="text-text-bolder w-[191px] shrink-0 text-[19px] font-bold leading-[1.5]">
              신청 부원 정보
            </p>
            <div className="text-text-basic flex flex-col gap-4 text-[19px] leading-[1.5]">
              <p>{userInfo.studentId}</p>
              <p>{userInfo.department}</p>
              <p>{userInfo.name}</p>
              <p>{userInfo.phone}</p>
            </div>
          </div>

          {/* 지원 순위 */}
          <div className="flex gap-3">
            <p className="text-text-bolder w-[191px] shrink-0 text-[19px] font-bold leading-[1.5]">
              지원 순위
            </p>
            <p className="text-text-basic text-[19px] leading-[1.5]">
              {priority}
            </p>
          </div>

          {/* 지원 사유 */}
          <div className="flex gap-3">
            <p className="text-text-bolder w-[191px] shrink-0 text-[19px] font-bold leading-[1.5]">
              지원 사유
            </p>
            <p className="text-text-basic flex-1 break-words text-[19px] leading-[1.5]">
              {intro}
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <Button
          variant="secondary"
          size="large"
          onClick={onGoToApplicationList}
          className="h-16 w-[136px]"
        >
          지원서 확인
        </Button>
        {showSecondStudyButton && onApplySecondStudy && (
          <Button
            variant="primary"
            size="large"
            onClick={onApplySecondStudy}
            className="h-16 w-[202px]"
          >
            2순위 지원하러 가기
          </Button>
        )}
      </div>
    </div>
  );
}
