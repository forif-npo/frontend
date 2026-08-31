"use client";

import { useEffect, type CSSProperties } from "react";

export interface GlobalErrorStateProps {
  error: Error & { digest?: string };
  reset: () => void;
  homeHref?: string;
}

const pageStyle: CSSProperties = {
  margin: 0,
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "24px",
  padding: "80px 16px",
  textAlign: "center",
  fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, sans-serif",
  color: "var(--krds-color-gray-90)",
  backgroundColor: "var(--krds-color-gray-5)",
};

/** 루트 레이아웃 오류에서도 스타일 의존성 없이 표시하는 공통 오류 화면이다. */
export function GlobalErrorState({
  error,
  reset,
  homeHref = "/",
}: GlobalErrorStateProps) {
  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <html lang="ko">
      <body style={pageStyle}>
        <p
          style={{
            color: "var(--krds-color-primary-70)",
            fontSize: 15,
            fontWeight: 700,
            margin: 0,
          }}
        >
          ERROR
        </p>
        <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>
          문제가 발생했어요
        </h1>
        <p
          style={{
            color: "var(--krds-color-gray-50)",
            fontSize: 16,
            lineHeight: 1.6,
            maxWidth: 420,
            margin: 0,
          }}
        >
          예기치 못한 오류로 페이지를 표시할 수 없습니다.
          <br />
          잠시 후 다시 시도해 주세요.
        </p>
        {error.digest && (
          <p
            style={{
              color: "var(--krds-color-gray-40)",
              fontSize: 13,
              margin: 0,
            }}
          >
            오류 코드: {error.digest}
          </p>
        )}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            onClick={reset}
            style={{
              cursor: "pointer",
              border: "none",
              borderRadius: 8,
              padding: "12px 24px",
              fontSize: 16,
              fontWeight: 600,
              color: "var(--krds-color-gray-0)",
              backgroundColor: "var(--krds-color-primary-70)",
            }}
          >
            다시 시도
          </button>
          <button
            onClick={() => {
              window.location.href = homeHref;
            }}
            style={{
              cursor: "pointer",
              borderRadius: 8,
              padding: "12px 24px",
              fontSize: 16,
              fontWeight: 600,
              color: "var(--krds-color-gray-90)",
              backgroundColor: "var(--krds-color-gray-0)",
              border: "1px solid var(--krds-color-gray-20)",
            }}
          >
            홈으로
          </button>
        </div>
      </body>
    </html>
  );
}
