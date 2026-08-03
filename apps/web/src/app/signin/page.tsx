import { auth } from "@/auth";
import { AuthHelpInfo } from "@/features/auth/auth-help-info";
import { SignInTab } from "@/features/auth/signin/signin-tab";
import { Body, Heading } from "@ui/components/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (session?.isSignUp) {
    redirect("/");
  }

  return (
    <div className="min-h-viewport mx-auto mt-8 max-w-[800px] px-5 sm:px-6 lg:px-0">
      <Heading size="l" className="text-text-basic text-left">
        로그인 방식을 선택해주세요
      </Heading>
      <Body size="m" className="text-text-subtle mt-4">
        FORIF 부원을 위한 통합 로그인입니다.
        <br />
        로그인을 하시면 보다 더 많은 정보와 서비스를 이용하실 수 있습니다.
      </Body>
      <section className="mt-12 w-full">
        <SignInTab />
      </section>
      <section className="mt-10 w-full">
        <AuthHelpInfo action="로그인" />
      </section>
    </div>
  );
}
