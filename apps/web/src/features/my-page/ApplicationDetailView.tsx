"use client";

import { Button } from "@ui/components/client";
import { Badge, CharacterCount } from "@ui/components/server";
import type { ApplicationDetail } from "@core/my-page/api";
import {
  NUMERIC_DIFFICULTY_LABELS,
  APPLICATION_STATUS_LABELS,
} from "@/constants/study";
import { getStudyTagLabel } from "@/constants/study-tags";

interface ApplicationDetailViewProps {
  application: ApplicationDetail & {
    apply_date: string;
    apply_year: number;
    apply_semester: number;
    user_apply_id: number;
  };
  onBack: () => void;
}

export function ApplicationDetailView({
  application,
  onBack,
}: ApplicationDetailViewProps) {
  const { study, priority, intro, status } = application;
  const priorityLabel = priority === "PRIMARY" ? "1순위" : "2순위";
  const difficultyLabel = NUMERIC_DIFFICULTY_LABELS[study.difficulty] ?? "보통";
  const statusLabel = APPLICATION_STATUS_LABELS[status] ?? "지원중";
  const applicationIntro = intro ?? "";
  const charCount = applicationIntro.length;

  return (
    <div className="flex flex-col gap-4">
      {/* Study title */}
      <p className="text-text-bolder text-[40px] font-bold leading-[1.5] tracking-[1px]">
        {study.study_name}
      </p>

      {/* Badges: status | tags | difficulty | priority */}
      <div className="flex flex-wrap items-center gap-1">
        {/* status */}
        <Badge
          label={statusLabel}
          variant="info"
          appearance="solid-pastel"
          size="large"
        />
        {/* tags */}
        {study.tags.map((tag) => (
          <Badge
            key={tag}
            label={getStudyTagLabel(tag)}
            variant="info"
            appearance="solid-pastel"
            size="large"
          />
        ))}
        {/* difficulty */}
        <Badge
          label={difficultyLabel}
          variant="primary"
          appearance="solid-pastel"
          size="large"
        />
        {/* priority */}
        <Badge
          label={priorityLabel}
          variant="primary"
          appearance="solid-pastel"
          size="large"
        />
      </div>

      {/* Form area: pt-[50px] */}
      <div className="flex flex-col gap-10 pt-[50px]">
        {/* Card */}
        <div className="border-border-gray bg-surface-white flex flex-col gap-6 rounded-xl border p-10">
          {/* Card title */}
          <p className="text-text-bolder text-[24px] font-bold leading-[1.5]">
            스터디 지원서
          </p>

          {/* 지원 순위 */}
          <div className="flex flex-col gap-6">
            <p className="text-text-basic text-[19px] font-bold leading-[1.5]">
              지원 순위
            </p>
            <div className="border-border-gray bg-surface-disabled flex h-14 items-center rounded-lg border px-4">
              <p className="text-text-subtle flex-1 text-[19px] leading-[1.5]">
                {priorityLabel}
              </p>
            </div>
          </div>

          {/* 지원 사유 */}
          <div className="flex flex-col gap-6">
            <p className="text-text-basic text-[19px] font-bold leading-[1.5]">
              지원 사유 <span className="text-text-danger font-normal">*</span>
            </p>
            <div className="flex flex-col gap-2">
              <p className="text-text-subtle text-[13px] leading-[1.5]">
                해당 스터디를 수강하고 싶은 사유를 작성해주세요. 최소 50자 이상,
                최대 500자 이내로 작성해주세요.
              </p>
              <div className="border-border-gray-dark bg-surface-white h-[300px] overflow-y-auto rounded-md border px-4 py-2">
                <p className="text-text-basic text-[17px] leading-[1.5]">
                  {applicationIntro}
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
