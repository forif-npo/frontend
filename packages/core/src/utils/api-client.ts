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

// 토큰 갱신 중 플래그 (무한 루프 방지)
let isRefreshing = false;

/**
 * ky 기반 API 클라이언트
 *
 * 특징:
 * - credentials: 'include'로 HttpOnly 쿠키 자동 전송/수신
 * - Authorization 헤더에 Access Token 자동 주입 (메모리/sessionStorage에서 조회)
 * - 401 에러 시 Refresh Token으로 자동 갱신 시도 (무한 루프 방지)
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

        // Access Token 자동 주입 (메모리/sessionStorage에서 조회)
        const token = getAccessToken();
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        // 401 Unauthorized 에러 시 토큰 갱신 시도
        if (response.status === 401 && !isRefreshing) {
          // /refresh 엔드포인트 자체가 401이면 로그아웃 (무한 루프 방지)
          if (request.url.includes("/refresh")) {
            clearAccessToken();
            if (typeof window !== "undefined") {
              window.location.href = "/signin";
            }
            return response;
          }

          isRefreshing = true;
          try {
            // Refresh Token으로 새 Access Token 발급
            // Refresh Token은 HttpOnly 쿠키로 자동 전송됨
            const refreshResponse = await ky.post("api/v1/users/refresh", {
              prefixUrl: getBaseUrl(),
              credentials: "include",
            });

            const data = await refreshResponse.json<{
              timestamp: number;
              data: { accessToken: string } | null;
              errorCode: string | null;
              message: string;
            }>();

            // 응답 데이터 검증
            if (!data.data?.accessToken) {
              throw new Error("Access Token을 받지 못했습니다.");
            }

            // 새 Access Token 저장
            setAccessToken(data.data.accessToken);

            // 원래 요청 재시도
            request.headers.set(
              "Authorization",
              `Bearer ${data.data.accessToken}`,
            );
            return ky(request);
          } catch (error) {
            // Refresh 실패 시 로그아웃 처리
            clearAccessToken();
            if (typeof window !== "undefined") {
              window.location.href = "/signin";
            }
            throw error;
          } finally {
            isRefreshing = false;
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
