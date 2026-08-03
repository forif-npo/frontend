"use client";

import { useLogout } from "@/features/auth/logout/use-logout";
import { Body } from "@ui/components/server";
import { useEffect, useRef } from "react";

export default function LogoutPage() {
  const { logout } = useLogout();
  const hasRequestedLogout = useRef(false);

  useEffect(() => {
    if (hasRequestedLogout.current) return;

    hasRequestedLogout.current = true;
    logout();
  }, [logout]);

  return (
    <main className="min-h-viewport flex items-center justify-center px-4">
      <Body size="m" className="text-text-subtle">
        로그아웃 중입니다.
      </Body>
    </main>
  );
}
