"use client";

import { useState } from "react";
import { ProfileSidebar } from "@/features/my-page/ProfileSidebar";
import { StudySection } from "@/features/my-page/StudySection";
import { ApplicationSection } from "@/features/my-page/ApplicationSection";
import type {
  UserProfile,
  UserStudiesResponse,
  StudyApplicationsResponse,
} from "@core/my-page/api";

interface MyPageClientProps {
  profile: UserProfile;
  studiesData: UserStudiesResponse;
  applicationsData: StudyApplicationsResponse;
}

export function MyPageClient({
  profile,
  studiesData,
  applicationsData,
}: MyPageClientProps) {
  const [activeTab, setActiveTab] = useState("my-studies");

  return (
    <div className="flex min-h-screen">
      <ProfileSidebar
        profile={{
          user_name: profile.user_name,
          department: profile.department,
          user_id: profile.user_id,
          role: profile.role,
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content - Conditional rendering based on active tab */}
      {activeTab === "my-studies" && <StudySection studiesData={studiesData} />}
      {activeTab === "applications" && (
        <ApplicationSection applicationsData={applicationsData} />
      )}
    </div>
  );
}
