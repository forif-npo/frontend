"use client";

import { logout } from "@core/auth/api";
import { clearAccessToken } from "@core/auth/token";
import { Button } from "@ui/components/client";
import { signOut } from "next-auth/react";
import { useTransition } from "react";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        // 1. 백엔드 로그아웃 API 호출 (Refresh Token 쿠키 삭제)
        await logout();
      } catch (error) {
        console.error("로그아웃 API 호출 실패:", error);
        // API 실패해도 계속 진행
      }

      // 2. 메모리의 Access Token 삭제
      clearAccessToken();

      // 3. NextAuth 세션 종료 및 로그인 페이지로 리디렉션
      await signOut({ callbackUrl: "/signin" });
    });
  };

  return (
    <Button type="button" onClick={handleLogout} disabled={isPending}>
      {isPending ? "로그아웃 중..." : "로그아웃"}
    </Button>
  );
}
