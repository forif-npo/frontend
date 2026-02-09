"use client";

import { Button, TextInput } from "@ui/components/client";
import { GuideCheckIcon, RoundCheckIcon } from "@ui/components/server";
import { StudyApplyTitle } from "./StudyApplyTitle";

type UserInfo = {
  studentId: string;
  name: string;
  department: string;
  phone: string;
};

interface StudyApplyInfoStepProps {
  studyName: string;
  tags: Array<{
    label: string;
    variant: "primary" | "success" | "warning" | "danger" | "disabled";
  }>;
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
    <div className="mx-auto mb-16 flex max-w-[792px] flex-col">
      <StudyApplyTitle studyName={studyName} tags={tags} />

      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-6 rounded-[12px] border border-[#d6e0eb] bg-[#eef2f7] p-10">
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
              인터넷 신청은 본인과 등록된 거주인만 가능하며 무료로 발급받을 수
              있습니다.
              <br />
              본인 인증되지 않은 경우는 거주지 읍면동에 방문하거나 우편으로
              신청, 발급받을 수 있으며 발급 비용이 발생합니다.
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

        <div className="flex flex-col gap-6 rounded-[12px] border border-[#b1b8be] bg-white p-10">
          <h2 className="text-text-bolder text-[24px] font-bold leading-[1.5]">
            기본 신청 정보를 확인해주세요
          </h2>

          <div className="flex flex-col gap-10">
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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M12 8v5M12 16h.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
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
                /* TODO: Handle edit */
              }}
              className="h-14 min-w-[90px]"
            >
              수정하기
            </Button>
          </div>
          <Button
            variant="primary"
            size="large"
            onClick={onNext}
            className="h-14 min-w-[90px] shrink-0"
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
