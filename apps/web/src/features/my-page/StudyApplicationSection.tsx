"use client";

import { useEffect, useState } from "react";
import {
  Badge,
  EmptyState,
  InlineErrorState,
  InlineLoadingState,
} from "@ui/components/server";
import { Select } from "@ui/components/client";
import {
  getMyStudyApplication,
  type StudyApplicationDetail,
  type StudyApplicationSummary,
} from "@/features/study-application/api";
import { STUDY_CREATION_STATUS_LABELS } from "@core/study-status";
import { handleApiError } from "@core/utils/api-client";
import { StudyApplicationEditor } from "./StudyApplicationEditor";

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
      {applications.length === 0 ? (
        <EmptyState
          title="진행 중인 스터디 개설 신청이 없습니다."
          className="py-20"
          titleClassName="text-lg"
        />
      ) : (
        <div>
          <div className="mb-6">
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
                  label={
                    STUDY_CREATION_STATUS_LABELS[
                      selectedApplication.study_status
                    ]
                  }
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
            <InlineLoadingState
              message="신청서를 불러오는 중입니다."
              className="py-10"
              textClassName="text-[15px]"
            />
          )}
          {detailError && (
            <InlineErrorState
              message={detailError}
              className="py-10"
              textClassName="text-[15px]"
            />
          )}
          {selectedApplicationDetail && (
            <StudyApplicationEditor application={selectedApplicationDetail} />
          )}
        </div>
      )}
    </div>
  );
}
