import { auth } from "@/auth";
import { ShieldAlert } from "lucide-react";
import { StaffApplicationsView } from "@/features/staff-recruitment/StaffApplicationsView";

const PRESIDENT_TEAM = ["회장", "부회장"];

export default async function StaffApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ recruitmentId?: string }>;
}) {
  const session = await auth();
  if (!PRESIDENT_TEAM.includes(session?.user?.affiliation ?? "")) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <ShieldAlert className="text-muted-foreground h-12 w-12" />
        <h1 className="text-xl font-bold">회장단 전용 페이지입니다</h1>
        <p className="text-muted-foreground text-sm">
          운영진 지원서는 회장과 부회장만 열람할 수 있습니다.
        </p>
      </div>
    );
  }
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
