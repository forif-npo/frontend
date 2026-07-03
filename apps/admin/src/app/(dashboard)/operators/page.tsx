import { auth } from "@/auth";
import { ShieldAlert } from "lucide-react";
import { fetchOperators } from "./api";
import { OperatorsView } from "./operators-view";
import { OperatorSemesterLabel } from "./types";

const PRESIDENT_TEAM = ["회장", "부회장"];

interface PageProps {
  searchParams: Promise<{
    semester?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const activeSemester = (params.semester as OperatorSemesterLabel) || "전체";
  const search = params.search;
  const parsedPage = params.page ? parseInt(params.page, 10) : 0;
  const page = Number.isNaN(parsedPage) ? 0 : Math.max(parsedPage, 0);

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

  // 운영진 명단 관리(수정/삭제)는 회장단 전용 페이지
  const affiliation = session?.user?.affiliation ?? null;
  if (!affiliation || !PRESIDENT_TEAM.includes(affiliation)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <ShieldAlert className="text-muted-foreground h-12 w-12" />
        <h2 className="text-xl font-bold">회장단 전용 페이지입니다</h2>
        <p className="text-muted-foreground text-sm">
          운영진 관리는 회장과 부회장만 사용할 수 있습니다.
        </p>
      </div>
    );
  }

  try {
    const operatorsData = await fetchOperators({
      semester: activeSemester,
      page,
      size: 20,
      search,
      accessToken,
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
      />
    );
  } catch (error) {
    console.error("[Operators Page Error]", error);

    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-bold">
          운영진 데이터를 불러올 수 없습니다
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
