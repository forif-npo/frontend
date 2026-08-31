"use client";

import { useEffect } from "react";
import { PageState } from "../server/PageState";
import { Button } from "./Button";

export interface PageErrorStateProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
  homeHref?: string;
}

/** 일반 라우트 오류 경계에서 재시도·홈 이동 동작을 제공한다. */
export function PageErrorState({
  error,
  reset,
  title = "문제가 발생했어요",
  description = "페이지를 불러오는 중 오류가 발생했습니다.",
  homeHref = "/",
}: PageErrorStateProps) {
  useEffect(() => {
    console.error("Page error caught:", error);
  }, [error]);

  return (
    <PageState
      eyebrow="ERROR"
      title={title}
      description={
        <>
          {description}
          <br />
          잠시 후 다시 시도해 주세요.
          {error.digest && (
            <span className="text-text-subtle mt-3 block text-[13px] leading-[1.5] opacity-60">
              오류 코드: {error.digest}
            </span>
          )}
        </>
      }
      actions={
        <>
          <Button variant="primary" size="medium" onClick={reset}>
            다시 시도
          </Button>
          <Button
            variant="secondary"
            size="medium"
            onClick={() => {
              window.location.href = homeHref;
            }}
          >
            홈으로
          </Button>
        </>
      }
    />
  );
}
