/**
 * Access Token 관리 유틸리티
 *
 * Access Token은 메모리(전역 변수) + sessionStorage에 저장됩니다.
 * - 메모리: 빠른 접근을 위한 1차 캐시
 * - sessionStorage: 새로고침 시 토큰 복원용 (탭 종료 시 자동 삭제)
 *
 * Refresh Token은 HttpOnly 쿠키로 서버에서 관리되므로 별도 저장 불필요합니다.
 */

const STORAGE_KEY = "forif_access_token";

// 메모리에 Access Token 저장 (1차 캐시)
let accessToken: string | null = null;

/**
 * Access Token 저장
 * 메모리와 sessionStorage에 동시 저장
 */
export const setAccessToken = (token: string): void => {
  accessToken = token;

  // 브라우저 환경에서만 sessionStorage 사용
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(STORAGE_KEY, token);
    } catch (error) {
      console.error("Failed to save token to sessionStorage:", error);
    }
  }
};

/**
 * Access Token 조회
 * 메모리에 없으면 sessionStorage에서 복원 시도
 */
export const getAccessToken = (): string | null => {
  // 메모리에 있으면 바로 반환
  if (accessToken) return accessToken;

  // 메모리에 없으면 sessionStorage에서 복원 (새로고침 대응)
  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        accessToken = stored;
        return stored;
      }
    } catch (error) {
      console.error("Failed to read token from sessionStorage:", error);
    }
  }

  return null;
};

/**
 * Access Token 삭제
 * 메모리와 sessionStorage 모두에서 삭제
 */
export const clearAccessToken = (): void => {
  accessToken = null;

  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to remove token from sessionStorage:", error);
    }
  }
};

/**
 * Access Token 존재 여부 확인
 */
export const hasAccessToken = (): boolean => {
  return !!getAccessToken();
};
