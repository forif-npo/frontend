export function getSafeCallbackUrl(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  try {
    const parsed = new URL(value, "https://forif.local");
    if (parsed.origin !== "https://forif.local") return "/";
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return "/";
  }
}
