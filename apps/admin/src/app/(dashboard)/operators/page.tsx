import { auth } from "@/auth";
import { PageState } from "@ui/components/server";
import { getCurrentSemester } from "@/features/semester/api";
import { fetchOperators } from "./api";
import { OperatorsView } from "./operators-view";
import { OperatorSemesterLabel } from "./types";
import { parseSortingParams } from "@/lib/list-sorting";

const PRESIDENT_TEAM = ["회장", "부회장"];

interface PageProps {
  searchParams: Promise<{
    semester?: string;
    search?: string;
    page?: string;
    sort?: string | string[];
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search;
  const parsedPage = params.page ? parseInt(params.page, 10) : 0;
  const page = Number.isNaN(parsedPage) ? 0 : Math.max(parsedPage, 0);

  const [session, currentSemester] = await Promise.all([
    auth(),
    getCurrentSemester(),
  ]);
  const activeSemester =
    (params.semester as OperatorSemesterLabel) ||
    (currentSemester.label as OperatorSemesterLabel);
  const accessToken = session?.access_token;
  const sorting = parseSortingParams(params.sort);

  if (!accessToken) {
    return (
      <PageState
        fullHeight
        title="로그인이 필요합니다"
        description="access token을 찾을 수 없습니다."
      />
    );
  }

  const affiliation = session?.user?.affiliation ?? null;
  const currentUserId = Number(session?.user?.id ?? 0);
  const canManageOperators = Boolean(
    affiliation && PRESIDENT_TEAM.includes(affiliation),
  );

  try {
    const operatorsData = await fetchOperators({
      semester: activeSemester,
      page,
      size: 20,
      search,
      accessToken,
      sorting,
    });

    return (
      <OperatorsView
        initialData={operatorsData.content}
        currentSemester={activeSemester}
        totalElements={operatorsData.totalElements}
        currentPage={operatorsData.currentPage}
        totalPages={operatorsData.totalPages}
        pageSize={operatorsData.pageSize}
        initialSearch={search ?? ""}
        initialSorting={sorting}
        canManageOperators={canManageOperators}
        currentUserId={currentUserId}
      />
    );
  } catch (error) {
    console.error("[Operators Page Error]", error);

    return (
      <PageState
        fullHeight
        title="운영진 데이터를 불러올 수 없습니다"
        description={
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다"
        }
      />
    );
  }
}
