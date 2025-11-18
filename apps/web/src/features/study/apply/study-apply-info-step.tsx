"use client";

import { Button, TextInput } from "@ui/components/client";
import { Badge, Body, Heading } from "@ui/components/server";

// Simple check circle icon component
const CheckCircleIcon = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path
      d="M8 12l2 2 4-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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
    <div className="mx-auto mb-16 mt-8 flex max-w-[1200px] flex-col gap-12">
      {/* Title Section */}
      <div className="flex flex-col gap-6">
        <Heading size="xl" className="text-text-basic">
          <span className="text-primary-primary-50">{studyName}</span>
          <br />
          스터디 신청
        </Heading>

        <div className="flex items-center gap-1">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              label={tag.label}
              variant={tag.variant}
              appearance="solid-pastel"
              size="large"
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-10">
        {/* Getting Started Guide */}
        <div className="bg-bg-secondary border-border-secondary-light rounded-3 flex flex-col gap-6 border p-10">
          <div className="border-divider-gray flex flex-col gap-6 border-b border-dashed pb-6">
            <div className="flex items-center gap-1">
              <CheckCircleIcon
                width={43}
                height={43}
                className="text-primary-primary-50"
              />
              <Heading size="s" className="text-text-bolder">
                시작하기 전에
              </Heading>
            </div>

            <Body size="l" className="text-text-basic">
              인터넷 신청은 본인과 등록된 거주인만 가능하며 무료로 발급받을 수
              있습니다.
              <br />
              본인 인증되지 않은 경우는 거주지 읍면동에 방문하거나 우편으로
              신청, 발급받을 수 있으며 발급 비용이 발생합니다.
            </Body>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-2">
              <div className="flex items-center py-0.5">
                <CheckCircleIcon
                  width={24}
                  height={24}
                  className="text-primary-primary-50"
                />
              </div>
              <Body size="l" className="text-text-primary">
                신청정보 확인
              </Body>
            </div>

            <div className="flex items-start gap-2">
              <div className="flex items-center py-0.5">
                <CheckCircleIcon
                  width={24}
                  height={24}
                  className="text-primary-primary-50"
                />
              </div>
              <Body size="l" className="text-text-primary">
                지원사유 작성
              </Body>
            </div>
          </div>
        </div>

        {/* Basic Info Form */}
        <div className="bg-surface-white-subtle border-border-gray rounded-3 flex flex-col gap-6 border p-10">
          <Heading size="s" className="text-text-bolder">
            기본 신청 정보를 확인해주세요
          </Heading>

          <div className="flex flex-col gap-10">
            {/* 학번 */}
            <div className="flex flex-col gap-6">
              <Heading size="xxs" className="text-text-basic">
                학번
              </Heading>
              <TextInput
                id="studentId"
                length="full"
                value={userInfo.studentId}
                readOnly
                disabled
              />
            </div>

            {/* 이름 */}
            <div className="flex flex-col gap-6">
              <Heading size="xxs" className="text-text-basic">
                이름
              </Heading>
              <TextInput
                id="name"
                length="full"
                value={userInfo.name}
                readOnly
                disabled
              />
            </div>

            {/* 학과 */}
            <div className="flex flex-col gap-6">
              <Heading size="xxs" className="text-text-basic">
                학과
              </Heading>
              <TextInput
                id="department"
                length="full"
                value={userInfo.department}
                readOnly
                disabled
              />
            </div>

            {/* 휴대폰번호 */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <Heading size="xxs" className="text-text-basic">
                  휴대폰번호
                </Heading>
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
        <div className="flex gap-4">
          <div className="flex flex-1 gap-4">
            <Button
              variant="tertiary"
              size="large"
              onClick={onCancel}
              className="min-w-[90px]"
            >
              취소하기
            </Button>
            <Button
              variant="secondary"
              size="large"
              onClick={() => {
                /* TODO: Handle edit */
              }}
              className="min-w-[90px]"
            >
              수정하기
            </Button>
          </div>
          <Button
            variant="primary"
            size="large"
            onClick={onNext}
            className="min-w-[90px]"
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
