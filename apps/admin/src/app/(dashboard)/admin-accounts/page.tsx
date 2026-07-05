import { auth } from "@/auth";
import { ShieldAlert } from "lucide-react";
import { AdminAccountsView } from "./admin-accounts-view";

const PRESIDENT_TEAM = ["회장", "부회장"];

export default async function Page() {
  const session = await auth();
  const affiliation = session?.user?.affiliation ?? null;
  const myUserId = Number(session?.user?.id ?? 0);

  // 백엔드(validatePresidentTeam)와 동일한 기준: 회장단만 접근 가능
  if (!affiliation || !PRESIDENT_TEAM.includes(affiliation)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <ShieldAlert className="text-muted-foreground h-12 w-12" />
        <h2 className="text-xl font-bold">회장단 전용 페이지입니다</h2>
        <p className="text-muted-foreground text-sm">
          운영진 계정 관리는 회장과 부회장만 사용할 수 있습니다.
        </p>
      </div>
    );
  }

  return <AdminAccountsView myAffiliation={affiliation} myUserId={myUserId} />;
}
