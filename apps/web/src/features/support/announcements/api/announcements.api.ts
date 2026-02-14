import type {
  AnnouncementDetailResponse,
  AnnouncementListResponse,
  AnnouncementPost,
} from "../types/announcement.type";

import { apiClient } from "@core/utils/api-client";

export const getAnnouncements = async (): Promise<AnnouncementPost[]> => {
  try {
    const response = await apiClient
      .get("api/v1/posts/announcements")
      .json<AnnouncementListResponse>();

    if (response.error_code) {
      throw new Error(response.message || "공지사항 조회에 실패했습니다.");
    }

    return response.data ?? [];
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
      .json<AnnouncementDetailResponse>();

    if (response.error_code) {
      throw new Error(response.message || "공지사항 조회에 실패했습니다.");
    }

    return response.data ?? null;
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? err.message
        : "공지사항 상세를 불러오는 중 오류가 발생했습니다.",
    );
  }
};
