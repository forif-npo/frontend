"use client";

import { useState } from "react";
import { Select } from "@ui/components/client";
import { ApplicationCard } from "./ApplicationCard";
import { ApplicationDetailView } from "./ApplicationDetailView";
import type {
  StudyApplicationsResponse,
  ApplicationDetail,
} from "@core/my-page/api";

interface ApplicationSectionProps {
  applicationsData: StudyApplicationsResponse;
}

type FlatApplication = ApplicationDetail & {
  apply_date: string;
  apply_year: number;
  apply_semester: number;
  user_apply_id: number;
};

export function ApplicationSection({
  applicationsData,
}: ApplicationSectionProps) {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedApplication, setSelectedApplication] =
    useState<FlatApplication | null>(null);

  const allApplications = applicationsData.applications.flatMap((app) => {
    const items: FlatApplication[] = [
      {
        ...app.primary_application,
        apply_date: app.apply_date,
        apply_year: app.apply_year,
        apply_semester: app.apply_semester,
        user_apply_id: app.user_apply_id,
      },
    ];
    if (app.secondary_application) {
      items.push({
        ...app.secondary_application,
        apply_date: app.apply_date,
        apply_year: app.apply_year,
        apply_semester: app.apply_semester,
        user_apply_id: app.user_apply_id,
      });
    }
    return items;
  });

  const sortedApplications = [...allApplications].sort((a, b) => {
    const dateA = new Date(a.apply_date).getTime();
    const dateB = new Date(b.apply_date).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  if (selectedApplication) {
    return (
      <ApplicationDetailView
        application={selectedApplication}
        onBack={() => setSelectedApplication(null)}
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-text-basic text-[19px] font-bold leading-[1.5]">
          지원서{" "}
          <span className="text-[#0b50d0]">{sortedApplications.length}</span>개
        </p>
        <Select
          id="application-sort"
          variant="text"
          size="sm"
          value={sortOrder}
          onChange={(v) => setSortOrder(v as "newest" | "oldest")}
          placeholder="정렬기준"
          dropdownAlign="right"
          options={[
            { value: "newest", label: "최신순" },
            { value: "oldest", label: "오래된순" },
          ]}
        />
      </div>

      {sortedApplications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg">신청한 스터디가 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedApplications.map((app, index) => (
            <ApplicationCard
              key={`${app.user_apply_id}-${app.priority}-${index}`}
              application={app}
              semesterLabel={`${app.apply_year}-${app.apply_semester}`}
              onViewDetail={() => setSelectedApplication(app)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
