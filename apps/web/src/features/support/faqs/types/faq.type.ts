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

export type FaqListResponse = {
  timestamp: number;
  data: CursorPage<FaqPost>;
  errorCode: string | null;
  message: string;
};
