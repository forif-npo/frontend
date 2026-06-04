"use client";

import { Button } from "@ui/components/client";

import { useLogout } from "./use-logout";

export function LogoutButton() {
  const { isPending, logout } = useLogout();

  return (
    <Button type="button" onClick={logout} disabled={isPending}>
      {isPending ? "로그아웃 중..." : "로그아웃"}
    </Button>
  );
}
