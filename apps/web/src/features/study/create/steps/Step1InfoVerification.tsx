"use client";

import { Button, TextInput } from "@ui/components/client";
import { GuideCheckIcon } from "@ui/components/server";
import { StudyCreateStepIndicator } from "./StudyCreateStepIndicator";
import type { UserInfo } from "../types";

function AnnotationIcon({ className }: { className?: string }) {
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

interface Step1InfoVerificationProps {
  userInfo: UserInfo;
  onNext: () => void;
  onCancel: () => void;
}

export function Step1InfoVerification({
  userInfo,
  onNext,
  onCancel,
}: Step1InfoVerificationProps) {
  return (
    <div className="mx-auto mb-16 flex w-full max-w-[792px] flex-col gap-10 pb-16">
      {/* Page Title */}
      <h1 className="text-[28px] font-bold leading-[1.5] tracking-[1px] text-[#052b57] sm:text-[40px]">
        2025-2 스터디 개설 신청
      </h1>

      {/* Form Content */}
      <div className="flex flex-col gap-6">
        {/* 시작하기 전에 */}
        <div className="flex flex-col gap-6 rounded-[12px] border border-[#d6e0eb] bg-[#eef2f7] p-5 sm:p-10">
          {/* Title + Description */}
          <div className="flex flex-col gap-6 border-b border-dashed border-[#b1b8be] pb-6">
            <div className="flex items-center gap-1">
              <GuideCheckIcon width={32} height={32} />
              <h2 className="text-text-bolder text-[24px] font-bold leading-[1.5]">
                시작하기 전에
              </h2>
            </div>

            <p className="text-text-basic text-[19px] leading-[1.5]">
              인터넷 신청은 본인과 등록된 거주인만 가능하며 무료로 발급받을 수
              있습니다.
              <br />
              본인 인증되지 않은 경우는 거주지 읍면동에 방문하거나 우편으로
              신청, 발급받을 수 있으며 발급 비용이 발생합니다.
            </p>
          </div>

          {/* Step Indicator */}
          <StudyCreateStepIndicator />
        </div>

        {/* 기본 신청 정보 */}
        <div className="flex flex-col gap-6 rounded-[12px] border border-[#b1b8be] bg-white p-5 sm:p-10">
          <h2 className="text-text-bolder text-[24px] font-bold leading-[1.5]">
            기본 신청 정보를 확인해주세요
          </h2>

          <div className="flex flex-col gap-0">
            {/* 학번 */}
            <div className="flex flex-col gap-6">
              <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
                학번
              </h3>
              <TextInput
                id="studentId"
                length="full"
                value={userInfo.studentId}
                readOnly
                disabled
              />
            </div>

            {/* 이름 */}
            <div className="mt-8 flex flex-col gap-6">
              <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
                이름
              </h3>
              <TextInput
                id="name"
                length="full"
                value={userInfo.name}
                readOnly
                disabled
              />
            </div>

            {/* 학과 */}
            <div className="mt-8 flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
                  학과
                </h3>
              </div>
              <TextInput
                id="department"
                length="full"
                value={userInfo.department}
                readOnly
                disabled
              />
            </div>

            {/* 휴대폰번호 */}
            <div className="mt-8 flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
                  휴대폰번호
                </h3>
                <AnnotationIcon className="text-text-subtle h-6 w-6" />
              </div>
              <TextInput
                id="phone"
                length="full"
                value={userInfo.phone}
                readOnly
                disabled
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-start gap-4">
          <div className="flex flex-1 gap-4">
            <Button
              variant="tertiary"
              size="large"
              onClick={onCancel}
              className="h-14 min-w-[90px]"
            >
              취소하기
            </Button>
            <Button
              variant="secondary"
              size="large"
              onClick={() => {
                /* TODO: 멘토 추가 기능 */
              }}
              className="h-14 min-w-[90px]"
            >
              멘토 추가
            </Button>
          </div>
          <Button
            variant="primary"
            size="large"
            onClick={onNext}
            className="h-14 min-w-[90px]"
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
