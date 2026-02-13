"use client";

import { useState } from "react";
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

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
        stroke="#58616a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 읽기 전용 정보 필드 */
function InfoField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
          {label}
        </h3>
        {icon}
      </div>
      <TextInput id={label} length="full" value={value} readOnly disabled />
    </div>
  );
}

/** 멘토 추가 카드 */
function MentorAddCard({
  onRemove,
  mentorInfo,
  onSearch,
  searchValue,
  onSearchChange,
}: {
  onRemove: () => void;
  mentorInfo: UserInfo | null;
  onSearch: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6 rounded-[12px] border border-[#b1b8be] bg-white p-5 sm:p-10">
      <div className="flex items-center justify-between">
        <h2 className="text-text-bolder text-[24px] font-bold leading-[1.5]">
          멘토 정보를 입력해주세요
        </h2>
        <button
          type="button"
          onClick={onRemove}
          className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-gray-100"
          aria-label="멘토 카드 제거"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#58616a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* 학번 - 검색 가능 */}
      <div className="flex flex-col gap-6">
        <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
          학번
        </h3>
        <div className="relative">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSearch();
              }
            }}
            placeholder="학번을 입력하세요"
            className="rounded-2 border-input-border bg-input-surface text-gray-70 h-14 w-full border px-4 pr-12 transition duration-150 ease-in-out focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={onSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2"
            aria-label="학번 검색"
          >
            <SearchIcon />
          </button>
        </div>
      </div>

      {/* 이름 */}
      <InfoField label="이름" value={mentorInfo?.name || ""} />

      {/* 학과 */}
      <InfoField label="학과" value={mentorInfo?.department || ""} />

      {/* 휴대폰번호 */}
      <InfoField
        label="휴대폰번호"
        value={mentorInfo?.phone || ""}
        icon={<AnnotationIcon className="text-text-subtle h-6 w-6" />}
      />
    </div>
  );
}

interface Step1InfoVerificationProps {
  userInfo: UserInfo;
  onNext: () => void;
  onCancel: () => void;
}

// 멘토 검색 mock
const MOCK_MENTORS: Record<string, UserInfo> = {
  "2024001285": {
    studentId: "2024001285",
    name: "신윤수",
    department: "컴퓨터소프트웨어학부",
    phone: "010-1234-5678",
  },
  "2023063845": {
    studentId: "2023063845",
    name: "표준성",
    department: "정보시스템학과",
    phone: "010-2078-9868",
  },
};

export function Step1InfoVerification({
  userInfo,
  onNext,
  onCancel,
}: Step1InfoVerificationProps) {
  const [showMentorCard, setShowMentorCard] = useState(false);
  const [mentorSearchValue, setMentorSearchValue] = useState("");
  const [mentorInfo, setMentorInfo] = useState<UserInfo | null>(null);

  const handleMentorSearch = () => {
    const found = MOCK_MENTORS[mentorSearchValue];
    if (found) {
      setMentorInfo(found);
    } else {
      alert("해당 학번의 사용자를 찾을 수 없습니다.");
      setMentorInfo(null);
    }
  };

  const handleRemoveMentor = () => {
    setShowMentorCard(false);
    setMentorSearchValue("");
    setMentorInfo(null);
  };

  return (
    <div className="flex w-full flex-col gap-10">
      {/* Form Content - gap 24px between cards */}
      <div className="flex flex-col gap-6">
        {/* 시작하기 전에 */}
        <div className="flex flex-col gap-6 rounded-[12px] border border-[#d6e0eb] bg-[#eef2f7] p-5 sm:p-10">
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
          <StudyCreateStepIndicator />
        </div>

        {/* 기본 신청 정보 */}
        <div className="flex flex-col gap-6 rounded-[12px] border border-[#b1b8be] bg-white p-5 sm:p-10">
          <h2 className="text-text-bolder text-[24px] font-bold leading-[1.5]">
            기본 신청 정보를 확인해주세요
          </h2>

          <InfoField label="학번" value={userInfo.studentId} />
          <InfoField label="이름" value={userInfo.name} />
          <InfoField label="학과" value={userInfo.department} />
          <InfoField
            label="휴대폰번호"
            value={userInfo.phone}
            icon={<AnnotationIcon className="text-text-subtle h-6 w-6" />}
          />
        </div>

        {/* 멘토 추가 카드 */}
        {showMentorCard && (
          <MentorAddCard
            onRemove={handleRemoveMentor}
            mentorInfo={mentorInfo}
            onSearch={handleMentorSearch}
            searchValue={mentorSearchValue}
            onSearchChange={setMentorSearchValue}
          />
        )}
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
          {!showMentorCard && (
            <Button
              variant="secondary"
              size="large"
              onClick={() => setShowMentorCard(true)}
              className="h-14 min-w-[90px]"
            >
              멘토 추가
            </Button>
          )}
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
  );
}
