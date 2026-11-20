import { StaffApplicationsView } from "@/features/staff-recruitment/StaffApplicationsView";

export default async function StaffApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ recruitmentId?: string }>;
}) {
  const { recruitmentId: rawRecruitmentId } = await searchParams;
  const recruitmentId = Number(rawRecruitmentId);
  return (
    <StaffApplicationsView
      initialRecruitmentId={
        Number.isInteger(recruitmentId) && recruitmentId > 0
          ? recruitmentId
          : undefined
      }
    />
  );
}
