"use client";
import { useState } from "react";
import { formatStaffRecruitmentTitle } from "@core/staff-recruitment";
import type { MyStaffApplicationSummary } from "@core/types/staff-recruitment";
import { Tabs } from "@ui/components/client";
import { EmptyState } from "@ui/components/server";
import { MyStaffApplicationView } from "./MyStaffApplicationView";

function ApplicationHistory({
  applications,
  targetRecruitmentId,
}: {
  applications: MyStaffApplicationSummary[];
  targetRecruitmentId?: number;
}) {
  const [selectedId, setSelectedId] = useState(() =>
    applications.find((item) => item.recruitment_id === targetRecruitmentId)
      ?.recruitment_id ?? applications[0].recruitment_id,
  );
  const selected =
    applications.find((item) => item.recruitment_id === selectedId) ??
    applications[0];

  return (
    <div>
      {applications.length > 1 && (
        <div
          className="mb-8 flex flex-wrap gap-3"
          aria-label="운영진 지원 회차 선택"
        >
          {applications.map((application) => (
            <button
              key={application.application_id}
              type="button"
              aria-pressed={
                selected.recruitment_id === application.recruitment_id
              }
              onClick={() => setSelectedId(application.recruitment_id)}
              className={`rounded-3 border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                selected.recruitment_id === application.recruitment_id
                  ? "border-text-primary text-text-primary"
                  : "border-border-gray text-text-subtle hover:text-text-basic"
              }`}
            >
              {formatStaffRecruitmentTitle(
                application.act_year,
                application.act_semester,
              )}
            </button>
          ))}
        </div>
      )}
      <MyStaffApplicationView
        key={selected.application_id}
        recruitmentId={selected.recruitment_id}
        submitted={false}
        embedded
      />
    </div>
  );
}

export function StaffApplicationManageSection({
  applications,
  targetRecruitmentId,
}: {
  applications: MyStaffApplicationSummary[];
  targetRecruitmentId?: number;
}) {
  return (
    <Tabs
      tabs={[
        {
          label: "지원 내역",
          content: applications.length > 0 ? (
            <ApplicationHistory applications={applications} targetRecruitmentId={targetRecruitmentId} />
          ) : (
            <EmptyState title="제출한 운영진 지원서가 없습니다." />
          ),
        },
      ]}
    />
  );
}
