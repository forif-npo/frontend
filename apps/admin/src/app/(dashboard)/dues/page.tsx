import { auth } from "@/auth";
import { DuesView } from "./dues-view";
import { fetchDues } from "./api";
import { parseSortingParams } from "@/lib/list-sorting";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
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
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-bold">로그인이 필요합니다</h2>
        <p className="text-muted-foreground">
          access token을 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  try {
    const duesData = await fetchDues({
      page,
      size: 20,
      search: params.search,
      sorting,
      accessToken,
    });

    return (
      <DuesView
        initialData={duesData}
        initialSearch={params.search ?? ""}
        initialSorting={sorting}
      />
    );
  } catch (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-bold">
          회비 관리 정보를 불러올 수 없습니다
        </h2>
        <p className="text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다"}
        </p>
      </div>
    );
  }
}
