import { auth } from "@/auth";
import { fetchStudiesWithFallback, getCurrentSemester } from "../studies/api";
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
  const [params, currentSemester, session] = await Promise.all([
    searchParams,
    getCurrentSemester(),
    auth(),
  ]);
  const defaultSemester =
    `${currentSemester.year.toString().slice(2)}-${currentSemester.semester}` as SemesterLabel;
  const activeSemester = (params.semester as SemesterLabel) || defaultSemester;
  const token = session?.access_token;
  if (!token) return null;

  const studies = await fetchStudiesWithFallback(
    {
      size: 100,
      page: 0,
      ...parseSemesterFilter(activeSemester),
      studyStatuses: ["APPROVED"],
    },
    token,
  );
  return (
    <MentorConfirmationsView
      studies={studies.content}
      currentSemester={activeSemester}
    />
  );
}
