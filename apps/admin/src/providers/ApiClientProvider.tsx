"use client";

import {
  setTokenGetter,
  setTokenRefresher,
  setOnTokenRefreshed,
  setOnUnauthorized,
} from "@core/utils/api-client";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "sonner";

export function ApiClientProvider({ children }: { children: React.ReactNode }) {
  const { data: session, update } = useSession();

  useEffect(() => {
    setTokenGetter(async () => {
      return session?.access_token || null;
    });

    setTokenRefresher(async () => {
      const refreshedSession = await update({ forceRefresh: true });
      // 갱신 실패 시 세션에 남은 만료 토큰을 돌려주면
      // ky가 갱신 성공으로 착각해 로그아웃 경로가 실행되지 않는다
      if (refreshedSession?.error || !refreshedSession?.access_token) {
        return null;
      }
      return refreshedSession.access_token;
    });

    setOnTokenRefreshed(async (newToken: string) => {
      await update({ access_token: newToken });
    });

    setOnUnauthorized(() => {
      toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
      signOut({ callbackUrl: "/signin" });
    });
  }, [session, update]);

  return <>{children}</>;
}
