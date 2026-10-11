import { getCurrentStaffRecruitment } from "@/features/staff-recruitment/api";
import { StaffRecruitmentView } from "@/features/staff-recruitment/StaffRecruitmentView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "운영진 모집 안내",
  description: "FORIF 운영진 모집 일정과 부서, 지원 문항을 확인합니다.",
};

export default async function StaffRecruitPage() {
  try {
    const recruitment = await getCurrentStaffRecruitment();
    return <StaffRecruitmentView recruitment={recruitment} />;
  } catch {
    return <StaffRecruitmentView recruitment={null} failed />;
  }
}
