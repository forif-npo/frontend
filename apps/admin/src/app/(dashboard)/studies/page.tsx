import { fetchStudiesWithFallback, getCurrentSemester } from "./api";
import { StudiesView } from "./studies-view";
import { SemesterLabel } from "./types";

interface PageProps {
  searchParams: Promise<{
    semester?: string;
    year?: string;
    search?: string;
    cursor?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const [params, currentSemester] = await Promise.all([
    searchParams,
    getCurrentSemester(),
  ]);

  // Determine default semester label (e.g., "25-2")
  const defaultSemester =
    `${currentSemester.year.toString().slice(2)}-${currentSemester.semester}` as SemesterLabel;

  // Use semester from URL query params or default
  const activeSemester = (params.semester as SemesterLabel) || defaultSemester;

  // Parse filters for API
  const year = params.year ? parseInt(params.year) : currentSemester.year;
  const semester = params.semester
    ? parseInt(params.semester.split("-")[1])
    : currentSemester.semester;
  const search = params.search;
  const cursor = params.cursor ? parseInt(params.cursor) : undefined;

  // Fetch studies from real API (with mock fallback)
  try {
    const studiesData = await fetchStudiesWithFallback({
      size: 20,
      cursor,
      year,
      semester,
      search,
    });

    return (
      <StudiesView
        initialData={studiesData.content}
        currentSemester={activeSemester}
        hasNext={studiesData.has_next}
        nextCursor={studiesData.next_cursor}
        totalElements={studiesData.total_elements}
      />
    );
  } catch (error) {
    console.error("[Page Error]", error);

    // Return error state
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-bold">데이터를 불러올 수 없습니다</h2>
        <p className="mb-4 text-gray-600">
          {error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다"}
        </p>
        <p className="text-sm text-gray-500">
          .env 파일에서 USE_MOCK_DATA=true로 설정하여 목 데이터를 사용할 수
          있습니다
        </p>
      </div>
    );
  }
}
