"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          padding: "80px 16px",
          textAlign: "center",
          fontFamily:
            "Pretendard, -apple-system, BlinkMacSystemFont, sans-serif",
          color: "#2d2d2d",
          backgroundColor: "#f6f8fb",
        }}
      >
        <p
          style={{ color: "#16408d", fontSize: 15, fontWeight: 700, margin: 0 }}
        >
          ERROR
        </p>
        <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>
          문제가 발생했어요
        </h1>
        <p
          style={{
            color: "#6b7280",
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
          <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>
            오류 코드: {error.digest}
          </p>
        )}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            onClick={() => reset()}
            style={{
              cursor: "pointer",
              border: "none",
              borderRadius: 8,
              padding: "12px 24px",
              fontSize: 16,
              fontWeight: 600,
              color: "#ffffff",
              backgroundColor: "#16408d",
            }}
          >
            다시 시도
          </button>
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            style={{
              cursor: "pointer",
              borderRadius: 8,
              padding: "12px 24px",
              fontSize: 16,
              fontWeight: 600,
              color: "#2d2d2d",
              backgroundColor: "#ffffff",
              border: "1px solid #d1d5db",
            }}
          >
            홈으로
          </button>
        </div>
      </body>
    </html>
  );
}
