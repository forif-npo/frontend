import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { getStaffRecruitment } from "@/features/staff-recruitment/api";
import { StaffApplicationForm } from "@/features/staff-recruitment/StaffApplicationForm";

export const metadata: Metadata = {
  title: "운영진 지원서 | FORIF",
  description: "FORIF 운영진 모집 지원서를 작성합니다.",
};

export default async function StaffApplicationPage({
  params,
}: {
  params: Promise<{ recruitmentId: string }>;
}) {
  const { recruitmentId: rawId } = await params;
  const recruitmentId = Number(rawId);
  if (!Number.isInteger(recruitmentId) || recruitmentId < 1) notFound();

  try {
    const recruitment = await getStaffRecruitment(recruitmentId);
    return (
      <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
        <PageHeader
          breadcrumbs={[
            { label: "홈", href: "/" },
            { label: "운영진 모집", href: "/club/recruit" },
            { label: "지원서 작성" },
          ]}
          title={recruitment.title}
          description="작성 중인 내용은 브라우저에 저장되지 않습니다. 제출 전 내용을 확인해주세요."
        />
        <StaffApplicationForm recruitment={recruitment} />
      </main>
    );
  } catch {
    notFound();
  }
}
