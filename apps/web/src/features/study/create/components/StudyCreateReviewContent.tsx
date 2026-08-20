"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Badge } from "@ui/components/server";
import type { StudyOpenValues } from "@core/schemas";
import { toFileDownloadUrl } from "@core/utils/file-download";
import { formatKoreanDateFromDateInput } from "@/utils/dateInput";
import { MarkdownContent } from "@/components/MarkdownContent";
import { StudyCurriculumTable } from "../../components/StudyCurriculumTable";
import { fetchUserInfo } from "../user-info";
import {
  WEEKDAY_OPTIONS,
  DIFFICULTY_OPTIONS,
  LOCATION_OPTIONS,
  REFERENCE_TYPE_OPTIONS,
} from "../constants";
import type { UserInfo } from "../types";

type ReferenceItem = StudyOpenValues["references"][number];

interface StudyCreateReviewContentProps {
  values: StudyOpenValues;
  userInfo: UserInfo;
}

const EMPTY_VALUE = "-";
const REVIEW_SECTION_TITLE_CLASS =
  "text-text-basic text-[19px] font-bold leading-[1.5]";
const REVIEW_TABLE_LABEL_CLASS =
  "text-text-subtle w-[100px] whitespace-nowrap py-3 pr-3 text-[15px] font-bold leading-[1.5] md:w-[140px] md:text-[17px]";
const REVIEW_TABLE_VALUE_CLASS =
  "text-text-basic py-3 text-[15px] leading-[1.5] md:text-[17px]";
const REVIEW_LINK_CLASS =
  "text-text-primary min-w-0 break-all text-[15px] leading-[1.5] underline underline-offset-2";

export function StudyCreateReviewContent({
  values,
  userInfo,
}: StudyCreateReviewContentProps) {
  const [additionalMentors, setAdditionalMentors] = useState<UserInfo[]>([]);
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
    formatKoreanDateFromDateInput(values.interviewDate) ?? EMPTY_VALUE;
  const studyTimeLabel =
    weekDayLabel && values.startTime && values.endTime
      ? `매주 ${weekDayLabel} ${values.startTime} ~ ${values.endTime}`
      : "";

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
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h3 className={REVIEW_SECTION_TITLE_CLASS}>스터디 개요</h3>

        <table className="w-full">
          <tbody className="divide-border-gray-light divide-y">
            <InfoRow label="멘토" value={<MentorList mentors={mentors} />} />
            <InfoRow
              label="스터디명"
              value={<ReviewText value={values.studyName} />}
            />
            <InfoRow
              label="한 줄 소개"
              value={<ReviewText value={values.oneLiner} />}
            />
            <tr>
              <td className={REVIEW_TABLE_LABEL_CLASS}>태그</td>
              <td className="py-3">
                {values.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {values.tags.map((tag) => (
                      <Badge
                        key={tag}
                        label={tag}
                        variant="info"
                        appearance="solid-pastel"
                        size="medium"
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyValue />
                )}
              </td>
            </tr>
            <InfoRow
              label="난이도"
              value={<ReviewText value={difficultyLabel} />}
            />
            <InfoRow
              label="강의시간"
              value={<ReviewText value={studyTimeLabel} />}
            />
            <InfoRow
              label="장소"
              value={<ReviewText value={locationReviewLabel} />}
            />
            <InfoRow
              label="면접 여부"
              value={
                values.hasInterview ? `있음 (${interviewDateLabel})` : "없음"
              }
            />
          </tbody>
        </table>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className={REVIEW_SECTION_TITLE_CLASS}>스터디 소개</h3>
        <div className="bg-surface-gray-subtler rounded-[12px] p-4 md:p-6">
          {values.introduction.trim() ? (
            <MarkdownContent content={values.introduction} />
          ) : (
            <EmptyValue />
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className={REVIEW_SECTION_TITLE_CLASS}>커리큘럼</h3>
        <StudyCurriculumTable
          rows={values.curriculum.map((week) => ({
            id: week.week,
            week: week.week,
            contents: week.contents,
          }))}
          renderDateInput={(weekIndex, inputClassName) => (
            <span className={inputClassName}>
              <ReviewText value={values.curriculum[weekIndex].date} />
            </span>
          )}
          renderTopicInput={(weekIndex, inputClassName) => (
            <span
              className={`${inputClassName} whitespace-pre-wrap break-words`}
            >
              <ReviewText value={values.curriculum[weekIndex].topic} />
            </span>
          )}
          renderContentInput={(weekIndex, contentIndex, inputClassName) => (
            <span
              className={`${inputClassName} whitespace-pre-wrap break-words`}
            >
              <ReviewText
                value={values.curriculum[weekIndex].contents[contentIndex]}
              />
            </span>
          )}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h3 className={REVIEW_SECTION_TITLE_CLASS}>참고자료</h3>
        {values.references.length > 0 ? (
          <ReferenceReviewList references={values.references} />
        ) : (
          <EmptyValue />
        )}
      </section>
    </div>
  );
}

function MentorList({ mentors }: { mentors: UserInfo[] }) {
  const mentorNames = mentors
    .map((mentor) => mentor.name.trim())
    .filter(Boolean)
    .join(", ");

  return <ReviewText value={mentorNames} />;
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
          className="bg-surface-gray-subtler flex items-center gap-3 rounded-[8px] px-4 py-3"
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
    if (isFileValue(reference.value)) {
      return (
        <a
          href={fileUrl}
          download={reference.value.name}
          className={REVIEW_LINK_CLASS}
        >
          {reference.value.name}
        </a>
      );
    }

    if (typeof reference.value !== "string" || !reference.value.trim()) {
      return <EmptyValue />;
    }

    const fileName = reference.fileName ?? getFileName(reference.value);

    return (
      <a
        href={toFileDownloadUrl(reference.value)}
        download={fileName}
        className={REVIEW_LINK_CLASS}
      >
        {fileName}
      </a>
    );
  }

  const linkValue = typeof reference.value === "string" ? reference.value : "";
  const href = getSafeExternalUrl(linkValue);

  if (!href) {
    return <ReviewText value={linkValue} />;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={REVIEW_LINK_CLASS}
    >
      {linkValue}
    </a>
  );
}

function ReviewText({ value }: { value: string | null | undefined }) {
  if (!value || value.trim().length === 0) {
    return <EmptyValue />;
  }

  return <>{value}</>;
}

function EmptyValue() {
  return <span className="text-text-subtle">{EMPTY_VALUE}</span>;
}

function isFileValue(value: ReferenceItem["value"]): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

function getFileName(url: string) {
  try {
    const pathname = new URL(url).pathname;
    return decodeURIComponent(pathname.split("/").at(-1) || "첨부파일");
  } catch {
    return "첨부파일";
  }
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
      <td className={REVIEW_TABLE_LABEL_CLASS}>{label}</td>
      <td className={REVIEW_TABLE_VALUE_CLASS}>{value}</td>
    </tr>
  );
}
