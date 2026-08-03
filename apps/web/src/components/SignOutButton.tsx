"use client";

import { Button } from "@ui/components/client";
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
    <form
      action="/api/auth/signout"
      method="POST"
      className="mb-2 flex cursor-pointer items-center justify-end"
    >
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <input type="hidden" name="callbackUrl" value="/signin" />
      <Button variant="secondary" size="medium" type="submit">
        로그인 화면으로
      </Button>
    </form>
  );
}
