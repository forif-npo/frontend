/**
 * 로컬 파일 API의 다운로드 응답을 요청한다.
 *
 * `GET /api/v1/files/**?download=true`는 attachment 헤더를 내려준다.
 * 외부 링크와 이미 다운로드 URL인 값은 그대로 반환한다.
 */
export function toFileDownloadUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.pathname.includes("/api/v1/files/")) {
      url.searchParams.set("download", "true");
    }
    return url.toString();
  } catch {
    return value;
  }
}
