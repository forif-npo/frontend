"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs } from "@ui/components/client";
import { Body, Heading } from "@ui/components/server";
import { ProfileSidebar } from "@/features/my-page/ProfileSidebar";
import { StudySection } from "@/features/my-page/StudySection";
import { ApplicationSection } from "@/features/my-page/ApplicationSection";
import { SettingsSection } from "@/features/my-page/SettingsSection";
import { StudyManageSection } from "@/features/my-page/StudyManageSection";
import { ServiceManageSection } from "@/features/my-page/ServiceManageSection";
import type {
  UserProfile,
  UserStudiesResponse,
  StudyApplicationsResponse,
} from "@core/my-page/api";
import type { CreatedStudy } from "@core/study-manage/api";
import type { StudyApplicationSummary } from "@core/study-application/api";
import type { Semester } from "@core/semester/api";
import type { ProductApplication, ProductSummary } from "@core/products/api";

interface MyPageClientProps {
  profile: UserProfile;
  studiesData: UserStudiesResponse;
  applicationsData: StudyApplicationsResponse;
  createdStudies: CreatedStudy[];
  studyApplications: StudyApplicationSummary[];
  activeSemester: Semester;
  productApplications: ProductApplication[];
  products: ProductSummary[];
}

export function MyPageClient({
  profile,
  studiesData,
  applicationsData,
  createdStudies,
  studyApplications,
  activeSemester,
  productApplications,
  products,
}: MyPageClientProps) {
  const searchParams = useSearchParams();
  const requestedSection = searchParams.get("section");
  const shouldOpenStudyManage =
    requestedSection === "study-manage" ||
    requestedSection === "study-applications" ||
    (createdStudies.length === 0 && studyApplications.length > 0);
  const canManageServiceWorkspace = productApplications.length > 0;
  const [activeNav, setActiveNav] = useState(() => {
    if (requestedSection === "service-manage" && canManageServiceWorkspace) {
      return "service-manage";
    }
    return shouldOpenStudyManage ? "study-manage" : "my-studies";
  });
  const isApplicationsTab = searchParams.get("tab") === "applications";
  const targetStudyId = Number(searchParams.get("study_id")) || undefined;
  const pageHeader =
    activeNav === "study-manage"
      ? {
          title: "스터디 관리",
          description:
            "개설 신청서와 운영 중인 스터디를 확인하고 관리할 수 있습니다.",
        }
      : activeNav === "service-manage"
        ? {
            title: "서비스 관리",
            description:
              "서비스 등록 신청 내역과 운영 중인 서비스를 확인할 수 있습니다.",
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
        <div>
          <StudySection studiesData={studiesData} />
        </div>
      ),
    },
    {
      label: "지원서 보기",
      content: (
        <div>
          <ApplicationSection
            applicationsData={applicationsData}
            studiesData={studiesData}
            targetStudyId={targetStudyId}
            activeSemester={activeSemester}
          />
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
        canManageStudyWorkspace={
          createdStudies.length > 0 || studyApplications.length > 0
        }
        canManageServiceWorkspace={canManageServiceWorkspace}
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
          <StudyManageSection
            createdStudies={createdStudies}
            studyApplications={studyApplications}
          />
        ) : activeNav === "service-manage" ? (
          <ServiceManageSection
            applications={productApplications}
            products={products}
          />
        ) : activeNav === "settings" ? (
          <SettingsSection profile={profile} />
        ) : (
          <>
            <Tabs
              tabs={tabs}
              initialSelectedIndex={isApplicationsTab ? 1 : 0}
            />
          </>
        )}
      </div>
    </div>
  );
}
