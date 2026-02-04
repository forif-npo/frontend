import { getStudiesBySemester, MOCK_CURRENT_SEMESTER } from "./mocks";
import { StudiesView } from "./studies-view";
import { SemesterLabel } from "./types";

export default async function Page({
  searchParams,
}: {
  searchParams: { semester?: string };
}) {
  // Determine default semester (e.g., "25-2")
  const defaultSemester =
    `${MOCK_CURRENT_SEMESTER.year.toString().slice(2)}-${MOCK_CURRENT_SEMESTER.semester}` as SemesterLabel;

  // Use semester from URL query params or default
  const activeSemester =
    (searchParams.semester as SemesterLabel) || defaultSemester;

  // Fetch data on the server
  const studies = await getStudiesBySemester(activeSemester);

  return <StudiesView initialData={studies} currentSemester={activeSemester} />;
}
