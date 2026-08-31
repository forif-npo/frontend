import { auth } from "@/auth";
import { PageState } from "@ui/components/server";
import { getCurrentSemester } from "@/features/semester/api";
import { fetchMembers } from "./api";
import { MembersView } from "./members-view";
import { MemberSemesterLabel } from "./types";
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
    (params.semester as MemberSemesterLabel) ||
    (currentSemester.label as MemberSemesterLabel);
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
    const membersData = await fetchMembers({
      size: 20,
      page,
      search,
      semester: activeSemester,
      accessToken,
      sorting,
    });

    return (
      <MembersView
        initialData={membersData.content}
        currentSemester={activeSemester}
        totalElements={membersData.totalElements}
        currentPage={membersData.currentPage}
        totalPages={membersData.totalPages}
        pageSize={membersData.pageSize}
        initialSearch={search ?? ""}
        initialSorting={sorting}
        activeSemesterLabel={currentSemester.label}
      />
    );
  } catch (error) {
    console.error("[Members Page Error]", error);

    return (
      <PageState
        fullHeight
        title="부원 데이터를 불러올 수 없습니다"
        description={
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다"
        }
      />
    );
  }
}
