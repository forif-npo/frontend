"use client";

import { Button } from "@ui/components/client";
import { useEffect, useState } from "react";

interface SignOutButtonProps {
  callbackUrl?: string;
  label?: string;
}

export function SignOutButton({
  callbackUrl = "/signin",
  label = "로그인 화면으로",
}: SignOutButtonProps) {
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
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <Button variant="secondary" size="medium" type="submit">
        {label}
      </Button>
    </form>
  );
}
