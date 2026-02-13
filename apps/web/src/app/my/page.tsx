import { auth, signOut } from "@/auth";
import { Button } from "@ui/components/client";
import { redirect } from "next/navigation";

export default async function MyPage() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }
  return (
    <div>
      <p>{session.user?.name}</p>
      <p>{session.user?.image}</p>
      <p>{session.user?.email}</p>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <Button>로그아웃</Button>
      </form>
    </div>
  );
}
