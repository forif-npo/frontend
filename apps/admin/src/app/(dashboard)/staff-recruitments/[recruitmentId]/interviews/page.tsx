import { auth } from "@/auth";
import { ShieldAlert } from "lucide-react";
import { StaffInterviewManageView } from "@/features/staff-recruitment/StaffInterviewManageView";

const PRESIDENT_TEAM = ["회장", "부회장"];

export default async function StaffInterviewManagePage({
  params,
}: {
  params: Promise<{ recruitmentId: string }>;
}) {
  const session = await auth();
  if (!PRESIDENT_TEAM.includes(session?.user?.authorityAffiliation ?? "")) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <ShieldAlert className="text-muted-foreground h-12 w-12" />
        <h1 className="text-xl font-bold">회장단 전용 페이지입니다</h1>
        <p className="text-muted-foreground text-sm">
          면접 관리는 회장과 부회장만 사용할 수 있습니다.
        </p>
      </div>
    );
  }

  const { recruitmentId: rawRecruitmentId } = await params;
  const recruitmentId = Number(rawRecruitmentId);
  if (!Number.isInteger(recruitmentId) || recruitmentId <= 0) {
    return (
      <div className="p-8 text-center">올바르지 않은 모집 회차입니다.</div>
    );
  }
  return <StaffInterviewManageView recruitmentId={recruitmentId} />;
}
