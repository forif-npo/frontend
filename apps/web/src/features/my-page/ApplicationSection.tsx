"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApplicationCard } from "./ApplicationCard";
import { ApplicationDetailView } from "./ApplicationDetailView";
import {
  StudySortControl,
  type StudySortOrder,
} from "@/components/study/ui/StudySortControl";
import type {
  StudyApplicationsResponse,
  ApplicationDetail,
  UserStudiesResponse,
} from "@core/my-page/api";
import type { Semester } from "@core/semester/api";

interface ApplicationSectionProps {
  applicationsData: StudyApplicationsResponse;
  studiesData: UserStudiesResponse;
  targetStudyId?: number;
  activeSemester: Semester;
}

type FlatApplication = ApplicationDetail & {
  apply_date: string;
  apply_year: number;
  apply_semester: number;
  user_apply_id: number;
};

export function ApplicationSection({
  applicationsData,
  studiesData,
  targetStudyId,
  activeSemester,
}: ApplicationSectionProps) {
  const router = useRouter();
  const [sortOrder, setSortOrder] = useState<StudySortOrder>("latest");

  const enrolledStudyMetadata = new Map(
    studiesData.flatMap((semester) =>
      semester.studies.map((study) => [
        study.study_id,
        { difficulty: study.difficulty, tags: study.tags },
      ]),
    ),
  );

  const normalizeStudyMetadata = (application: ApplicationDetail) => ({
    ...application,
    study: {
      ...application.study,
      ...enrolledStudyMetadata.get(application.study.study_id),
    },
  });

  const allApplications = applicationsData.applications.flatMap((app) => {
    const items: FlatApplication[] = [
      {
        ...normalizeStudyMetadata(app.primary_application),
        apply_date: app.apply_date,
        apply_year: app.apply_year,
        apply_semester: app.apply_semester,
        user_apply_id: app.user_apply_id,
      },
    ];
    if (app.secondary_application) {
      items.push({
        ...normalizeStudyMetadata(app.secondary_application),
        apply_date: app.apply_date,
        apply_year: app.apply_year,
        apply_semester: app.apply_semester,
        user_apply_id: app.user_apply_id,
      });
    }
    return items;
  });

  const [selectedApplication, setSelectedApplication] =
    useState<FlatApplication | null>(() =>
      targetStudyId
        ? (allApplications.find(
            (application) =>
              application.priority === "PRIMARY" &&
              application.study.study_id === targetStudyId,
          ) ?? null)
        : null,
    );

  const sortedApplications = [...allApplications].sort((a, b) => {
    const dateA = new Date(a.apply_date).getTime();
    const dateB = new Date(b.apply_date).getTime();
    return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
  });

  const selectedApplicationRecord = selectedApplication
    ? applicationsData.applications.find(
        (item) => item.user_apply_id === selectedApplication.user_apply_id,
      )
    : undefined;
  const isSelectedApplicationInActiveSemester =
    selectedApplicationRecord?.apply_year === activeSemester.act_year &&
    selectedApplicationRecord.apply_semester === activeSemester.act_semester;
  const canCancelSelectedApplication = Boolean(
    isSelectedApplicationInActiveSemester && selectedApplication?.status === 0,
  );
  const cancelDisabledMessage = !isSelectedApplicationInActiveSemester
    ? "활동 학기 신청서만 취소할 수 있습니다."
    : "검토가 완료된 신청서는 취소할 수 없습니다.";

  if (selectedApplication) {
    return (
      <ApplicationDetailView
        application={selectedApplication}
        canCancel={canCancelSelectedApplication}
        cancelDisabledMessage={cancelDisabledMessage}
        onCancelled={() => {
          setSelectedApplication(null);
          router.refresh();
        }}
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-text-basic text-[19px] font-bold leading-[1.5]">
          지원서{" "}
          <span className="text-text-primary">{sortedApplications.length}</span>
          개
        </p>
        <StudySortControl value={sortOrder} onChange={setSortOrder} />
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
