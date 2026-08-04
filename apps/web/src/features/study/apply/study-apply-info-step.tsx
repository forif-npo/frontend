"use client";

import { GuideCheckIcon } from "@ui/components/server";
import { useFormattedPhoneNumber } from "@/hooks/useFormattedPhoneNumber";
import { StepNavigation } from "../create/components/StepNavigation";
import { StudyStepIndicator } from "../components/StudyStepIndicator";
import { StudyUserInfoField } from "../components/StudyUserInfoField";
import { StudyApplyTitle } from "./StudyApplyTitle";
import { BadgeTag } from "./utils";

const STUDY_APPLY_STEPS = [
  {
    number: 1,
    title: "신청 정보 확인",
    description: "학번, 이름, 학과, 휴대폰번호를 확인해주세요.",
  },
  {
    number: 2,
    title: "지원 사유 작성",
    description: "스터디에 지원하는 이유를 작성합니다.",
  },
] as const;

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
  const formattedPhone = useFormattedPhoneNumber(userInfo.phone);

  return (
    <div className="mx-auto mb-16 flex w-full max-w-[792px] flex-col gap-10">
      <StudyApplyTitle studyName={studyName} tags={tags} />

      <div className="flex flex-col gap-6">
        <section className="border-border-secondary-light bg-surface-secondary-subtler flex flex-col gap-6 rounded-[12px] border p-5 sm:p-10">
          <div className="border-border-gray flex flex-col gap-6 border-b border-dashed pb-6">
            <div className="flex items-center gap-1">
              <GuideCheckIcon width={32} height={32} />
              <h2 className="text-text-bolder text-[24px] font-bold leading-[1.5]">
                시작하기 전에
              </h2>
            </div>
            <p className="text-text-basic text-[19px] leading-[1.5]">
              스터디 지원 전, 신청 정보를 확인해주세요.
              <br />
              관심 있는 스터디에 지원하고 함께 성장해보세요.
            </p>
          </div>
          <StudyStepIndicator steps={STUDY_APPLY_STEPS} />
        </section>

        <section className="border-border-gray bg-surface-white flex flex-col gap-6 rounded-[12px] border p-5 sm:p-10">
          <h2 className="text-text-bolder text-[24px] font-bold leading-[1.5]">
            기본 신청 정보를 확인해주세요
          </h2>

          <StudyUserInfoField
            id="student-id"
            label="학번"
            value={userInfo.studentId}
          />
          <StudyUserInfoField id="name" label="이름" value={userInfo.name} />
          <StudyUserInfoField
            id="department"
            label="학과"
            value={userInfo.department}
          />
          <StudyUserInfoField
            id="phone"
            label="휴대폰번호"
            value={formattedPhone}
          />
        </section>
      </div>

      <StepNavigation
        onNext={onNext}
        leadingActions={[
          { label: "취소", onClick: onCancel, variant: "tertiary" },
        ]}
      />
    </div>
  );
}
