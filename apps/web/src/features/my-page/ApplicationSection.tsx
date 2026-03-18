"use client";

import { useState } from "react";
import { Heading, Body, Label } from "@ui/components/server";
import { ApplicationCard } from "./ApplicationCard";
import type { StudyApplicationsResponse } from "@core/my-page/api";

interface ApplicationSectionProps {
  applicationsData: StudyApplicationsResponse;
}

export function ApplicationSection({
  applicationsData,
}: ApplicationSectionProps) {
  const [activeTab, setActiveTab] = useState<"study" | "creation">("study");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Extract all applications (primary and secondary)
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

  // Sort applications
  const sortedApplications = [...allApplications].sort((a, b) => {
    const dateA = new Date(a.apply_date).getTime();
    const dateB = new Date(b.apply_date).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const totalCount = sortedApplications.length;

  return (
    <div className="flex-1 px-16 py-8">
      {/* Page Header */}
      <Heading size="l" className="mb-6">
        신청서 목록
      </Heading>

      {/* Tabs */}
      <div className="mb-6 flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("study")}
          className={`border-b-3 px-2 pb-3 transition-colors ${
            activeTab === "study"
              ? "border-blue-700 font-bold text-blue-900"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          <Label size="l">스터디 신청서</Label>
        </button>
        <button
          onClick={() => setActiveTab("creation")}
          className={`border-b-3 px-2 pb-3 transition-colors ${
            activeTab === "creation"
              ? "border-blue-700 font-bold text-blue-900"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          <Label size="l">스터디 개설 신청서</Label>
        </button>
      </div>

      {/* Filter and Sort */}
      <div className="mb-6 flex items-center justify-between">
        <Body size="l" className="font-bold">
          신청서 <span className="text-blue-600">{totalCount}</span>개
        </Body>

        <div className="flex items-center gap-3">
          <Label size="m" className="font-bold">
            정렬기준
          </Label>
          <div className="flex gap-2">
            <button
              onClick={() => setSortOrder("newest")}
              className={`rounded px-2 py-1 transition-colors ${
                sortOrder === "newest"
                  ? "bg-blue-100 text-gray-900"
                  : "bg-transparent text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Body size="m">최신순</Body>
            </button>
            <button
              onClick={() => setSortOrder("oldest")}
              className={`rounded px-2 py-1 transition-colors ${
                sortOrder === "oldest"
                  ? "bg-blue-100 text-gray-900"
                  : "bg-transparent text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Body size="m">오래된 순</Body>
            </button>
          </div>
        </div>
      </div>

      {/* Applications Grid */}
      {activeTab === "study" ? (
        sortedApplications.length === 0 ? (
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
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg">스터디 개설 신청서 (Coming soon)</p>
        </div>
      )}
    </div>
  );
}
