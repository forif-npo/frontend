"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@ui/components/client";
import { StudyDetailContent } from "@/features/study/detail/StudyDetailContent";
import { StudyDetailNavigation } from "@/features/study/detail/StudyDetailNavigation";
import { useStudyDetail } from "@/hooks/useStudyDetail";

type Props = {
  params: Promise<{ study_id: string }>;
};

export default function StudyDetailPage({ params }: Props) {
  const router = useRouter();
  const { study_id } = use(params);
  const { study, isLoading, error } = useStudyDetail(study_id);

  const handleApply = () => {
    router.push(`/study/detail/${study_id}/apply`);
  };

  if (isLoading) {
    return (
      <div className="px-6 py-8">
        <div className="flex h-[400px] items-center justify-center">
          <div className="text-text-subtle text-lg">로딩 중...</div>
        </div>
      </div>
    );
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
    <div className="px-6">
      <div className="mb-6 flex flex-col gap-2 md:mb-10 md:gap-4">
        <h1 className="text-[28px] font-bold leading-[1.3] tracking-[-0.5px] md:text-[40px]">
          <span className="text-secondary">{study.study_name}</span>
        </h1>
        <p className="text-text-subtle text-[15px] leading-[1.6] md:text-[17px]">
          {study.one_liner}
        </p>
      </div>

      <div className="flex gap-10 pb-28 lg:pb-20">
        <div className="flex-1">
          <StudyDetailContent study={study} />
        </div>
        <StudyDetailNavigation
          studyName={study.study_name}
          onApply={handleApply}
          isApplyDisabled={study.recruit_status !== "APPLICABLE"}
        />
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-[#e5e8eb] bg-white p-4 lg:hidden">
        <Button
          variant="primary"
          size="large"
          onClick={handleApply}
          disabled={study.recruit_status !== "APPLICABLE"}
          className="h-14 w-full"
        >
          {study.recruit_status === "APPLICABLE"
            ? "스터디 신청하기"
            : "모집 마감"}
        </Button>
      </div>
    </div>
  );
}
