export type AnnouncementPost = {
  postId: number;
  authorId: number;
  authorName: string;
  type: "ANNOUNCEMENT" | string;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  imageUrls: string[];
};

export type CursorPage<T> = {
  content: T[];
  nextCursor: number | null;
  hasNext: boolean;
  totalElements: number;
};

export type AnnouncementListResponse<T = AnnouncementPost> = {
  timestamp: number;
  data: CursorPage<T>;
  error_code: string | null;
  message: string;
};

export type AnnouncementDetailResponse<T = AnnouncementPost> = {
  timestamp: number;
  data: T | null;
  error_code: string | null;
  message: string;
};
