"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatStaffRecruitmentTitle } from "@core/staff-recruitment";
import type { StaffApplicationDetail, StaffRecruitmentRound } from "@core/types/staff-recruitment";
import { InlineLoadingState, PageState } from "@ui/components/server";
import { PageHeader } from "@/components/PageHeader";
import { getMyStaffApplication } from "./api";
import { getStaffApplicationErrorInfo } from "./application-error";
import { StaffApplicationForm } from "./StaffApplicationForm";

export function StaffApplicationEditFlow({
  recruitment,
}: {
  recruitment: StaffRecruitmentRound;
}) {
  return (
    <StaffApplicationEditContent
      key={recruitment.recruitment_id}
      recruitment={recruitment}
    />
  );
}

function StaffApplicationEditContent({
  recruitment,
}: {
  recruitment: StaffRecruitmentRound;
}) {
  const router = useRouter();
  const [application, setApplication] = useState<StaffApplicationDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getMyStaffApplication(recruitment.recruitment_id)
      .then((result) => {
        if (active) setApplication(result);
      })
      .catch(async (reason) => {
        const info = await getStaffApplicationErrorInfo(reason);
        if (active) setError(info.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [recruitment.recruitment_id]);

  if (!recruitment.application_open) {
    return (
      <PageState
        title="운영진 모집 접수가 종료되었습니다"
        description="지원서 수정과 취소는 접수 중에만 가능합니다."
      />
    );
  }

  if (!loading && (error || !application)) {
    return (
      <PageState
        title="지원서를 불러오지 못했습니다"
        description={error ?? "내 지원서를 찾을 수 없습니다."}
      />
    );
  }

  return (
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      <PageHeader
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "운영진 모집", href: "/club/recruit" },
          { label: "지원서 수정" },
        ]}
        title={`${formatStaffRecruitmentTitle(recruitment.act_year, recruitment.act_semester)} 지원서 수정`}
      />
      {loading ? (
        <InlineLoadingState
          message="지원서를 불러오는 중입니다."
          textClassName="text-base"
        />
      ) : application ? (
        <StaffApplicationForm
          recruitment={recruitment}
          initialApplication={application}
          onUpdated={() =>
            router.push(
              `/my?section=staff-applications&recruitment_id=${recruitment.recruitment_id}`,
            )
          }
          onCancelled={() => router.push("/my?section=staff-applications")}
        />
      ) : null}
    </main>
  );
}
