import type { FaqListResponse, FaqPost } from "../types/faq.type";
import { apiClient } from "@core/utils/api-client";

export const getFaqs = async (): Promise<FaqPost[]> => {
  try {
    const json = await apiClient
      .get("api/v1/posts/faqs", {
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        searchParams: {
          page: 0,
          size: 100,
          search: "",
        },
      })
      .json<FaqListResponse>();

    if (json.errorCode) {
      throw new Error(json.message || "FAQ 조회에 실패했습니다.");
    }

    return json.data?.content ?? [];
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(`Failed to fetch faqs: ${message}`);
  }
};
