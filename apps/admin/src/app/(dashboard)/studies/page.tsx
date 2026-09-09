import { auth } from "@/auth";
import { PageState } from "@ui/components/server";
import {
  fetchStudiesWithFallback,
  getCurrentSemester,
  parseStudySemesterFilter,
  type SemesterLabel,
} from "@/features/studies";
import { StudiesView } from "@/features/studies/studies-view";
import { parseSortingParams } from "@/lib/list-sorting";

const PAGE_SIZE = 20;

interface PageProps {
  searchParams: Promise<{
    semester?: string;
    year?: string;
    search?: string;
    page?: string;
    sort?: string | string[];
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const [params, currentSemester, session] = await Promise.all([
    searchParams,
    getCurrentSemester(),
    auth(),
  ]);

  // Determine default semester label (e.g., "26-1")
  const defaultSemester =
    `${currentSemester.year.toString().slice(2)}-${currentSemester.semester}` as SemesterLabel;

  // Use semester from URL query params or default
  const activeSemester = (params.semester as SemesterLabel) || defaultSemester;

  // Parse filters for API
  const semesterFilter = parseStudySemesterFilter(activeSemester);
  const search = params.search;
  const parsedPage = params.page ? parseInt(params.page, 10) : 0;
  const page = Number.isNaN(parsedPage) ? 0 : Math.max(parsedPage, 0);
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

  // Fetch studies from real API (with mock fallback)
  try {
    const studiesData = await fetchStudiesWithFallback(
      {
        size: PAGE_SIZE,
        page,
        ...semesterFilter,
        search,
        studyStatuses: ["APPROVED", "STARTED"],
        sorting,
      },
      accessToken,
    );

    return (
      <StudiesView
        initialData={studiesData.content}
        currentSemester={activeSemester}
        totalElements={studiesData.total_elements}
        currentPage={studiesData.current_page ?? page}
        totalPages={
          studiesData.total_pages ??
          Math.ceil(studiesData.total_elements / PAGE_SIZE)
        }
        pageSize={PAGE_SIZE}
        initialSearch={search ?? ""}
        initialSorting={sorting}
      />
    );
  } catch (error) {
    console.error("[Page Error]", error);

    return (
      <PageState
        fullHeight
        title="데이터를 불러올 수 없습니다"
        description={
          <>
            <p>
              {error instanceof Error
                ? error.message
                : "알 수 없는 오류가 발생했습니다"}
            </p>
          </>
        }
      />
    );
  }
}
