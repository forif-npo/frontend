import type { FaqListResponse, FaqPost } from "../types/faq.type";

export const getFaqs = async (): Promise<FaqPost[]> => {
  const res = await fetch("/api/proxy/api/v1/posts/faqs", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(
      `Failed to fetch faqs: ${res.status} ${res.statusText} - ${text}`,
    );
  }

  let json: FaqListResponse;
  try {
    json = JSON.parse(text) as FaqListResponse;
  } catch {
    throw new Error(
      `Failed to fetch faqs: ${res.status} ${res.statusText} - ${text}`,
    );
  }

  if (json.error_code) {
    throw new Error(json.message || "FAQ 조회에 실패했습니다.");
  }

  return json.data ?? [];
};
