"use client";

import {
  setTokenGetter,
  setOnTokenRefreshed,
  setOnUnauthorized,
} from "@core/utils/api-client";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export function ApiClientProvider({ children }: { children: React.ReactNode }) {
  const { data: session, update } = useSession();

  useEffect(() => {
    setTokenGetter(async () => {
      return session?.access_token || null;
    });

    setOnTokenRefreshed(async (newToken: string) => {
      await update({ access_token: newToken });
    });

    setOnUnauthorized(() => {
      signOut({ callbackUrl: "/signin" });
    });
  }, [session, update]);

  return <>{children}</>;
}
