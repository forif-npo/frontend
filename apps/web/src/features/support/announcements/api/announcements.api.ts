import type {
  AnnouncementDetailResponse,
  AnnouncementListResponse,
  AnnouncementPost,
} from "../types/announcement.type";

const API_BASE = "/api/proxy/api/v1/posts/announcements";

export const getAnnouncements = async (): Promise<AnnouncementPost[]> => {
  const res = await fetch(API_BASE, { method: "GET", cache: "no-store" });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(
      `Failed to fetch announcements: ${res.status} ${res.statusText} - ${text}`,
    );
  }

  const json = JSON.parse(text) as AnnouncementListResponse;
  if (json.error_code) {
    throw new Error(json.message || "공지사항 조회에 실패했습니다.");
  }

  return json.data ?? [];
};

export const getAnnouncementById = async (
  id: number,
): Promise<AnnouncementPost | null> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(
      `Failed to fetch announcement: ${res.status} ${res.statusText} - ${text}`,
    );
  }

  const json = JSON.parse(text) as AnnouncementDetailResponse;
  if (json.error_code) {
    throw new Error(json.message || "공지사항 조회에 실패했습니다.");
  }

  return json.data ?? null;
};
