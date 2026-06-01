import type { FaqListResponse, FaqPost } from "../types/faq.type";
import { apiClient } from "@core/utils/api-client";

type ApiFaqPost = {
  post_id: number;
  author_id: number;
  author_name: string;
  type: "FAQ";
  title: string;
  content: string;
  tag: string;
  created_at: string;
};

const toFaqPost = (post: ApiFaqPost): FaqPost => ({
  postId: post.post_id,
  authorId: post.author_id,
  authorName: post.author_name,
  type: post.type,
  title: post.title,
  content: post.content,
  tag: post.tag,
  createdAt: post.created_at,
});

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
      .json<FaqListResponse<ApiFaqPost>>();

    if (json.error_code) {
      throw new Error(json.message || "FAQ 조회에 실패했습니다.");
    }

    return json.data?.content.map(toFaqPost) ?? [];
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(`Failed to fetch faqs: ${message}`);
  }
};
