import { auth } from "@/auth";
import { PageState } from "@ui/components/server";
import { DuesView } from "./dues-view";
import { fetchDues } from "./api";
import { parseSortingParams } from "@/lib/list-sorting";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    dues_paid?: string;
    google_form_submitted?: string;
    sort?: string | string[];
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const parsedPage = params.page ? Number.parseInt(params.page, 10) : 0;
  const page = Number.isNaN(parsedPage) ? 0 : Math.max(parsedPage, 0);
  const sorting = parseSortingParams(params.sort);
  const session = await auth();
  const accessToken = session?.access_token;

  if (!accessToken) {
    return (
      <PageState
        fullHeight
        title="로그인이 필요합니다"
        description="access token을 찾을 수 없습니다."
      />
    );
  }

  try {
    const duesData = await fetchDues({
      page,
      size: 20,
      search: params.search,
      duesPaid: params.dues_paid === "false" ? false : undefined,
      googleFormSubmitted:
        params.google_form_submitted === "false" ? false : undefined,
      sorting,
      accessToken,
    });

    return (
      <DuesView
        initialData={duesData}
        initialSearch={params.search ?? ""}
        initialDuesPaidFilter={params.dues_paid === "false" ? false : undefined}
        initialGoogleFormSubmittedFilter={
          params.google_form_submitted === "false" ? false : undefined
        }
        initialSorting={sorting}
      />
    );
  } catch (error) {
    return (
      <PageState
        fullHeight
        title="회비 관리 정보를 불러올 수 없습니다"
        description={
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다"
        }
      />
    );
  }
}
