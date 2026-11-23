"use client";
import { useState } from "react";
import { formatStaffRecruitmentTitle } from "@core/staff-recruitment";
import type { MyStaffApplicationSummary } from "@core/types/staff-recruitment";
import { Select, Tabs } from "@ui/components/client";
import { EmptyState } from "@ui/components/server";
import { MyStaffApplicationView } from "./MyStaffApplicationView";

function ApplicationHistory({
  applications,
  targetRecruitmentId,
}: {
  applications: MyStaffApplicationSummary[];
  targetRecruitmentId?: number;
}) {
  const [selectedId, setSelectedId] = useState(
    () =>
      applications.find((item) => item.recruitment_id === targetRecruitmentId)
        ?.recruitment_id ?? applications[0].recruitment_id,
  );
  const selected =
    applications.find((item) => item.recruitment_id === selectedId) ??
    applications[0];

  return (
    <div>
      {applications.length > 1 && (
        <div className="mb-6">
          <label htmlFor="staff-application" className="sr-only">
            운영진 모집 회차 선택
          </label>
          <Select
            id="staff-application"
            size="sm"
            value={String(selected.recruitment_id)}
            onChange={(value) => setSelectedId(Number(value))}
            placeholder="모집 회차 선택"
            options={applications.map((application) => ({
              value: String(application.recruitment_id),
              label: formatStaffRecruitmentTitle(
                application.act_year,
                application.act_semester,
              ),
            }))}
          />
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
          content:
            applications.length > 0 ? (
              <ApplicationHistory
                applications={applications}
                targetRecruitmentId={targetRecruitmentId}
              />
            ) : (
              <EmptyState title="제출한 운영진 지원서가 없습니다." />
            ),
        },
      ]}
    />
  );
}
