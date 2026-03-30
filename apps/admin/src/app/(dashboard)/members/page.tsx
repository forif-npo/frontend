import { auth } from "@/auth";
import { fetchMembers } from "./api";
import { MembersView } from "./members-view";
import { MemberSemesterLabel } from "./types";

interface PageProps {
  searchParams: Promise<{
    semester?: string;
    search?: string;
    cursor?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const activeSemester = (params.semester as MemberSemesterLabel) || "전체";

  const search = params.search;
  const cursor = params.cursor ? parseInt(params.cursor, 10) : undefined;

  const session = await auth();
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
    const membersData = await fetchMembers({
      size: 20,
      cursor,
      search,
      semester: activeSemester,
      accessToken,
    });

    return (
      <MembersView
        initialData={membersData.content}
        currentSemester={activeSemester}
        hasNext={membersData.hasNext}
        nextCursor={membersData.nextCursor}
        totalElements={membersData.totalElements}
        initialSearch={search ?? ""}
      />
    );
  } catch (error) {
    console.error("[Members Page Error]", error);

    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-bold">
          부원 데이터를 불러올 수 없습니다
        </h2>
        <p className="mb-4 text-gray-600">
          {error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다"}
        </p>
      </div>
    );
  }
}
