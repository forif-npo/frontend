"use client";

import { useState } from "react";
import { Body } from "@ui/components/server";
import { ApplicationCard } from "./ApplicationCard";
import type { StudyApplicationsResponse } from "@core/my-page/api";

interface ApplicationSectionProps {
  applicationsData: StudyApplicationsResponse;
}

export function ApplicationSection({
  applicationsData,
}: ApplicationSectionProps) {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const allApplications = applicationsData.applications.flatMap((app) => {
    const items = [
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

  const totalCount = sortedApplications.length;

  return (
    <div>
      {/* Sort and Count */}
      <div className="mb-6 flex items-center justify-between">
        <Body size="l" className="font-bold">
          지원서 <span className="text-[#0b50d0]">{totalCount}</span>개
        </Body>

        <div className="flex items-center gap-3">
          <Body size="m" className="font-bold">
            정렬기준
          </Body>
          <div className="flex gap-1">
            <button
              onClick={() => setSortOrder("newest")}
              className={`rounded px-2 py-1 text-sm transition-colors ${
                sortOrder === "newest"
                  ? "text-text-basic font-bold underline"
                  : "text-text-subtle hover:text-text-basic"
              }`}
            >
              최신순
            </button>
            <button
              onClick={() => setSortOrder("oldest")}
              className={`rounded px-2 py-1 text-sm transition-colors ${
                sortOrder === "oldest"
                  ? "text-text-basic font-bold underline"
                  : "text-text-subtle hover:text-text-basic"
              }`}
            >
              오래된 순
            </button>
          </div>
        </div>
      </div>

      {/* Applications Grid */}
      {sortedApplications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg">신청한 스터디가 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedApplications.map((app, index) => {
            const semesterLabel = `${app.apply_year}-${app.apply_semester}`;
            return (
              <ApplicationCard
                key={`${app.user_apply_id}-${app.priority}-${index}`}
                application={app}
                semesterLabel={semesterLabel}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
