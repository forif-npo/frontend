"use client";

import { ArrowLeft } from "@repo/assets/icons/lucide";
import { useEffect, useState } from "react";

export function SignOutButton() {
  const [csrfToken, setCsrfToken] = useState<string>("");

  useEffect(() => {
    // 컴포넌트 마운트 시 CSRF 토큰을 미리 가져옴
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch("/api/auth/csrf");
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };

    fetchCsrfToken();
  }, []);

  return (
    <form action="/api/auth/signout" method="POST">
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <input type="hidden" name="callbackUrl" value="/signin" />
      <button
        type="submit"
        className="text-text-subtle hover:text-text-basic flex cursor-pointer flex-row items-center gap-2 border-none bg-transparent p-0 transition-colors"
      >
        <ArrowLeft size={20} />
        다른 이메일 계정으로 회원가입
      </button>
    </form>
  );
}
