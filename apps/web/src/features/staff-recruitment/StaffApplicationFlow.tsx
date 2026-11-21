"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatStaffRecruitmentTitle } from "@core/staff-recruitment";
import type { StaffInterviewPlan, StaffRecruitmentRound } from "@core/types/staff-recruitment";
import { PageHeader } from "@/components/PageHeader";
import { StaffApplicationComplete } from "./StaffApplicationComplete";
import { StaffApplicationForm } from "./StaffApplicationForm";

interface Submission {
  submittedAt: string;
  firstDepartment: string;
  secondDepartment: string | null;
}

export function StaffApplicationFlow({
  recruitment,
  interviewPlan,
}: {
  recruitment: StaffRecruitmentRound;
  interviewPlan: StaffInterviewPlan | null;
}) {
  const router = useRouter();
  const [submission, setSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    if (submission) window.scrollTo(0, 0);
  }, [submission]);

  if (submission) {
    return (
      <main className="min-h-viewport max-w-main mx-auto w-full px-4 sm:px-6">
        <StaffApplicationComplete
          recruitment={recruitment}
          submission={submission}
          onGoToApplication={() =>
            router.push(`/my?section=staff-applications&recruitment_id=${recruitment.recruitment_id}`)
          }
          onGoToRecruitment={() => router.push("/club/recruit")}
        />
      </main>
    );
  }

  return (
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      <PageHeader
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "운영진 모집", href: "/club/recruit" },
          { label: "지원서 작성" },
        ]}
        title={formatStaffRecruitmentTitle(recruitment.act_year, recruitment.act_semester)}
        description="작성 중인 내용은 저장되지 않습니다. 제출 전 작성한 내용을 꼼꼼히 확인해주세요."
      />
      <StaffApplicationForm
        recruitment={recruitment}
        interviewPlan={interviewPlan}
        onSubmitted={(result, departments) =>
          setSubmission({
            submittedAt: result.submitted_at,
            firstDepartment: departments.first,
            secondDepartment: departments.second,
          })
        }
      />
    </main>
  );
}
