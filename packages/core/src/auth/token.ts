/**
 * Access Token 관리 유틸리티
 *
 * Access Token은 메모리(전역 변수)에만 저장됩니다.
 * - 메모리: 클라이언트 메모리에만 저장 (XSS 공격 시에도 새로고침 시 초기화)
 * - 새로고침 시: 토큰이 사라지므로 서버에서 Refresh Token으로 재발급
 *
 * Refresh Token은 HttpOnly 쿠키로 서버에서 관리되므로 클라이언트 저장 불필요합니다.
 *
 * 보안 이점:
 * - sessionStorage/localStorage 미사용으로 XSS 공격 범위 최소화
 * - 새로고침 시 토큰 초기화로 공격 지속성 차단
 * - 서버에서 토큰 갱신 로직 처리로 클라이언트 복잡도 감소
 */

// 메모리에 Access Token 저장
let accessToken: string | null = null;

/**
 * Access Token 저장 (메모리에만)
 */
export const setAccessToken = (token: string): void => {
  accessToken = token;
};

/**
 * Access Token 조회 (메모리에서만)
 */
export const getAccessToken = (): string | null => {
  return accessToken;
};

/**
 * Access Token 삭제 (메모리에서만)
 */
export const clearAccessToken = (): void => {
  accessToken = null;
};

/**
 * Access Token 존재 여부 확인
 */
export const hasAccessToken = (): boolean => {
  return !!accessToken;
};
