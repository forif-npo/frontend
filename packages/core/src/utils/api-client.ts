import ky, { HTTPError } from "ky";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "../auth/token";

const getBaseUrl = (): string => {
  // 서버 사이드에서는 환경 변수 직접 사용
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_SERVER_URL || "https://api.forif.org";
  }
  // 클라이언트에서는 빌드 타임에 주입된 환경 변수 사용
  return process.env.NEXT_PUBLIC_SERVER_URL || "https://api.forif.org";
};

/**
 * ky 기반 API 클라이언트
 *
 * 특징:
 * - credentials: 'include'로 HttpOnly 쿠키 자동 전송/수신
 * - Authorization 헤더에 Access Token 자동 주입 (메모리에서만 조회)
 * - 401 에러 시 로그인 페이지로 리디렉션 (토큰 갱신은 서버에서 처리)
 *
 * 보안:
 * - Access Token은 메모리에만 저장 (XSS 공격 범위 최소화)
 * - Refresh Token은 HttpOnly 쿠키 (JavaScript 접근 불가)
 * - 토큰 갱신은 서버 미들웨어/API Gateway에서 처리
 */
export const apiClient = ky.create({
  prefixUrl: getBaseUrl(),
  timeout: 10000,
  credentials: "include", // HttpOnly 쿠키 자동 전송/수신
  retry: {
    limit: 2,
    methods: ["get"],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      (request) => {
        // Content-Type 헤더 설정
        if (!request.headers.has("Content-Type")) {
          request.headers.set("Content-Type", "application/json");
        }

        // Access Token 자동 주입 (메모리에서만 조회)
        const token = getAccessToken();
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        // 401 Unauthorized 에러 시 로그인 페이지로 리디렉션
        // 토큰 갱신은 서버(미들웨어/API Gateway)에서 처리
        if (response.status === 401) {
          clearAccessToken();
          if (typeof window !== "undefined") {
            window.location.href = "/signin";
          }
        }

        return response;
      },
    ],
  },
});

/**
 * API 에러 핸들러
 * ky의 HTTPError를 파싱하여 사용자 친화적인 에러 메시지 반환
 */
export const handleApiError = async (error: unknown): Promise<string> => {
  if (error instanceof HTTPError) {
    try {
      const errorData = await error.response.json<{
        message?: string;
        errorCode?: string;
      }>();
      return errorData.message || "요청에 실패했습니다.";
    } catch {
      return `요청에 실패했습니다. (${error.response.status})`;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "알 수 없는 오류가 발생했습니다.";
};
