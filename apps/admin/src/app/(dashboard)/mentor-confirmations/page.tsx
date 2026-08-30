import { auth } from "@/auth";
import { loadSemesterOptions } from "@/lib/semester";
import { fetchStudiesWithFallback } from "../studies/api";
import type { SemesterLabel } from "../studies/types";
import { MentorConfirmationsView } from "./mentor-confirmations-view";

const SEMESTER_LABEL_PATTERN = /^(\d{2})-([12])$/;

function parseSemesterFilter(semester: SemesterLabel) {
  const match = semester.match(SEMESTER_LABEL_PATTERN);
  return match
    ? { year: Number(`20${match[1]}`), semester: Number(match[2]) }
    : {};
}

export default async function MentorConfirmationsPage({
  searchParams,
}: {
  searchParams: Promise<{ semester?: string }>;
}) {
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
  const token = session?.access_token;
  if (!token) return null;

  const studies = await fetchStudiesWithFallback(
    {
      size: 10000,
      page: 0,
      ...parseSemesterFilter(activeSemester),
      studyStatuses: ["STARTED"],
    },
    token,
  );
  return (
    <MentorConfirmationsView
      studies={studies.content}
      currentSemester={currentSemester}
      previousSemester={previousSemester}
      selectedSemester={activeSemester}
    />
  );
}
