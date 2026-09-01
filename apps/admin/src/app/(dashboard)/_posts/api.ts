import { apiClient } from "@core/utils/api-client";
import type { ApiResponse, OffsetPageResponse } from "@core/types/api";
import type {
  AdminPost,
  PostFormState,
  PostKind,
  PostListResult,
} from "./types";

interface PostItem {
  post_id: number;
  author_id: number | null;
  author_name: string | null;
  type: string;
  title: string;
  content: string;
  tag: string | null;
  created_at: string;
  image_urls?: string[] | null;
}

interface FetchPostsParams {
  kind: PostKind;
  page?: number;
  size: number;
  search?: string;
  accessToken: string;
}

function getEndpoint(kind: PostKind) {
  return kind === "announcement"
    ? "api/v1/posts/announcements"
    : "api/v1/posts/faqs";
}

function mapToPost(item: PostItem): AdminPost {
  return {
    postId: item.post_id,
    authorId: item.author_id,
    authorName: item.author_name ?? "",
    type: item.type,
    title: item.title,
    content: item.content,
    tag: item.tag ?? "",
    createdAt: item.created_at,
    imageUrls: item.image_urls ?? [],
  };
}

export async function fetchPosts({
  kind,
  page = 0,
  size,
  search,
  accessToken,
}: FetchPostsParams): Promise<PostListResult> {
  const searchParams: Record<string, string> = {
    page: String(page),
    size: String(size),
  };

  if (search?.trim()) {
    searchParams.search = search.trim();
  }

  const response = await apiClient
    .get(getEndpoint(kind), {
      searchParams,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .json<ApiResponse<OffsetPageResponse<PostItem>>>();

  if (!response.data || !Array.isArray(response.data.content)) {
    throw new Error("Invalid API response structure");
  }

  const content = response.data.content.map(mapToPost);
  const totalElements = response.data.total_elements ?? content.length;

  return {
    content,
    totalElements,
    currentPage: response.data.current_page ?? page,
    totalPages: response.data.total_pages ?? Math.ceil(totalElements / size),
    pageSize: size,
  };
}

function appendRequestPart(formData: FormData, form: PostFormState) {
  formData.append(
    "request",
    new Blob([JSON.stringify(form)], { type: "application/json" }),
  );
}

export async function createPost(
  kind: PostKind,
  form: PostFormState,
  images: File[],
): Promise<void> {
  if (kind === "faq") {
    await apiClient
      .post(getEndpoint(kind), {
        json: form,
      })
      .json<ApiResponse<null>>();
    return;
  }

  const formData = new FormData();
  appendRequestPart(formData, form);
  images.forEach((image) => formData.append("images", image));

  await apiClient
    .post(getEndpoint(kind), {
      body: formData,
    })
    .json<ApiResponse<null>>();
}

export async function updatePost(
  kind: PostKind,
  postId: number,
  form: PostFormState,
  images: File[],
): Promise<void> {
  if (kind === "faq") {
    await apiClient
      .patch(`${getEndpoint(kind)}/${postId}`, {
        json: form,
      })
      .json<ApiResponse<null>>();
    return;
  }

  const formData = new FormData();
  appendRequestPart(formData, form);
  images.forEach((image) => formData.append("images", image));

  await apiClient
    .patch(`${getEndpoint(kind)}/${postId}`, {
      body: formData,
    })
    .json<ApiResponse<null>>();
}

export async function deletePost(
  kind: PostKind,
  postId: number,
): Promise<void> {
  await apiClient
    .delete(`${getEndpoint(kind)}/${postId}`)
    .json<ApiResponse<null>>();
}
