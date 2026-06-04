import { auth } from "@/auth";
import { fetchStudiesWithFallback, getCurrentSemester } from "../api";
import { SemesterLabel } from "../types";
import { ApprovalView } from "./approval-view";

const SEMESTER_LABEL_PATTERN = /^(\d{2})-([12])$/;
const PAGE_SIZE = 20;

interface PageProps {
  searchParams: Promise<{
    semester?: string;
    year?: string;
    search?: string;
    page?: string;
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
  const parsedPage = params.page ? parseInt(params.page, 10) : 0;
  const page = Number.isNaN(parsedPage) ? 0 : Math.max(parsedPage, 0);
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
        size: PAGE_SIZE,
        page,
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
        totalElements={studiesData.total_elements}
        currentPage={studiesData.current_page ?? page}
        totalPages={
          studiesData.total_pages ??
          Math.ceil(studiesData.total_elements / PAGE_SIZE)
        }
        pageSize={PAGE_SIZE}
        initialSearch={search ?? ""}
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
