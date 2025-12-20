"use client";

import { CheckCircle } from "@repo/assets/icons/lucide";
import { Button } from "@ui/components/client";
import { Body, Divider, Heading, LinkButton } from "@ui/components/server";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    // NextAuth 세션에 토큰이 있는지 확인
    const hasToken = !!session?.accessToken;
    setIsAuthenticated(hasToken);

    if (!hasToken) {
      // 토큰이 없으면 로그인 페이지로
      router.push("/signin");
    }
  }, [session, status, router]);

  const handleGoToMyPage = () => {
    router.push("/my");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>로그인 정보를 확인하는 중...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 min-h-screen max-w-[800px]">
      <div className="flex flex-col items-center gap-6">
        <CheckCircle size={128} className="text-icon-primary" />
        <Heading size="xl" className="text-text-basic text-left">
          회원가입이 완료되었습니다
        </Heading>
        <Button onClick={handleGoToMyPage} size="large">
          마이페이지로 이동
        </Button>
        <section className="rounded-3 bg-surface-secondary-subtler flex w-full flex-row items-center justify-around gap-3 p-10">
          <Body size="l" weight="bold">
            가입 정보
          </Body>
          <div className="flex flex-col gap-4">
            <Body size="l" className="text-text-basic">
              standardstar@hanyang.ac.kr
            </Body>
            <Body size="l" className="text-text-basic">
              2023063845
            </Body>
            <Body size="l" className="text-text-basic">
              정보시스템학과
            </Body>
            <Body size="l" className="text-text-basic">
              표준성
            </Body>
            <Body size="l" className="text-text-basic">
              010-2078-9868
            </Body>
          </div>
        </section>
        <div className="flex flex-row gap-4">
          <Button variant="tertiary">스터디 목록</Button>
          <Button>스터디 신청</Button>
        </div>
        <div className="bg-surface-gray-subtler flex w-full flex-col gap-3 p-10">
          <Heading size="s">이런 서비스는 어떠세요?</Heading>
          <Body>
            회원가입 이후 부원들이 일반적으로 함께 이용한 서비스입니다.
          </Body>
          <Divider full />
          <div className="flex flex-row gap-4">
            <LinkButton href="/studies">스터디 목록</LinkButton>
            <LinkButton href="/studies/new">스터디 신청</LinkButton>
            <LinkButton href="/studies/new">동아리 소개</LinkButton>
            <LinkButton href="/studies/new">기술 블로그 </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
