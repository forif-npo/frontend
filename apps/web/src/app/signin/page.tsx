import { auth } from "@/auth";
import { SignInTab } from "@/features/auth/signin/signin-tab";
import { Heading } from "@ui/components/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (session && !session.isSignUp) {
    redirect("/signup");
  }

  return (
    <div className="mx-auto mt-8 min-h-screen max-w-[800px]">
      <Heading size="xxs" className="text-text-subtle text-left">
        포리프 부원/멘토 로그인
      </Heading>
      <Heading size="l" className="text-text-basic text-left">
        로그인 방식을 선택해주세요.
      </Heading>
      <section className="mt-12 w-full">
        <SignInTab />
      </section>
    </div>
  );
}
