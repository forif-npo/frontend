"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@ui/components/client";
import { StudyDetailContent } from "@/features/study/detail/StudyDetailContent";
import { StudyDetailNavigation } from "@/features/study/detail/StudyDetailNavigation";
import { useStudyDetail } from "@/hooks/useStudyDetail";
import { StudyDetailSkeleton } from "@/features/study/detail/StudyDetailSkeleton";

type Props = {
  params: Promise<{ study_id: string }>;
};

export default function StudyDetailPage({ params }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const { study_id } = use(params);
  const { study, isLoading, error } = useStudyDetail(study_id);

  const handleApply = () => {
    if (!session?.accessToken) {
      router.push(`/signin?callbackUrl=/studies/apply?study_id=${study_id}`);
      return;
    }
    router.push(`/studies/apply?study_id=${study_id}`);
  };

  if (isLoading) {
    return <StudyDetailSkeleton />;
  }

  if (error || !study) {
    return (
      <div className="px-6 py-8">
        <div className="flex h-[400px] items-center justify-center">
          <div className="text-text-danger text-lg">
            스터디 정보를 불러올 수 없습니다.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6">
      <div className="mb-12 flex flex-col gap-2 md:mb-16 md:gap-4">
        <h1 className="text-[24px] font-bold leading-[1.3] tracking-[-0.5px] md:text-[40px]">
          <span className="text-secondary">{study.study_name}</span>
        </h1>
        {study.one_liner && (
          <p className="rounded-lg bg-sky-100 px-4 py-3 text-[15px] font-medium leading-[1.6] text-sky-900 md:text-[19px]">
            {study.one_liner}
          </p>
        )}
      </div>

      <div className="flex gap-10 pb-28 md:pb-20">
        <div className="min-w-0 flex-1">
          <StudyDetailContent study={study} />
        </div>
        <StudyDetailNavigation
          studyName={study.study_name}
          onApply={handleApply}
          isApplyDisabled={study.recruit_status !== "APPLICABLE"}
        />
      </div>

      <div className="bg-surface-white border-divider-gray-light fixed inset-x-0 bottom-0 z-50 border-t p-4 md:hidden">
        <Button
          variant="primary"
          size="large"
          onClick={handleApply}
          disabled={study.recruit_status !== "APPLICABLE"}
          className="h-14 w-full cursor-pointer"
        >
          {study.recruit_status === "APPLICABLE"
            ? "스터디 신청하기"
            : "모집 마감"}
        </Button>
      </div>
    </div>
  );
}
