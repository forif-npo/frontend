"use client";

import { Button } from "@ui/components/client";
import { CharacterCount } from "@ui/components/server";
import type { ApplicationDetail } from "@core/my-page/api";
import {
  NUMERIC_DIFFICULTY_LABELS,
  APPLICATION_STATUS_LABELS,
} from "@/constants/study";

interface ApplicationDetailViewProps {
  application: ApplicationDetail & {
    apply_date: string;
    apply_year: number;
    apply_semester: number;
    user_apply_id: number;
  };
  onBack: () => void;
}

function InfoBadge({ label }: { label: string }) {
  return (
    <div className="flex h-8 items-center justify-center rounded px-2">
      <p
        className="whitespace-nowrap text-[17px] leading-[1.5]"
        style={{ color: "#096ab3", backgroundColor: "#e7f4fe" }}
      >
        {label}
      </p>
    </div>
  );
}

// Re-implement inline to match exact figma colors
function Badge({
  label,
  color,
  bg,
}: {
  label: string;
  color: string;
  bg: string;
}) {
  return (
    <div
      className="flex h-8 items-center justify-center rounded px-2"
      style={{ backgroundColor: bg }}
    >
      <p
        className="whitespace-nowrap text-[17px] leading-[1.5]"
        style={{ color }}
      >
        {label}
      </p>
    </div>
  );
}

export function ApplicationDetailView({
  application,
  onBack,
}: ApplicationDetailViewProps) {
  const { study, priority, intro, status } = application;
  const priorityLabel = priority === "PRIMARY" ? "1순위" : "2순위";
  const difficultyLabel = NUMERIC_DIFFICULTY_LABELS[study.difficulty] ?? "보통";
  const statusLabel = APPLICATION_STATUS_LABELS[status] ?? "지원중";
  const charCount = intro.length;

  return (
    <div className="flex flex-col gap-4">
      {/* Study title */}
      <p
        className="text-[40px] font-bold leading-[1.5] tracking-[1px]"
        style={{ color: "#052b57" }}
      >
        {study.study_name}
      </p>

      {/* Badges: status | tags | difficulty | priority */}
      <div className="flex flex-wrap items-center gap-1">
        {/* status */}
        <Badge label={statusLabel} bg="#e7f4fe" color="#096ab3" />
        {/* tags */}
        {study.tags.map((tag) => (
          <Badge key={tag} label={tag} bg="#e7f4fe" color="#096ab3" />
        ))}
        {/* difficulty */}
        <Badge label={difficultyLabel} bg="#ecf2fe" color="#0b50d0" />
        {/* priority */}
        <Badge label={priorityLabel} bg="#ecf2fe" color="#0b50d0" />
      </div>

      {/* Form area: pt-[50px] */}
      <div className="flex flex-col gap-10 pt-[50px]">
        {/* Card */}
        <div className="flex flex-col gap-6 rounded-xl border border-[#b1b8be] bg-white p-10">
          {/* Card title */}
          <p className="text-[24px] font-bold leading-[1.5] text-[#131416]">
            스터디 지원서
          </p>

          {/* 지원 순위 */}
          <div className="flex flex-col gap-6">
            <p className="text-[19px] font-bold leading-[1.5] text-[#1e2124]">
              지원 순위
            </p>
            <div className="flex h-14 items-center rounded-lg border border-[#b1b8be] bg-[#cdd1d5] px-4">
              <p className="flex-1 text-[19px] leading-[1.5] text-[#464c53]">
                {priorityLabel}
              </p>
            </div>
          </div>

          {/* 지원 사유 */}
          <div className="flex flex-col gap-6">
            <p className="text-[19px] font-bold leading-[1.5] text-[#1e2124]">
              지원 사유 <span className="font-normal text-[#bd2c0f]">*</span>
            </p>
            <div className="flex flex-col gap-2">
              <p className="text-[13px] leading-[1.5] text-[#464c53]">
                해당 스터디를 수강하고 싶은 사유를 작성해주세요. 최소 50자 이상,
                최대 500자 이내로 작성해주세요.
              </p>
              <div className="h-[300px] overflow-y-auto rounded-md border border-[#58616a] bg-white px-4 py-2">
                <p className="text-[17px] leading-[1.5] text-[#1e2124]">
                  {intro}
                </p>
              </div>
              <CharacterCount count={charCount} max={500} />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <Button variant="tertiary" onClick={onBack} size="large">
            취소
          </Button>
          <Button variant="primary" size="large">
            수정
          </Button>
        </div>
      </div>
    </div>
  );
}
