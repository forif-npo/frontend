"use client";

import { useEffect, type CSSProperties } from "react";

export interface GlobalErrorStateProps {
  error: Error & { digest?: string };
  reset: () => void;
  homeHref?: string;
}

/** 전역 CSS가 로드되지 않은 오류 경계에서도 디자인 토큰의 기본값을 보장한다. */
const globalErrorColors = {
  gray0: "var(--krds-color-gray-0, #ffffff)",
  gray20: "var(--krds-color-gray-20, #cdd1d5)",
  gray40: "var(--krds-color-gray-40, #8a949e)",
  gray50: "var(--krds-color-gray-50, #6d7882)",
  gray90: "var(--krds-color-gray-90, #1e2124)",
  primary70: "var(--krds-color-primary-70, #083891)",
  surfaceGraySubtler: "var(--krds-color-gray-5, #f4f5f6)",
} as const;

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
  color: globalErrorColors.gray90,
  backgroundColor: globalErrorColors.surfaceGraySubtler,
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
            color: globalErrorColors.primary70,
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
            color: globalErrorColors.gray50,
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
              color: globalErrorColors.gray40,
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
              color: globalErrorColors.gray0,
              backgroundColor: globalErrorColors.primary70,
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
              color: globalErrorColors.gray90,
              backgroundColor: globalErrorColors.gray0,
              border: `1px solid ${globalErrorColors.gray20}`,
            }}
          >
            홈으로
          </button>
        </div>
      </body>
    </html>
  );
}
