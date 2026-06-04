"use client";

import { Button } from "@ui/components/client";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error caught:", error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-20 text-center">
      <p className="text-primary-50 text-[15px] font-bold leading-[1.5]">
        ERROR
      </p>
      <h1 className="text-text-basic text-[28px] font-bold leading-[1.4] md:text-[32px]">
        문제가 발생했어요
      </h1>
      <p className="text-text-subtle max-w-[420px] text-[16px] leading-[1.6]">
        페이지를 불러오는 중 오류가 발생했습니다.
        <br />
        잠시 후 다시 시도해 주세요.
      </p>
      {error.digest && (
        <p className="text-text-subtle text-[13px] leading-[1.5] opacity-60">
          오류 코드: {error.digest}
        </p>
      )}
      <div className="mt-2 flex items-center gap-3">
        <Button variant="primary" size="medium" onClick={() => reset()}>
          다시 시도
        </Button>
        <Button
          variant="secondary"
          size="medium"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          홈으로
        </Button>
      </div>
    </main>
  );
}
