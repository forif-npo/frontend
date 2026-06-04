import { auth } from "@/auth";
import { fetchPosts } from "../_posts/api";
import { PostManagementView } from "../_posts/post-management-view";
import type { PostListLabels } from "../_posts/types";

const PAGE_SIZE = 20;

const labels: PostListLabels = {
  pageTitle: "FAQs",
  pageDescription: "FORIF 웹사이트에 노출되는 자주 묻는 질문을 관리합니다.",
  createButton: "FAQ 등록",
  createTitle: "FAQ 등록",
  editTitle: "FAQ 수정",
  deleteTitle: "FAQ 삭제",
  deleteDescription: "선택한 FAQ를 삭제합니다. 삭제 후에는 복구할 수 없습니다.",
  searchPlaceholder: "FAQ 제목을 검색해보세요",
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const [params, session] = await Promise.all([searchParams, auth()]);
  const parsedPage = params.page ? parseInt(params.page, 10) : 0;
  const page = Number.isNaN(parsedPage) ? 0 : Math.max(parsedPage, 0);
  const search = params.search;
  const accessToken = session?.access_token;

  if (!accessToken) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-bold">로그인이 필요합니다</h2>
        <p className="mb-4 text-gray-600">access token을 찾을 수 없습니다.</p>
      </div>
    );
  }

  try {
    const postsData = await fetchPosts({
      kind: "faq",
      page,
      size: PAGE_SIZE,
      search,
      accessToken,
    });

    return (
      <PostManagementView
        kind="faq"
        labels={labels}
        initialData={postsData.content}
        totalElements={postsData.totalElements}
        currentPage={postsData.currentPage}
        totalPages={postsData.totalPages}
        pageSize={postsData.pageSize}
        initialSearch={search ?? ""}
      />
    );
  } catch (error) {
    console.error("[FAQs Page Error]", error);

    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-bold">FAQs를 불러올 수 없습니다</h2>
        <p className="mb-4 text-gray-600">
          {error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다"}
        </p>
      </div>
    );
  }
}
