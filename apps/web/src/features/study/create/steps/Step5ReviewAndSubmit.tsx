"use client";

import { useState } from "react";
import { Button } from "@ui/components/client";
import { Badge } from "@ui/components/server";
import { UseFormReturn } from "react-hook-form";
import type { StudyOpenValues } from "@core/schemas";
import { SubmitConfirmModal } from "../components/SubmitConfirmModal";
import {
  WEEKDAY_OPTIONS,
  DIFFICULTY_OPTIONS,
  LOCATION_OPTIONS,
} from "../constants";

interface Step5ReviewAndSubmitProps {
  form: UseFormReturn<StudyOpenValues>;
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function Step5ReviewAndSubmit({
  form,
  onPrevious,
  onSubmit,
  isSubmitting = false,
}: Step5ReviewAndSubmitProps) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const values = form.getValues();

  const weekDayLabel =
    WEEKDAY_OPTIONS.find((w) => w.value === values.weekDay)?.label || "";
  const difficultyLabel =
    DIFFICULTY_OPTIONS.find((d) => d.value === values.difficulty)?.label || "";
  const locationLabel =
    LOCATION_OPTIONS.find((l) => l.value === values.location)?.label ||
    values.location;

  const handleSubmitClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsConfirmModalOpen(false);
    onSubmit();
  };

  return (
    <div className="mx-auto mb-16 flex w-full max-w-[792px] flex-col gap-6 sm:gap-10">
      {/* 스터디 개요 */}
      <div className="flex flex-col gap-6 rounded-[12px] border border-[#b1b8be] bg-white p-5 sm:p-10">
        <h2 className="text-text-bolder text-[24px] font-bold leading-[1.5]">
          입력 정보 확인
        </h2>

        <section className="flex flex-col gap-4">
          <h3 className="text-text-bolder text-[20px] font-bold leading-[1.5]">
            스터디 개요
          </h3>

          <table className="w-full">
            <tbody className="divide-y divide-[#e5e8eb]">
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
              <InfoRow
                label="장소"
                value={
                  values.isOnline
                    ? "온라인"
                    : `${locationLabel} ${values.room || ""}`
                }
              />
              <InfoRow label="모집 인원" value={`${values.maxMembers}명`} />
              <InfoRow
                label="면접 여부"
                value={
                  values.hasInterview
                    ? `있음 (${values.interviewDate || "날짜 미정"})`
                    : "없음"
                }
              />
            </tbody>
          </table>
        </section>

        {/* 목표 */}
        <section className="flex flex-col gap-4">
          <h3 className="text-text-bolder text-[20px] font-bold leading-[1.5]">
            목표
          </h3>
          <div className="rounded-[12px] bg-[#f4f5f6] p-4 md:p-6">
            <p className="text-text-basic whitespace-pre-wrap text-[15px] leading-[1.5] md:text-[17px]">
              {values.goal}
            </p>
          </div>
        </section>

        {/* 스터디 소개 */}
        <section className="flex flex-col gap-4">
          <h3 className="text-text-bolder text-[20px] font-bold leading-[1.5]">
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
          <h3 className="text-text-bolder text-[20px] font-bold leading-[1.5]">
            커리큘럼
          </h3>
          <div className="-mx-2 overflow-x-auto px-2 sm:mx-0 sm:px-0">
            <div className="min-w-[550px]">
              <div className="flex">
                <div className="text-text-bolder w-[80px] shrink-0 border-b border-[#d6e0eb] bg-[#eef2f7] px-3 py-2 text-[14px] font-bold leading-[1.5] md:w-[120px] md:text-[15px]">
                  주차
                </div>
                <div className="text-text-bolder w-[200px] shrink-0 border-b border-[#d6e0eb] bg-[#eef2f7] px-3 py-2 text-[14px] font-bold leading-[1.5] md:w-[320px] md:text-[15px]">
                  주제
                </div>
                <div className="text-text-bolder flex-1 border-b border-[#d6e0eb] bg-[#eef2f7] px-3 py-2 text-[14px] font-bold leading-[1.5] md:text-[15px]">
                  내용
                </div>
              </div>
              {values.curriculum.map((item) =>
                item.contents.map((content, idx) => (
                  <div key={`${item.week}-${idx}`} className="flex">
                    <div className="text-text-subtle w-[80px] shrink-0 border-b border-[#cdd1d5] px-3 py-2 text-[15px] leading-[1.5] md:w-[120px] md:py-3 md:text-[17px]">
                      {idx === 0 ? `${item.week}주차` : ""}
                    </div>
                    <div className="text-text-subtle w-[200px] shrink-0 border-b border-[#cdd1d5] px-3 py-2 text-[15px] leading-[1.5] md:w-[320px] md:py-3 md:text-[17px]">
                      {idx === 0 ? item.topic : ""}
                    </div>
                    <div className="text-text-subtle flex-1 border-b border-[#cdd1d5] px-3 py-2 text-[15px] leading-[1.5] md:py-3 md:text-[17px]">
                      {content}
                    </div>
                  </div>
                )),
              )}
            </div>
          </div>
        </section>

        {/* 선정 기준 */}
        <section className="flex flex-col gap-4">
          <h3 className="text-text-bolder text-[20px] font-bold leading-[1.5]">
            선정 기준
          </h3>
          <div className="rounded-[12px] bg-[#f4f5f6] p-4 md:p-6">
            <p className="text-text-basic text-[15px] leading-[1.5] md:text-[17px]">
              {values.selectionCriteria}
            </p>
          </div>
        </section>

        {/* 참고자료 */}
        {values.references.length > 0 && (
          <section className="flex flex-col gap-4">
            <h3 className="text-text-bolder text-[20px] font-bold leading-[1.5]">
              참고자료
            </h3>
            <div className="flex flex-col gap-2">
              {values.references.map((ref, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-[8px] bg-[#f4f5f6] px-4 py-3"
                >
                  <span className="text-text-subtle text-[14px] font-bold">
                    [{ref.type}]
                  </span>
                  <span className="text-text-basic text-[15px] leading-[1.5]">
                    {ref.value}
                  </span>
                </div>
              ))}
            </div>
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

function InfoRow({ label, value }: { label: string; value: string }) {
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
