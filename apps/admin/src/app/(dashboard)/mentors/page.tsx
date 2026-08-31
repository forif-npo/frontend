import { auth } from "@/auth";
import { PageState } from "@ui/components/server";
import { getCurrentSemester } from "@/features/semester/api";
import { fetchMentors } from "./api";
import { MentorsView } from "./mentors-view";
import { MentorSemesterLabel } from "./types";
import { parseSortingParams } from "@/lib/list-sorting";

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
    (params.semester as MentorSemesterLabel) ||
    (currentSemester.label as MentorSemesterLabel);
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

  try {
    const mentorsData = await fetchMentors({
      size: 20,
      page,
      search,
      semester: activeSemester,
      accessToken,
      sorting,
    });

    return (
      <MentorsView
        initialData={mentorsData.content}
        currentSemester={activeSemester}
        totalElements={mentorsData.totalElements}
        currentPage={mentorsData.currentPage}
        totalPages={mentorsData.totalPages}
        pageSize={mentorsData.pageSize}
        initialSearch={search ?? ""}
        initialSorting={sorting}
      />
    );
  } catch (error) {
    console.error("[Mentors Page Error]", error);

    return (
      <PageState
        fullHeight
        title="멘토 데이터를 불러올 수 없습니다"
        description={
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다"
        }
      />
    );
  }
}
