import type { Metadata } from "next";
import { auth } from "@/auth";
import { SemesterManageView } from "./semester-manage-view";

export const metadata: Metadata = {
  title: "학기 관리 | FORIF Admin",
};

export default async function SemesterPage() {
  const session = await auth();
  const affiliation = session?.user?.affiliation ?? "";

  // 학기 전환은 회장직 인수인계를 동반하므로 회장 본인만 할 수 있다
  if (affiliation !== "회장") {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-24">
        <h2 className="text-xl font-bold">회장 전용 페이지입니다</h2>
        <p className="text-muted-foreground text-sm">
          학기를 전환하면 차기 회장에게 권한이 넘어가므로, 회장만 진행할 수
          있습니다.
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
