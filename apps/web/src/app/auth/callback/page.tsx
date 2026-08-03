"use client";

import { handleGoogleCallback } from "@/features/auth/signin/actions";
import { Body } from "@ui/components/server";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AuthSkeleton } from "@/components/skeleton/AuthSkeleton";

/**
 * Google OAuth 콜백 페이지
 *
 * Google OAuth 인증 후 기존 사용자 로그인 여부를 확인합니다.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const { status } = useSession();
  const hasRequested = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    // 세션이 없으면 로그인 페이지로
    if (status === "unauthenticated") {
      router.replace("/signin");
      return;
    }

    if (hasRequested.current) return;
    hasRequested.current = true;

    const completeSignIn = async () => {
      const result = await handleGoogleCallback();

      if (result.status === "signed_in") {
        router.replace("/");
        return;
      }

      if (result.status === "not_registered") {
        router.replace("/signup");
        return;
      }

      setErrorMessage(result.message);
    };

    void completeSignIn();
  }, [status, router]);

  if (errorMessage) {
    return (
      <main className="min-h-viewport mx-auto flex max-w-[800px] flex-col justify-center gap-3 px-5">
        <Body size="l" className="text-text-basic">
          로그인에 실패했습니다.
        </Body>
        <Body size="m" className="text-text-subtle">
          {errorMessage}
        </Body>
      </main>
    );
  }

  return <AuthSkeleton />;
}
