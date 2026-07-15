"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@ui/components/client";
import { Badge } from "@ui/components/server";
import { UseFormReturn } from "react-hook-form";
import type { StudyOpenValues } from "@core/schemas";
import { formatKoreanDateFromDateInput } from "@/utils/dateInput";
import { StudyCurriculumTable } from "../../components/StudyCurriculumTable";
import { SubmitConfirmModal } from "../components/SubmitConfirmModal";
import { fetchUserInfo } from "../user-info";
import {
  WEEKDAY_OPTIONS,
  DIFFICULTY_OPTIONS,
  LOCATION_OPTIONS,
  REFERENCE_TYPE_OPTIONS,
} from "../constants";
import type { UserInfo } from "../types";

type ReferenceItem = StudyOpenValues["references"][number];

interface Step5ReviewAndSubmitProps {
  form: UseFormReturn<StudyOpenValues>;
  userInfo: UserInfo;
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function Step5ReviewAndSubmit({
  form,
  userInfo,
  onPrevious,
  onSubmit,
  isSubmitting = false,
}: Step5ReviewAndSubmitProps) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [additionalMentors, setAdditionalMentors] = useState<UserInfo[]>([]);
  const values = form.getValues();
  const additionalMentorIds = values.mentorIds
    .map(String)
    .filter((mentorId) => mentorId !== userInfo.studentId);
  const additionalMentorIdsKey = additionalMentorIds.join(",");

  const weekDayLabel =
    WEEKDAY_OPTIONS.find((w) => w.value === values.weekDay)?.label || "";
  const difficultyLabel =
    DIFFICULTY_OPTIONS.find((d) => d.value === values.difficulty)?.label || "";
  const locationLabel =
    LOCATION_OPTIONS.find((l) => l.value === values.location)?.label ||
    values.location;
  const roomLabel = values.room.trim().replace(/\s+/g, "");
  const locationReviewLabel = values.isOnline
    ? "온라인"
    : [locationLabel, roomLabel ? `${roomLabel}호` : ""]
        .filter(Boolean)
        .join(" ");
  const interviewDateLabel =
    formatKoreanDateFromDateInput(values.interviewDate) ?? "날짜 미정";

  const handleSubmitClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsConfirmModalOpen(false);
    onSubmit();
  };

  useEffect(() => {
    const mentorIds = additionalMentorIdsKey
      ? additionalMentorIdsKey.split(",")
      : [];

    if (mentorIds.length === 0) {
      setAdditionalMentors([]);
      return;
    }

    let isCanceled = false;

    const loadMentors = async () => {
      const mentors = await Promise.all(
        mentorIds.map((mentorId) => fetchUserInfo(mentorId).catch(() => null)),
      );

      if (isCanceled) return;
      setAdditionalMentors(
        mentors.filter((mentor): mentor is UserInfo => mentor !== null),
      );
    };

    loadMentors();

    return () => {
      isCanceled = true;
    };
  }, [additionalMentorIdsKey]);

  const mentors = [
    userInfo,
    ...additionalMentorIds.map((mentorId) => {
      const mentorInfo = additionalMentors.find(
        (mentor) => mentor.studentId === mentorId,
      );

      return (
        mentorInfo ?? {
          studentId: mentorId,
          name: "",
          department: "",
          phone: "",
        }
      );
    }),
  ];

  return (
    <div className="flex w-full flex-col gap-12">
      <p className="text-text-basic text-[24px] font-bold leading-[1.5]">
        입력 정보 확인
      </p>

      <div className="flex flex-col gap-10">
        {/* 스터디 개요 */}

        <section className="flex flex-col gap-4">
          <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
            스터디 개요
          </h3>

          <table className="w-full">
            <tbody className="divide-y divide-[#e5e8eb]">
              <InfoRow label="멘토" value={<MentorList mentors={mentors} />} />
              <InfoRow label="스터디명" value={values.studyName} />
              <InfoRow label="한 줄 설명" value={values.oneLiner} />
              <tr>
                <td className="text-text-subtle w-[100px] whitespace-nowrap py-3 pr-3 text-[15px] font-bold leading-[1.5] md:w-[140px] md:text-[17px]">
                  태그
                </td>
                <td className="py-3">
                  <div className="flex flex-wrap gap-1">
                    {values.tags.map((tag) => (
                      <Badge
                        key={tag}
                        label={tag}
                        variant="primary"
                        appearance="solid-pastel"
                        size="medium"
                      />
                    ))}
                  </div>
                </td>
              </tr>
              <InfoRow label="난이도" value={difficultyLabel} />
              <InfoRow
                label="강의시간"
                value={`매주 ${weekDayLabel} ${values.startTime} ~ ${values.endTime}`}
              />
              <InfoRow label="장소" value={locationReviewLabel} />
              <InfoRow
                label="면접 여부"
                value={
                  values.hasInterview ? `있음 (${interviewDateLabel})` : "없음"
                }
              />
            </tbody>
          </table>
        </section>

        {/* 스터디 소개 */}
        <section className="flex flex-col gap-4">
          <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
            스터디 소개
          </h3>
          <div className="rounded-[12px] bg-[#f4f5f6] p-4 md:p-6">
            <p className="text-text-basic whitespace-pre-wrap text-[15px] leading-[1.5] md:text-[17px]">
              {values.introduction}
            </p>
          </div>
        </section>

        {/* 커리큘럼 */}
        <section className="flex flex-col gap-4">
          <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
            커리큘럼
          </h3>
          <StudyCurriculumTable
            rows={values.curriculum.map((week) => ({
              id: week.week,
              week: week.week,
              contents: week.contents,
            }))}
            renderDateInput={(weekIndex, inputClassName) => (
              <span className={inputClassName}>
                {values.curriculum[weekIndex].date}
              </span>
            )}
            renderTopicInput={(weekIndex, inputClassName) => (
              <span
                className={`${inputClassName} whitespace-pre-wrap break-words`}
              >
                {values.curriculum[weekIndex].topic}
              </span>
            )}
            renderContentInput={(weekIndex, contentIndex, inputClassName) => (
              <span
                className={`${inputClassName} whitespace-pre-wrap break-words`}
              >
                {values.curriculum[weekIndex].contents[contentIndex]}
              </span>
            )}
          />
        </section>

        {/* 참고자료 */}
        {values.references.length > 0 && (
          <section className="flex flex-col gap-4">
            <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
              참고자료
            </h3>
            <ReferenceReviewList references={values.references} />
          </section>
        )}
      </div>

      {/* Bottom Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex flex-1 gap-3 sm:gap-4">
          <Button
            variant="secondary"
            size="large"
            onClick={onPrevious}
            className="h-14 min-w-0 flex-1 sm:min-w-[90px] sm:flex-none"
            type="button"
          >
            이전
          </Button>
        </div>
        <Button
          variant="primary"
          size="large"
          onClick={handleSubmitClick}
          disabled={isSubmitting}
          className="h-14 w-full shrink-0 sm:w-auto sm:min-w-[90px]"
          type="button"
        >
          제출
        </Button>
      </div>

      <SubmitConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  );
}

function MentorList({ mentors }: { mentors: UserInfo[] }) {
  const mentorNames = mentors
    .map((mentor) => mentor.name.trim())
    .filter(Boolean)
    .join(", ");

  return <span>{mentorNames}</span>;
}

function ReferenceReviewList({ references }: { references: ReferenceItem[] }) {
  const [fileUrls, setFileUrls] = useState<Record<number, string>>({});

  useEffect(() => {
    const urls = references.reduce<Record<number, string>>(
      (acc, reference, index) => {
        if (isFileValue(reference.value)) {
          acc[index] = URL.createObjectURL(reference.value);
        }

        return acc;
      },
      {},
    );

    setFileUrls(urls);

    return () => {
      Object.values(urls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [references]);

  return (
    <div className="flex flex-col gap-2">
      {references.map((reference, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-[8px] bg-[#f4f5f6] px-4 py-3"
        >
          <span className="text-text-subtle shrink-0 text-[14px] font-bold">
            {getReferenceTypeLabel(reference.type)}
          </span>
          <ReferenceReviewLink
            reference={reference}
            fileUrl={fileUrls[index]}
          />
        </div>
      ))}
    </div>
  );
}

function ReferenceReviewLink({
  reference,
  fileUrl,
}: {
  reference: ReferenceItem;
  fileUrl?: string;
}) {
  if (reference.type === "DOWNLOAD") {
    if (!isFileValue(reference.value)) {
      return (
        <span className="text-text-subtle text-[15px] leading-[1.5]">
          파일 없음
        </span>
      );
    }

    return (
      <a
        href={fileUrl}
        download={reference.value.name}
        className="text-text-primary min-w-0 break-all text-[15px] leading-[1.5] underline underline-offset-2"
      >
        {reference.value.name}
      </a>
    );
  }

  const linkValue = typeof reference.value === "string" ? reference.value : "";
  const href = getSafeExternalUrl(linkValue);

  if (!href) {
    return (
      <span className="text-text-subtle min-w-0 break-all text-[15px] leading-[1.5]">
        {linkValue || "링크 없음"}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-text-primary min-w-0 break-all text-[15px] leading-[1.5] underline underline-offset-2"
    >
      {linkValue}
    </a>
  );
}

function isFileValue(value: ReferenceItem["value"]): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

function getSafeExternalUrl(value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) return "";

  const normalizedValue = /^[a-z][a-z\d+\-.]*:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  try {
    const url = new URL(normalizedValue);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function getReferenceTypeLabel(type: string) {
  return (
    REFERENCE_TYPE_OPTIONS.find((option) => option.value === type)?.label ??
    type
  );
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <tr>
      <td className="text-text-subtle w-[100px] whitespace-nowrap py-3 pr-3 text-[15px] font-bold leading-[1.5] md:w-[140px] md:text-[17px]">
        {label}
      </td>
      <td className="text-text-basic py-3 text-[15px] leading-[1.5] md:text-[17px]">
        {value}
      </td>
    </tr>
  );
}
