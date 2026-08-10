"use client";

import type { ReactNode } from "react";
import { SuccessFillIcon } from "@repo/assets/icons/krds";
import { Button } from "@ui/components/client";
import type { StudyOpenValues } from "@core/schemas";
import { LOCATION_OPTIONS, WEEKDAY_OPTIONS } from "../constants";
import type { UserInfo } from "../types";

interface StudyCreateCompleteProps {
  values: StudyOpenValues;
  userInfo: UserInfo;
  onGoToStudyList: () => void;
  onGoToApplication?: () => void;
}

export function StudyCreateComplete({
  values,
  userInfo,
  onGoToStudyList,
  onGoToApplication,
}: StudyCreateCompleteProps) {
  const weekDayLabel =
    WEEKDAY_OPTIONS.find((option) => option.value === values.weekDay)?.label ??
    values.weekDay;
  const locationLabel =
    LOCATION_OPTIONS.find((option) => option.value === values.location)
      ?.label ?? values.location;
  const studyTime = `매주 ${weekDayLabel} ${values.startTime} ~ ${values.endTime}`;
  const studyLocation = values.isOnline
    ? "온라인"
    : [locationLabel, values.room.trim() ? `${values.room.trim()}호` : ""]
        .filter(Boolean)
        .join(" ");

  return (
    <div className="mx-auto flex w-full max-w-[792px] flex-col items-center gap-12 pb-16 pt-10">
      <SuccessFillIcon
        width={116}
        height={116}
        backgroundColor="var(--color-primary-50)"
      />

      <h1 className="text-center text-[28px] font-bold leading-[1.5] sm:text-[40px]">
        <span className="text-text-primary">{values.studyName}</span>
        <br />
        <span className="text-text-bolder">
          스터디 개설 신청이 완료되었습니다.
        </span>
      </h1>

      <p className="text-text-subtle -mt-6 text-center text-[17px] leading-[1.5]">
        신청서 검토 후 결과를 알려드리겠습니다.
      </p>

      <section className="bg-surface-gray-subtle w-full rounded-xl p-5 sm:p-10">
        <div className="flex flex-col gap-6">
          <CompleteInfoRow label="개설자 정보">
            <p>{userInfo.studentId}</p>
            <p>{userInfo.department}</p>
            <p>{userInfo.name}</p>
            <p>{userInfo.phone}</p>
          </CompleteInfoRow>
          <CompleteInfoRow label="진행 일정">
            <p>{studyTime}</p>
          </CompleteInfoRow>
          <CompleteInfoRow label="진행 장소">
            <p>{studyLocation}</p>
          </CompleteInfoRow>
        </div>
      </section>

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

function CompleteInfoRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <p className="text-text-bolder w-[112px] shrink-0 text-[15px] font-bold leading-[1.5] sm:w-[191px] sm:text-[19px]">
        {label}
      </p>
      <div className="text-text-basic flex flex-col gap-2 text-[15px] leading-[1.5] sm:gap-4 sm:text-[19px]">
        {children}
      </div>
    </div>
  );
}
