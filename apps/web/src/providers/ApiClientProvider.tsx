"use client";

import {
  setTokenGetter,
  setTokenRefresher,
  setOnTokenRefreshed,
  setOnUnauthorized,
} from "@core/utils/api-client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";

/**
 * apiClient에 NextAuth 세션 토큰 getter를 주입하는 Provider
 *
 * - 토큰 getter: NextAuth 세션에서 accessToken 가져오기
 * - 토큰 갱신 콜백: 갱신된 토큰을 NextAuth 세션에 업데이트
 * - 401 에러 콜백: 토큰 갱신 실패 시 로그아웃 처리
 */
export function ApiClientProvider({ children }: { children: React.ReactNode }) {
  const { data: session, update } = useSession();
  const isSigningOut = useRef(false);

  const signOutExpiredSession = () => {
    if (isSigningOut.current) return;
    isSigningOut.current = true;
    // 로그인한 적 없는 방문자에게는 만료 안내 없이 로그인 페이지로만 보낸다
    if (session) {
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
    }
    signOut({ callbackUrl: "/signin" });
  };

  // 서버 jwt 콜백에서 refresh token 갱신이 실패하면 session.error가 세팅됨.
  // 이 경우 만료된 세션을 정리하고 로그인 페이지로 보낸다.
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError" && !isSigningOut.current) {
      signOutExpiredSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.error]);

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
      signOutExpiredSession();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, update]);

  return <>{children}</>;
}
