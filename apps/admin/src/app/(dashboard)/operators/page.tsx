import { auth } from "@/auth";
import { fetchOperators } from "./api";
import { OperatorsView } from "./operators-view";
import { OperatorSemesterLabel } from "./types";

interface PageProps {
  searchParams: Promise<{
    semester?: string;
    search?: string;
    cursor?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const activeSemester = (params.semester as OperatorSemesterLabel) || "전체";

  const search = params.search?.trim().toLowerCase() ?? "";

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
    const operatorsData = await fetchOperators({
      semester: activeSemester,
      accessToken,
    });

    const filteredData = search
      ? operatorsData.content.filter((operator) =>
          operator.name.toLowerCase().includes(search),
        )
      : operatorsData.content;

    return (
      <OperatorsView
        initialData={filteredData}
        currentSemester={activeSemester}
        hasNext={false}
        nextCursor={null}
        totalElements={filteredData.length}
        initialSearch={search}
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
