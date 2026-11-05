import { auth } from "@/auth";
import { ShieldAlert } from "lucide-react";
import { StaffRecruitmentManageView } from "@/features/staff-recruitment/StaffRecruitmentManageView";

const PRESIDENT_TEAM = ["회장", "부회장"];

export default async function StaffRecruitmentsPage() {
  const session = await auth();
  const affiliation = session?.user?.affiliation ?? "";

  if (!PRESIDENT_TEAM.includes(affiliation)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <ShieldAlert className="text-muted-foreground h-12 w-12" />
        <h1 className="text-xl font-bold">회장단 전용 페이지입니다</h1>
        <p className="text-muted-foreground text-sm">
          운영진 모집 설정은 회장과 부회장만 사용할 수 있습니다.
        </p>
      </div>
    );
  }

  return <StaffRecruitmentManageView />;
}
