export type AnnouncementPost = {
  post_id: number;
  author_id: number;
  author_name: string;
  type: "ANNOUNCEMENT" | "공지사항" | string; // 백엔드 값 확정되면 "ANNOUNCEMENT"로 고정 추천
  title: string;
  content: string;
  created_at: string; // ISO string
  image_urls: string[];
};

export type AnnouncementListResponse = {
  timestamp: number;
  data: AnnouncementPost[];
  error_code: string | null;
  message: string;
};

export type AnnouncementDetailResponse = {
  timestamp: number;
  data: AnnouncementPost | null;
  error_code: string | null;
  message: string;
};
