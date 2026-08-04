"use client";

import { handleGoogleCallback } from "@/features/auth/signin/actions";
import { Body } from "@ui/components/server";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { AuthSkeleton } from "@/components/skeleton/AuthSkeleton";

/**
 * Google OAuth 콜백 페이지
 *
 * Google OAuth 인증 후 로그인 또는 회원가입 흐름을 처리합니다.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status, update } = useSession();
  const hasRequested = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isNotRegistered, setIsNotRegistered] = useState(false);
  const flow = searchParams.get("flow") === "signup" ? "signup" : "signin";

  useEffect(() => {
    if (isNotRegistered || errorMessage) return;
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
        await update();
        router.replace("/");
        router.refresh();
        return;
      }

      if (result.status === "not_registered") {
        if (flow === "signup") {
          router.replace("/signup/form");
          return;
        }

        await signOut({ redirect: false });
        setIsNotRegistered(true);
        return;
      }

      setErrorMessage(result.message);
    };

    void completeSignIn();
  }, [errorMessage, flow, isNotRegistered, router, status, update]);

  if (isNotRegistered) {
    return (
      <main className="min-h-viewport mx-auto flex max-w-[800px] flex-col justify-center gap-3 px-5">
        <Body size="l" className="text-text-basic">
          가입되지 않은 계정입니다.
        </Body>
        <Body size="m" className="text-text-subtle">
          회원가입 후 서비스를 이용해주세요.
        </Body>
        <div className="mt-3 flex gap-4">
          <Link href="/signup" className="text-text-primary underline">
            회원가입
          </Link>
          <Link href="/signin" className="text-text-subtle underline">
            다른 계정으로 로그인
          </Link>
        </div>
      </main>
    );
  }

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
