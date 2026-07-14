"use client";

import { useEffect, useState } from "react";
import { CriticalAlert, TextInput } from "@ui/components/client";
import { GuideCheckIcon, SearchIcon } from "@ui/components/server";
import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import type { StudyOpenValues } from "@core/schemas";
import type { UseFormReturn } from "react-hook-form";
import { useFormattedPhoneNumber } from "@/hooks/useFormattedPhoneNumber";
import { StudyCreateStepIndicator } from "./StudyCreateStepIndicator";
import { StepNavigation } from "../components/StepNavigation";
import type { UserInfo } from "../types";

type UserResponseData = {
  user_id: number;
  user_name: string;
  department: string;
  phone_num: string;
};

async function fetchUserInfo(studentId: string) {
  const response = await apiClient
    .get(`api/v1/users/${studentId}`)
    .json<ApiResponse<UserResponseData>>();

  if (!response.data) return null;

  return {
    studentId: String(response.data.user_id),
    name: response.data.user_name,
    department: response.data.department,
    phone: response.data.phone_num,
  };
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
  const formattedMentorPhone = useFormattedPhoneNumber(mentorInfo?.phone);

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
      <InfoField label="휴대폰번호" value={formattedMentorPhone} />
    </div>
  );
}

interface Step1InfoVerificationProps {
  form: UseFormReturn<StudyOpenValues>;
  userInfo: UserInfo;
  onNext: () => void;
  onCancel: () => void;
}

export function Step1InfoVerification({
  form,
  userInfo,
  onNext,
  onCancel,
}: Step1InfoVerificationProps) {
  const [isMentorCardOpen, setIsMentorCardOpen] = useState(false);
  const [mentorSearchValue, setMentorSearchValue] = useState("");
  const [mentorInfo, setMentorInfo] = useState<UserInfo | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const formattedUserPhone = useFormattedPhoneNumber(userInfo.phone);
  const selectedMentorId = form.watch("mentorIds")?.[0] ?? null;
  const showMentorCard = isMentorCardOpen || selectedMentorId !== null;

  useEffect(() => {
    if (selectedMentorId === null) {
      if (!isMentorCardOpen) {
        setMentorSearchValue("");
        setMentorInfo(null);
      }
      return;
    }

    const mentorIdText = String(selectedMentorId);

    if (mentorInfo?.studentId === mentorIdText) {
      setMentorSearchValue(mentorIdText);
      return;
    }

    let isCanceled = false;

    const restoreMentorInfo = async () => {
      try {
        const restoredMentorInfo = await fetchUserInfo(mentorIdText);
        if (isCanceled) return;

        if (!restoredMentorInfo) {
          setMentorSearchValue(mentorIdText);
          setMentorInfo(null);
          return;
        }

        if (restoredMentorInfo.studentId === userInfo.studentId) {
          setAlertMessage("본인은 추가 멘토로 등록할 수 없습니다.");
          setMentorInfo(null);
          form.setValue("mentorIds", [], { shouldDirty: true });
          return;
        }

        setMentorSearchValue(restoredMentorInfo.studentId);
        setMentorInfo(restoredMentorInfo);
        setAlertMessage(null);
      } catch {
        if (isCanceled) return;
        setMentorSearchValue(mentorIdText);
        setMentorInfo(null);
        setAlertMessage("멘토 정보를 불러오지 못했습니다.");
      }
    };

    restoreMentorInfo();

    return () => {
      isCanceled = true;
    };
  }, [
    form,
    isMentorCardOpen,
    mentorInfo?.studentId,
    selectedMentorId,
    userInfo.studentId,
  ]);

  const handleMentorSearch = async () => {
    if (!mentorSearchValue.trim()) return;
    try {
      const searchedMentorInfo = await fetchUserInfo(mentorSearchValue.trim());

      if (!searchedMentorInfo) {
        throw new Error("Mentor not found");
      }

      if (searchedMentorInfo.studentId === userInfo.studentId) {
        setAlertMessage("본인은 추가 멘토로 등록할 수 없습니다.");
        setMentorInfo(null);
        form.setValue("mentorIds", [], { shouldDirty: true });
        return;
      }

      setMentorInfo(searchedMentorInfo);
      setMentorSearchValue(searchedMentorInfo.studentId);
      setAlertMessage(null);
      form.setValue("mentorIds", [Number(searchedMentorInfo.studentId)], {
        shouldDirty: true,
      });
    } catch {
      setAlertMessage("해당 학번의 사용자를 찾을 수 없습니다.");
      setMentorInfo(null);
      form.setValue("mentorIds", [], { shouldDirty: true });
    }
  };

  const handleRemoveMentor = () => {
    setIsMentorCardOpen(false);
    setMentorSearchValue("");
    setMentorInfo(null);
    form.setValue("mentorIds", [], { shouldDirty: true });
  };

  const handleMentorSearchChange = (value: string) => {
    setMentorSearchValue(value);
    setAlertMessage(null);
    setMentorInfo(null);
    form.setValue("mentorIds", [], { shouldDirty: true });
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
              스터디 개설은 지식의 선순환을 실천하고 싶은 FORIF의 부원이라면
              누구나 가능합니다.
              <br />
              여러분의 다양한 프로그래밍 지식을 마음껏 나눠주세요.
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
          <InfoField label="휴대폰번호" value={formattedUserPhone} />
        </div>

        {/* 알림 메시지 */}
        {alertMessage && <CriticalAlert text={alertMessage} variant="danger" />}

        {/* 멘토 추가 카드 */}
        {showMentorCard && (
          <MentorAddCard
            onRemove={handleRemoveMentor}
            mentorInfo={mentorInfo}
            onSearch={handleMentorSearch}
            searchValue={mentorSearchValue}
            onSearchChange={handleMentorSearchChange}
          />
        )}
      </div>

      <StepNavigation
        onNext={onNext}
        leadingActions={[
          { label: "취소", onClick: onCancel, variant: "tertiary" },
          ...(!showMentorCard
            ? [
                {
                  label: "멘토 추가",
                  onClick: () => setIsMentorCardOpen(true),
                  variant: "secondary" as const,
                },
              ]
            : []),
        ]}
      />
    </div>
  );
}
