import type { Metadata } from "next";
import { auth } from "@/auth";
import { SemesterManageView } from "./semester-manage-view";

export const metadata: Metadata = {
  title: "학기 관리 | FORIF Admin",
};

const PRESIDENT_TEAM = ["회장", "부회장"];

export default async function SemesterPage() {
  const session = await auth();
  const affiliation = session?.user?.affiliation ?? "";

  if (!PRESIDENT_TEAM.includes(affiliation)) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-24">
        <h2 className="text-xl font-bold">회장단 전용 페이지입니다</h2>
        <p className="text-muted-foreground text-sm">
          활동 학기 전환은 회장과 부회장만 할 수 있습니다.
        </p>
      </div>
    );
  }

  return (
    <SemesterManageView
      currentUserId={Number(session?.user?.id)}
      currentUserName={session?.user?.name ?? ""}
    />
  );
}
