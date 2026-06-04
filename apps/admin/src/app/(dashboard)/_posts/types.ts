export type PostKind = "announcement" | "faq";

export type AdminPost = {
  postId: number;
  authorId: number | null;
  authorName: string;
  type: string;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  imageUrls: string[];
};

export type PostListResult = {
  content: AdminPost[];
  totalElements: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
};

export type PostFormState = {
  title: string;
  tag: string;
  content: string;
};

export type PostListLabels = {
  pageTitle: string;
  pageDescription: string;
  createButton: string;
  createTitle: string;
  editTitle: string;
  deleteTitle: string;
  deleteDescription: string;
  searchPlaceholder: string;
};
