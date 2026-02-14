import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { cookies } from "next/headers";
import ky from "ky";
import type { RefreshTokenResponse } from "@core/types/api";

const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL;

/**
 * Access Token 갱신
 */
async function refreshAccessToken(
  refreshToken: string,
): Promise<string | null> {
  try {
    const response = await ky
      .post(`${BACKEND_URL}/api/v1/users/refresh`, {
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
        timeout: 10000,
      })
      .json<RefreshTokenResponse>();

    return response.data?.access_token ?? null;
  } catch {
    return null;
  }
}

function sanitizeResponseHeaders(original: Headers) {
  const headers = new Headers(original);

  // 스트리밍 프록시에서 브라우저 디코딩 오류 방지
  headers.delete("content-encoding");
  headers.delete("content-length");
  headers.delete("transfer-encoding");

  return headers;
}

/**
 * API 프록시 핸들러
 *
 * 모든 API 요청을 백엔드로 프록시합니다.
 * - Authorization 헤더에 Access Token 자동 주입
 * - 401 에러 시 토큰 갱신 후 재시도
 */
async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const targetPath = path.join("/");
  const targetUrl = `${BACKEND_URL}/${targetPath}${req.nextUrl.search}`;

  // 세션에서 Access Token 가져오기
  const session = await auth();
  const accessToken = session?.accessToken;

  // Refresh Token 가져오기 (쿠키에서)
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // 요청 헤더 구성
  const headers = new Headers(req.headers);
  headers.delete("host"); // 프록시 시 host 헤더 제거

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  // 백엔드로 요청 전달
  let response = await fetch(targetUrl, {
    method: req.method,
    headers,
    body: req.body,
    // @ts-expect-error - duplex is required for streaming body
    duplex: "half",
  });

  // 401 에러 시 토큰 갱신 후 재시도
  if (response.status === 401 && refreshToken) {
    const newAccessToken = await refreshAccessToken(refreshToken);

    if (newAccessToken) {
      // 새 토큰으로 재시도
      headers.set("Authorization", `Bearer ${newAccessToken}`);

      response = await fetch(targetUrl, {
        method: req.method,
        headers,
        body: req.body,
        // @ts-expect-error - duplex is required for streaming body
        duplex: "half",
      });

      // 새 토큰을 응답 헤더에 포함 (클라이언트에서 세션 업데이트용)
      const proxyResponse = new NextResponse(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: sanitizeResponseHeaders(response.headers),
      });
      proxyResponse.headers.set("X-New-Access-Token", newAccessToken);

      return proxyResponse;
    }
  }

  // 응답 반환
  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: sanitizeResponseHeaders(response.headers),
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
