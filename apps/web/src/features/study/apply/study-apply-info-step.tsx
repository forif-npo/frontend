"use client";

import { Button, TextInput } from "@ui/components/client";
import { GuideCheckIcon, RoundCheckIcon } from "@ui/components/server";
import { QuestionBubble } from "@repo/assets/icons/krds";
import { StudyApplyTitle } from "./StudyApplyTitle";
import { BadgeTag } from "./utils";

type UserInfo = {
  studentId: string;
  name: string;
  department: string;
  phone: string;
};

interface StudyApplyInfoStepProps {
  studyName: string;
  tags: BadgeTag[];
  userInfo: UserInfo;
  onNext: () => void;
  onCancel: () => void;
}

export function StudyApplyInfoStep({
  studyName,
  tags,
  userInfo,
  onNext,
  onCancel,
}: StudyApplyInfoStepProps) {
  return (
    <div className="mx-auto mb-16 flex w-full max-w-[792px] flex-col">
      <StudyApplyTitle studyName={studyName} tags={tags} />

      <div className="flex flex-col gap-6 sm:gap-10">
        <div className="flex flex-col gap-4 rounded-[12px] border border-[#d6e0eb] bg-[#eef2f7] p-5 sm:gap-6 sm:p-10">
          <div className="flex flex-col gap-6 border-b border-dashed border-[#b1b8be] pb-6">
            <div className="flex items-center gap-1">
              <div className="p-1">
                <GuideCheckIcon width={24} height={24} />
              </div>
              <h2 className="text-text-bolder text-[24px] font-bold leading-[1.5]">
                시작하기 전에
              </h2>
            </div>

            <p className="text-text-basic text-[19px] leading-[1.5]">
              스터디 개설은 지식의 선순환을 실천하고 싶은 FORIF의 부원이라면
              누구나 가능합니다.
              <br />
              여러분의 다양한 프로그래밍 지식을 마음껏 나눠주세요.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-2">
              <div className="flex items-center py-0.5">
                <RoundCheckIcon width={24} height={24} />
              </div>
              <p className="text-text-primary text-[19px] leading-[1.5]">
                신청정보 확인
              </p>
            </div>

            <div className="flex items-start gap-2">
              <div className="flex items-center py-0.5">
                <RoundCheckIcon width={24} height={24} />
              </div>
              <p className="text-text-primary text-[19px] leading-[1.5]">
                지원사유 작성
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 rounded-[12px] border border-[#b1b8be] bg-white p-5 sm:p-10">
          <h2 className="text-text-bolder text-[24px] font-bold leading-[1.5]">
            기본 신청 정보를 확인해주세요
          </h2>

          <div className="flex flex-col gap-6">
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

            <div className="flex flex-col gap-6">
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

            <div className="flex flex-col gap-6">
              <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
                학과
              </h3>
              <TextInput
                id="department"
                length="full"
                value={userInfo.department}
                readOnly
                disabled
              />
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
                  휴대폰번호
                </h3>
                <div className="text-text-subtle">
                  <QuestionBubble width={24} height={24} />
                </div>
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
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <Button
              variant="tertiary"
              size="large"
              onClick={onCancel}
              className="h-14 w-[90px]"
            >
              취소
            </Button>
            <Button
              variant="secondary"
              size="large"
              onClick={() => {
                /* TODO: Handle edit */
              }}
              className="h-14 w-auto min-w-[90px] whitespace-nowrap"
            >
              수정하기
            </Button>
          </div>
          <Button
            variant="primary"
            size="large"
            onClick={onNext}
            className="h-14 w-[90px]"
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
