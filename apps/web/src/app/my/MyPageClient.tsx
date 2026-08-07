"use client";

import { useState } from "react";
import { Tabs } from "@ui/components/client";
import { Body, Heading } from "@ui/components/server";
import { ProfileSidebar } from "@/features/my-page/ProfileSidebar";
import { StudySection } from "@/features/my-page/StudySection";
import { ApplicationSection } from "@/features/my-page/ApplicationSection";
import { SettingsSection } from "@/features/my-page/SettingsSection";
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
  const pageHeader =
    activeNav === "study-manage"
      ? {
          title: "스터디 관리",
          description: "개설한 스터디의 운영 현황을 관리할 수 있습니다.",
        }
      : activeNav === "settings"
        ? {
            title: "설정",
            description: "계정 정보를 확인하고 수정할 수 있습니다.",
          }
        : {
            title: "내 스터디",
            description: "수강한 스터디와 지원 현황을 확인할 수 있습니다.",
          };

  const tabs = [
    {
      label: "수강한 스터디",
      content: (
        <div className="pt-6 md:pt-8">
          <StudySection studiesData={studiesData} />
        </div>
      ),
    },
    {
      label: "지원서 보기",
      content: (
        <div className="pt-6 md:pt-8">
          <ApplicationSection applicationsData={applicationsData} />
        </div>
      ),
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
      <div className="min-w-0 flex-1 px-4 py-10 lg:px-10">
        <div className="mb-8 flex flex-col gap-3 md:mb-12">
          <Heading size="l" className="text-text-bolder">
            {pageHeader.title}
          </Heading>
          <Body size="l" className="text-text-basic">
            {pageHeader.description}
          </Body>
        </div>

        {activeNav === "study-manage" ? (
          <StudyManageSection createdStudies={createdStudies} />
        ) : activeNav === "settings" ? (
          <SettingsSection profile={profile} />
        ) : (
          <>
            <Tabs tabs={tabs} />
          </>
        )}
      </div>
    </div>
  );
}
