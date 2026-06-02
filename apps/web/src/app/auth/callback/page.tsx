"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AuthSkeleton } from "@/components/skeleton/AuthSkeleton";

/**
 * Google OAuth 콜백 페이지
 *
 * NextAuth의 signIn 콜백에서 이미 백엔드 로그인 처리가 완료되었으므로
 * 세션 상태를 확인하고 리디렉션합니다.
 * NextAuth 세션이 accessToken을 자동으로 관리합니다.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    // 세션이 없으면 로그인 페이지로
    if (!session) {
      router.push("/signin");
      return;
    }

    // 백엔드 JWT가 있으면 (로그인 완료)
    if (session.accessToken) {
      router.push("/");
      return;
    }

    // JWT가 없으면 로그인 실패
    console.error("❌ No JWT in session");
    router.push("/signin?error=authentication_failed");
  }, [session, status, router]);

  return <AuthSkeleton />;
}
