"use client";

import { useEffect, useState } from "react";
import { Badge } from "@ui/components/server";
import { Select } from "@ui/components/client";
import {
  getMyStudyApplication,
  type StudyApplicationDetail,
  type StudyApplicationSummary,
} from "@core/study-application/api";
import { handleApiError } from "@core/utils/api-client";
import { StudyApplicationEditor } from "./StudyApplicationEditor";

const STATUS_LABELS: Record<StudyApplicationSummary["study_status"], string> = {
  PENDING: "승인 대기",
  RE_APPLIED: "재신청",
  REJECTED: "반려",
  APPROVED: "승인",
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
  const [selectedApplicationDetail, setSelectedApplicationDetail] =
    useState<StudyApplicationDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const selectedApplication = applications.find(
    (application) => application.id === selectedApplicationId,
  );

  useEffect(() => {
    if (selectedApplicationId === null) return;

    let isCancelled = false;
    setIsDetailLoading(true);
    setDetailError(null);
    setSelectedApplicationDetail(null);

    getMyStudyApplication(selectedApplicationId)
      .then((application) => {
        if (!isCancelled) setSelectedApplicationDetail(application);
      })
      .catch(async (error) => {
        if (!isCancelled) setDetailError(await handleApiError(error));
      })
      .finally(() => {
        if (!isCancelled) setIsDetailLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedApplicationId]);

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
                  variant={
                    selectedApplication.study_status === "REJECTED"
                      ? "danger"
                      : selectedApplication.study_status === "RE_APPLIED"
                        ? "warning"
                        : "primary"
                  }
                  appearance="solid-pastel"
                  size="small"
                />
                <span className="text-text-bolder text-[17px] font-bold">
                  {selectedApplication.study_name}
                </span>
              </div>
              {selectedApplication.reject_reason && (
                <div className="bg-surface-danger-subtler text-text-basic rounded-2 mt-1 p-3 text-[14px] leading-[1.6]">
                  <span className="font-bold">반려 사유</span>:{" "}
                  {selectedApplication.reject_reason}
                </div>
              )}
            </article>
          )}

          {isDetailLoading && (
            <p className="text-text-subtle py-10 text-center text-[15px]">
              신청서를 불러오는 중입니다.
            </p>
          )}
          {detailError && (
            <p className="text-text-danger py-10 text-center text-[15px]">
              {detailError}
            </p>
          )}
          {selectedApplicationDetail &&
            (selectedApplicationDetail.can_modify ? (
              <StudyApplicationEditor application={selectedApplicationDetail} />
            ) : (
              <p className="text-text-subtle border-border-gray-light mt-8 rounded-xl border p-6 text-[15px]">
                {selectedApplicationDetail.study_status === "APPROVED"
                  ? "멘티 모집이 시작되어 신청 내용을 수정할 수 없습니다. 승인된 스터디는 취소할 수 없습니다."
                  : selectedApplicationDetail.study_status === "REJECTED"
                    ? "심사 기간이 종료되어 반려된 신청서를 수정하거나 재신청할 수 없습니다."
                    : "멘티 모집이 시작되어 신청서를 수정할 수 없습니다."}
              </p>
            ))}
        </div>
      )}
    </div>
  );
}
