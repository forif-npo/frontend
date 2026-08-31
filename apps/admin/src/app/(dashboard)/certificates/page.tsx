import { auth } from "@/auth";
import { PageState } from "@ui/components/server";
import { loadSemesterOptions } from "@/lib/semester";
import { fetchStudiesWithFallback } from "../studies/api";
import type { SemesterLabel } from "../studies/types";
import { CertificatesView } from "./certificates-view";

const SEMESTER_LABEL_PATTERN = /^(\d{2})-([12])$/;

interface PageProps {
  searchParams: Promise<{
    semester?: string;
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
  const [params, semesterOptions, session] = await Promise.all([
    searchParams,
    loadSemesterOptions(),
    auth(),
  ]);

  const currentSemester = semesterOptions.current.label as SemesterLabel;
  const previousSemester = semesterOptions.recentLabels.find(
    (semester) => semester !== currentSemester,
  ) as SemesterLabel | undefined;
  const activeSemester =
    params.semester === currentSemester || params.semester === previousSemester
      ? (params.semester as SemesterLabel)
      : currentSemester;
  const semesterFilter = parseSemesterFilter(activeSemester);
  const accessToken = session?.access_token;

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
    const studiesData = await fetchStudiesWithFallback(
      {
        size: 100,
        page: 0,
        ...semesterFilter,
        studyStatuses: ["STARTED"],
      },
      accessToken,
    );

    return (
      <CertificatesView
        studies={studiesData.content}
        currentSemester={currentSemester}
        previousSemester={previousSemester}
        selectedSemester={activeSemester}
      />
    );
  } catch (error) {
    console.error("[Certificates Page Error]", error);

    return (
      <PageState
        fullHeight
        title="데이터를 불러올 수 없습니다"
        description={
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다"
        }
      />
    );
  }
}
