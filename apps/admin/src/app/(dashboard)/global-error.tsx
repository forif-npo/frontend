"use client";

import { GlobalErrorState } from "@ui/components/client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <GlobalErrorState error={error} reset={reset} />;
}
