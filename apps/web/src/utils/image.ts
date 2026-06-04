/**
 * next/image에 안전하게 넘길 수 있는 src인지 검증한다.
 *
 * 절대 http(s) URL 또는 루트 상대경로(/...)만 허용하고, 그 외(빈 문자열,
 * 스킴/슬래시 없는 상대경로 등)는 null을 반환해 호출부에서 대체 이미지로
 * 폴백하게 한다. (유효하지 않은 값은 next/image가 "Invalid URL"로 throw함)
 */
export function safeImageSrc(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/")) return trimmed;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return trimmed;
    }
  } catch {
    return null;
  }
  return null;
}
