"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@ui/components/server";
import { Button, Select } from "@ui/components/client";
import type { StudyApplicationSummary } from "@core/study-application/api";

const STATUS_LABELS: Record<StudyApplicationSummary["study_status"], string> = {
  PENDING: "승인 대기",
  RE_APPLIED: "재신청",
  REJECTED: "반려",
};

interface StudyApplicationSectionProps {
  applications: StudyApplicationSummary[];
}

export function StudyApplicationSection({
  applications,
}: StudyApplicationSectionProps) {
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    number | null
  >(applications[0]?.id ?? null);
  const selectedApplication = applications.find(
    (application) => application.id === selectedApplicationId,
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-text-basic text-[19px] font-bold leading-[1.5]">
          개설 신청서{" "}
          <span className="text-text-primary">{applications.length}</span>개
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="text-text-subtle flex flex-col items-center justify-center py-20">
          <p className="text-lg">진행 중인 스터디 개설 신청이 없습니다.</p>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <Select
              id="study-application"
              size="sm"
              value={String(selectedApplicationId)}
              onChange={(value) => setSelectedApplicationId(Number(value))}
              placeholder="스터디 선택"
              options={applications.map((application) => ({
                value: String(application.id),
                label: application.study_name,
              }))}
            />
          </div>

          {selectedApplication && (
            <article className="rounded-3 border-border-gray-light bg-surface-white flex flex-col gap-2 border p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  label={STATUS_LABELS[selectedApplication.study_status]}
                  variant="primary"
                  appearance="solid-pastel"
                  size="small"
                />
                <span className="text-text-bolder text-[17px] font-bold">
                  {selectedApplication.study_name}
                </span>
              </div>
              <p className="text-text-basic text-[15px]">
                {selectedApplication.one_liner || "한 줄 소개가 없습니다."}
              </p>
              {selectedApplication.reject_reason && (
                <div className="bg-surface-danger-subtler text-text-danger rounded-2 mt-1 p-3 text-[14px] leading-[1.6]">
                  <span className="font-bold">반려 사유</span> ·{" "}
                  {selectedApplication.reject_reason}
                </div>
              )}
              <div className="mt-2 flex justify-end">
                <Link href={`/my/study-applications/${selectedApplication.id}`}>
                  <Button variant="tertiary" size="medium">
                    신청서 확인
                  </Button>
                </Link>
              </div>
            </article>
          )}
        </div>
      )}
    </div>
  );
}
