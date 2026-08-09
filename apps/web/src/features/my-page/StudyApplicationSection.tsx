"use client";

import Link from "next/link";
import { Badge } from "@ui/components/server";
import { Button } from "@ui/components/client";
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((application) => (
            <article
              key={application.id}
              className="border-border-gray-light flex min-h-64 flex-col rounded-xl border p-6"
            >
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge
                  label={STATUS_LABELS[application.study_status]}
                  variant="primary"
                  appearance="solid-pastel"
                  size="medium"
                />
                {application.tags.map((tag) => (
                  <Badge
                    key={tag}
                    label={tag}
                    variant="info"
                    appearance="solid-pastel"
                    size="medium"
                  />
                ))}
              </div>

              <h3 className="text-text-basic text-[18px] font-bold leading-[1.5]">
                {application.study_name}
              </h3>
              <p className="text-text-subtle mt-2 line-clamp-2 text-[15px] leading-[1.5]">
                {application.one_liner || "한 줄 소개가 없습니다."}
              </p>

              {application.reject_reason && (
                <p className="bg-surface-danger-subtler text-text-danger mt-4 rounded-lg p-3 text-[14px] leading-[1.5]">
                  반려 사유: {application.reject_reason}
                </p>
              )}

              <div className="mt-auto flex justify-end pt-6">
                <Link href={`/my/study-applications/${application.id}`}>
                  <Button variant="tertiary" size="medium">
                    신청서 확인
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
