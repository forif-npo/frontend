import ky, { HTTPError } from "ky";

const getBaseUrl = (): string => {
  // 서버 사이드에서는 환경 변수 직접 사용
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_SERVER_URL || "https://dev.forif.org";
  }
  // 클라이언트에서는 빌드 타임에 주입된 환경 변수 사용
  return process.env.NEXT_PUBLIC_SERVER_URL || "https://dev.forif.org";
};

// 외부에서 주입할 토큰 getter/setter 및 콜백
let tokenGetter: (() => Promise<string | null>) | null = null;
let tokenRefresher: (() => Promise<string | null>) | null = null;
let onTokenRefreshed: ((newToken: string) => Promise<void>) | null = null;
let onUnauthorized: (() => void) | null = null;

// 토큰 갱신 중복 방지
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * 토큰 getter 설정 (NextAuth 세션에서 토큰 가져오는 함수 주입)
 */
export const setTokenGetter = (getter: () => Promise<string | null>): void => {
  tokenGetter = getter;
};

/**
 * 토큰 갱신 함수 설정 (NextAuth 세션 업데이트 등 외부 인증 저장소와 연동)
 */
export const setTokenRefresher = (
  refresher: () => Promise<string | null>,
): void => {
  tokenRefresher = refresher;
};

/**
 * 토큰 갱신 완료 시 호출될 콜백 설정 (NextAuth 세션 업데이트용)
 */
export const setOnTokenRefreshed = (
  callback: (newToken: string) => Promise<void>,
): void => {
  onTokenRefreshed = callback;
};

/**
 * 401 에러 시 호출될 콜백 설정 (토큰 갱신 실패 시)
 */
export const setOnUnauthorized = (callback: () => void): void => {
  onUnauthorized = callback;
};

/**
 * Access Token 갱신
 * Refresh Token은 HttpOnly 쿠키로 자동 전송됨
 */
async function refreshAccessToken(): Promise<string | null> {
  // 이미 갱신 중이면 기존 Promise 반환 (중복 요청 방지)
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      if (tokenRefresher) {
        return await tokenRefresher();
      }

      const response = await fetch(`${getBaseUrl()}/api/v1/users/refresh`, {
        method: "POST",
        credentials: "include", // HttpOnly 쿠키 자동 전송
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Token refresh failed:", response.status);
        return null;
      }

      const data = await response.json();
      const newToken = data.data?.access_token;

      if (newToken) {
        // NextAuth 세션 업데이트 콜백 호출
        if (onTokenRefreshed) {
          await onTokenRefreshed(newToken);
        }
        return newToken;
      }

      return null;
    } catch (error) {
      console.error("Token refresh error:", error);
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * ky 기반 API 클라이언트
 *
 * 특징:
 * - credentials: 'include'로 HttpOnly 쿠키 자동 전송/수신
 * - Authorization 헤더에 Access Token 자동 주입 (외부에서 주입된 getter 사용)
 * - 401 에러 시 자동으로 토큰 갱신 후 요청 재시도
 *
 * 보안:
 * - Access Token은 NextAuth 세션에서 관리
 * - Refresh Token은 HttpOnly 쿠키 (JavaScript 접근 불가)
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
      async (request) => {
        // Access Token 자동 주입 (외부에서 주입된 getter 사용)
        if (tokenGetter) {
          const token = await tokenGetter();
          if (token) {
            request.headers.set("Authorization", `Bearer ${token}`);
          }
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        // 401 Unauthorized - 토큰 갱신 시도
        if (response.status === 401) {
          // refresh 엔드포인트 자체에서 401이면 갱신 불가
          if (request.url.includes("/api/v1/users/refresh")) {
            if (onUnauthorized) {
              onUnauthorized();
            }
            return response;
          }

          // 토큰 갱신 시도
          const newToken = await refreshAccessToken();

          if (newToken) {
            // 새 토큰으로 원래 요청 재시도
            request.headers.set("Authorization", `Bearer ${newToken}`);
            return ky(request, options);
          }

          // 갱신 실패 시 로그아웃 처리
          if (onUnauthorized) {
            onUnauthorized();
          } else if (typeof window !== "undefined") {
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
        error_code?: string;
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
