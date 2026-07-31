"use client";

import { useState } from "react";
import { Tabs } from "@ui/components/client";
import { ProfileSidebar } from "@/features/my-page/ProfileSidebar";
import { StudySection } from "@/features/my-page/StudySection";
import { ApplicationSection } from "@/features/my-page/ApplicationSection";
import { StudyManageSection } from "@/features/my-page/StudyManageSection";
import type {
  UserProfile,
  UserStudiesResponse,
  StudyApplicationsResponse,
} from "@core/my-page/api";
import type { CreatedStudy } from "@core/study-manage/api";

interface MyPageClientProps {
  profile: UserProfile;
  studiesData: UserStudiesResponse;
  applicationsData: StudyApplicationsResponse;
  createdStudies: CreatedStudy[];
}

export function MyPageClient({
  profile,
  studiesData,
  applicationsData,
  createdStudies,
}: MyPageClientProps) {
  const [activeNav, setActiveNav] = useState("my-studies");

  const tabs = [
    {
      label: "수강한 스터디",
      content: <StudySection studiesData={studiesData} />,
    },
    {
      label: "지원서 보기",
      content: <ApplicationSection applicationsData={applicationsData} />,
    },
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
        canManageStudies={createdStudies.length > 0}
      />

      {/* Main Content */}
      <div className="w-[1216px] flex-1 py-8 pl-8">
        {/* Title */}
        <p className="text-text-bolder mb-4 text-[40px] font-bold leading-[1.5] tracking-[1px]">
          {activeNav === "study-manage" ? "스터디 관리" : "내 스터디"}
        </p>

        {activeNav === "study-manage" ? (
          <StudyManageSection createdStudies={createdStudies} />
        ) : (
          <>
            <Tabs tabs={tabs} />
          </>
        )}
      </div>
    </div>
  );
}
