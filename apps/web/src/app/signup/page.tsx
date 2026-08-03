import { auth } from "@/auth";
import { AuthHelpInfo } from "@/features/auth/auth-help-info";
import { SignUpStart } from "@/features/auth/signup/signup-start";
import { Body, Heading } from "@ui/components/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (session?.isSignUp) {
    redirect("/");
  }

  return (
    <div className="min-h-viewport mx-auto mb-16 mt-8 max-w-[800px] px-5 sm:px-6 lg:px-0">
      <Heading size="l" className="text-text-basic text-left">
        회원가입
      </Heading>
      <Body size="m" className="text-text-subtle mt-4">
        FORIF 부원을 위한 서비스 회원가입입니다.
        <br />
        스터디 신청, 스터디 개설, 해커톤 참여 등 더 많은 기능을 이용해보세요.
      </Body>
      <section className="mb-10 mt-12 w-full">
        <SignUpStart />
      </section>
      <AuthHelpInfo action="회원가입" />
    </div>
  );
}
