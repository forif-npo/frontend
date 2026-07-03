"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

/**
 * 백엔드 토큰 갱신 실패(session.error) 시 즉시 로그아웃 처리한다.
 * 서버 컴포넌트에서만 데이터를 불러오는 페이지는 클라이언트 API 호출이 없어
 * apiClient의 401 처리로는 만료를 감지하지 못하므로 세션 자체를 감시한다.
 */
export function SessionExpiredGuard() {
  const { data: session } = useSession();
  const hasSignedOut = useRef(false);

  useEffect(() => {
    if (session?.error && !hasSignedOut.current) {
      hasSignedOut.current = true;
      toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
      signOut({ callbackUrl: "/signin" });
    }
  }, [session?.error]);

  return null;
}
