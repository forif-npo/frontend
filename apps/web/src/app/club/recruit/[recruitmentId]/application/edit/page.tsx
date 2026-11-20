import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStaffRecruitment } from "@/features/staff-recruitment/api";
import { StaffApplicationEditFlow } from "@/features/staff-recruitment/StaffApplicationEditFlow";

export const metadata: Metadata = {
  title: "운영진 지원서 수정 | FORIF",
};

export default async function StaffApplicationEditPage({
  params,
}: {
  params: Promise<{ recruitmentId: string }>;
}) {
  const { recruitmentId: rawId } = await params;
  const recruitmentId = Number(rawId);
  if (!Number.isInteger(recruitmentId) || recruitmentId < 1) notFound();

  try {
    const recruitment = await getStaffRecruitment(recruitmentId);
    return <StaffApplicationEditFlow recruitment={recruitment} />;
  } catch {
    notFound();
  }
}
