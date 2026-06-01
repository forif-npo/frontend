export type FaqPost = {
  postId: number;
  authorId: number;
  authorName: string;
  type: "FAQ";
  title: string;
  content: string;
  tag: string;
  createdAt: string;
};

export type CursorPage<T> = {
  content: T[];
  nextCursor: number | null;
  hasNext: boolean;
  totalElements: number;
};

export type FaqListResponse<T = FaqPost> = {
  timestamp: number;
  data: CursorPage<T>;
  error_code: string | null;
  message: string;
};
