import type {
  AnnouncementDetailResponse,
  AnnouncementListResponse,
  AnnouncementPost,
} from "../types/announcement.type";

import { apiClient } from "@core/utils/api-client";

type ApiAnnouncementPost = {
  post_id: number;
  author_id: number;
  author_name: string;
  type: string;
  title: string;
  content: string;
  tag: string;
  created_at: string;
  image_urls?: string[];
};

const toAnnouncementPost = (post: ApiAnnouncementPost): AnnouncementPost => ({
  postId: post.post_id,
  authorId: post.author_id,
  authorName: post.author_name,
  type: post.type,
  title: post.title,
  content: post.content,
  tag: post.tag,
  createdAt: post.created_at,
  imageUrls: post.image_urls ?? [],
});

export const getAnnouncements = async (): Promise<AnnouncementPost[]> => {
  try {
    const response = await apiClient
      .get("api/v1/posts/announcements", {
        searchParams: {
          page: 0,
          size: 100,
          search: "",
        },
      })
      .json<AnnouncementListResponse<ApiAnnouncementPost>>();

    if (response.error_code) {
      throw new Error(response.message || "공지사항 조회에 실패했습니다.");
    }

    return response.data?.content.map(toAnnouncementPost) ?? [];
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? err.message
        : "공지사항 목록을 불러오는 중 오류가 발생했습니다.",
    );
  }
};

export const getAnnouncementById = async (
  id: number,
): Promise<AnnouncementPost | null> => {
  try {
    const response = await apiClient
      .get(`api/v1/posts/announcements/${id}`)
      .json<AnnouncementDetailResponse<ApiAnnouncementPost>>();

    if (response.error_code) {
      throw new Error(response.message || "공지사항 조회에 실패했습니다.");
    }

    return response.data ? toAnnouncementPost(response.data) : null;
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? err.message
        : "공지사항 상세를 불러오는 중 오류가 발생했습니다.",
    );
  }
};
