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

export type AnnouncementListResponse = {
  timestamp: number;
  data: CursorPage<AnnouncementPost>;
  errorCode: string | null;
  message: string;
};

export type AnnouncementDetailResponse = {
  timestamp: number;
  data: AnnouncementPost | null;
  errorCode: string | null;
  message: string;
};
