export type FaqPost = {
  post_id: number;
  author_id: number;
  author_name: string;
  type: "FAQ";
  title: string;
  content: string;
  tag: string;
  created_at: string; // ISO string
};

export type FaqListResponse = {
  timestamp: number;
  data: FaqPost[];
  error_code: string | null;
  message: string;
};
