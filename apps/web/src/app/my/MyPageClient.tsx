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

type ContentTab = "studies" | "applications";

export function MyPageClient({
  profile,
  studiesData,
  applicationsData,
}: MyPageClientProps) {
  const [activeNav, setActiveNav] = useState("my-studies");
  const [activeTab, setActiveTab] = useState<ContentTab>("studies");

  const tabs: { id: ContentTab; label: string }[] = [
    { id: "studies", label: "수강한 스터디" },
    { id: "applications", label: "지원서 보기" },
  ];

  return (
    <div className="min-h-viewport mx-auto flex max-w-[1440px]">
      <ProfileSidebar
        profile={{
          user_name: profile.user_name,
          department: profile.department,
          user_id: profile.user_id,
          role: profile.role,
          img_url: profile.img_url,
        }}
        activeNav={activeNav}
        onNavChange={setActiveNav}
      />

      {/* Main Content */}
      <div className="w-[1216px] flex-1 py-8 pl-8">
        {/* Title */}
        <p className="mb-4 text-[40px] font-bold leading-[1.5] tracking-[1px] text-black">
          내 스터디
        </p>

        {/* Tabs */}
        <div className="mb-4 flex gap-4 border-b border-[#cdd1d5]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex h-[48px] min-w-[64px] items-center justify-center whitespace-nowrap border-b-[3px] px-2 text-[17px] font-bold leading-[1.5] transition-colors ${
                  isActive
                    ? "border-[#063a74] text-[#052b57]"
                    : "border-transparent text-[#052b57] hover:border-[#063a74]/30"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "studies" && <StudySection studiesData={studiesData} />}
        {activeTab === "applications" && (
          <ApplicationSection applicationsData={applicationsData} />
        )}
      </div>
    </div>
  );
}
