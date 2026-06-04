"use client";

import { logout } from "@core/auth/api";
import { signOut } from "next-auth/react";
import { useTransition } from "react";

/**
 * 로그아웃 처리 훅
 *
 * 1. 백엔드 로그아웃 API 호출 (Refresh Token 쿠키 삭제)
 * 2. NextAuth 세션 종료 후 로그인 페이지로 리디렉션
 */
export function useLogout() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await logout();
      } catch (error) {
        console.error("로그아웃 API 호출 실패:", error);
        // API 실패해도 세션 종료는 진행
      }

      await signOut({ callbackUrl: "/signin" });
    });
  };

  return { isPending, logout: handleLogout };
}
