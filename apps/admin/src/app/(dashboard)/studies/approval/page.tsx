import { auth } from "@/auth";
import { fetchStudiesWithFallback, getCurrentSemester } from "../api";
import { SemesterLabel } from "../types";
import { ApprovalView } from "./approval-view";

const SEMESTER_LABEL_PATTERN = /^(\d{2})-([12])$/;

interface PageProps {
  searchParams: Promise<{
    semester?: string;
    year?: string;
    search?: string;
    cursor?: string;
  }>;
}

function parseSemesterFilter(semester: SemesterLabel) {
  const match = semester.match(SEMESTER_LABEL_PATTERN);

  if (!match) {
    return {};
  }

  return {
    year: Number(`20${match[1]}`),
    semester: Number(match[2]),
  };
}

export default async function Page({ searchParams }: PageProps) {
  const [params, currentSemester, session] = await Promise.all([
    searchParams,
    getCurrentSemester(),
    auth(),
  ]);

  const defaultSemester =
    `${currentSemester.year.toString().slice(2)}-${currentSemester.semester}` as SemesterLabel;
  const activeSemester = (params.semester as SemesterLabel) || defaultSemester;
  const semesterFilter = parseSemesterFilter(activeSemester);
  const search = params.search;
  const cursor = params.cursor ? parseInt(params.cursor) : undefined;
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
    const studiesData = await fetchStudiesWithFallback(
      {
        size: 20,
        cursor,
        ...semesterFilter,
        search,
        studyStatuses: ["PENDING", "RE_APPLIED"],
      },
      accessToken,
    );

    return (
      <ApprovalView
        initialData={studiesData.content}
        currentSemester={activeSemester}
        hasNext={studiesData.has_next}
        nextCursor={studiesData.next_cursor}
        totalElements={studiesData.total_elements}
      />
    );
  } catch (error) {
    console.error("[Approval Page Error]", error);

    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-bold">데이터를 불러올 수 없습니다</h2>
        <p className="mb-4 text-gray-600">
          {error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다"}
        </p>
      </div>
    );
  }
}
