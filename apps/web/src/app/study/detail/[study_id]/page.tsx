"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { StudyDetailContent } from "@/features/study/detail/StudyDetailContent";
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
      <div className="mb-10 flex flex-col gap-4">
        <h1 className="text-[40px] font-bold leading-[1.3] tracking-[-0.5px]">
          <span className="text-secondary">{study.study_name}</span>
        </h1>
        <p className="text-text-subtle text-[17px] leading-[1.6]">
          {study.one_liner}
        </p>
      </div>

      <div className="pb-20">
        <StudyDetailContent study={study} onApply={handleApply} />
      </div>
    </div>
  );
}
