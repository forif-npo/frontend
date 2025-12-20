"use client";

import { useEffect, useState } from "react";
import { initMocks } from "./setup";

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      await initMocks();
      setIsReady(true);
    }
    init();
  }, []);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
