import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStaffRecruitment } from "@/features/staff-recruitment/api";
import { StaffApplicationFlow } from "@/features/staff-recruitment/StaffApplicationFlow";

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
    return <StaffApplicationFlow recruitment={recruitment} />;
  } catch {
    notFound();
  }
}
