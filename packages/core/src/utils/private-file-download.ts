import { apiClient } from "./api-client";

/** 인증 헤더를 포함해 지원서 첨부파일을 내려받는다. */
export async function downloadPrivateFile(
  path: string,
  filename: string,
): Promise<void> {
  const blob = await apiClient.get(path, { cache: "no-store" }).blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
