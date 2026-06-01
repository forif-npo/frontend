"use client";

import {
  setTokenGetter,
  setTokenRefresher,
  setOnTokenRefreshed,
  setOnUnauthorized,
} from "@core/utils/api-client";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

/**
 * apiClient에 NextAuth 세션 토큰 getter를 주입하는 Provider
 *
 * - 토큰 getter: NextAuth 세션에서 accessToken 가져오기
 * - 토큰 갱신 콜백: 갱신된 토큰을 NextAuth 세션에 업데이트
 * - 401 에러 콜백: 토큰 갱신 실패 시 로그아웃 처리
 */
export function ApiClientProvider({ children }: { children: React.ReactNode }) {
  const { data: session, update } = useSession();

  useEffect(() => {
    // NextAuth 세션에서 토큰 가져오는 getter 설정
    setTokenGetter(async () => {
      return session?.accessToken || null;
    });

    // 백엔드 refresh token은 NextAuth JWT 안에 보관하고, 서버 콜백에서 회전시킴
    setTokenRefresher(async () => {
      const refreshedSession = await update({ forceRefresh: true });
      return refreshedSession?.accessToken || null;
    });

    // 토큰 갱신 완료 시 NextAuth 세션 업데이트
    setOnTokenRefreshed(async (newToken: string) => {
      await update({ accessToken: newToken });
    });

    // 토큰 갱신 실패 시 로그아웃 처리
    setOnUnauthorized(() => {
      signOut({ callbackUrl: "/signin" });
    });
  }, [session, update]);

  return <>{children}</>;
}
