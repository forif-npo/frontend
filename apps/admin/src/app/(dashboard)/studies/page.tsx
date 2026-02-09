import { getCurrentSemester, getStudiesBySemester } from "./mocks";
import { StudiesView } from "./studies-view";
import { SemesterLabel } from "./types";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ semester?: string }>;
}) {
  const [params, currentSemester] = await Promise.all([
    searchParams,
    getCurrentSemester(),
  ]);

  // Determine default semester (e.g., "25-2")
  const defaultSemester =
    `${currentSemester.year.toString().slice(2)}-${currentSemester.semester}` as SemesterLabel;

  // Use semester from URL query params or default
  const activeSemester = (params.semester as SemesterLabel) || defaultSemester;

  // Fetch data on the server
  const studies = await getStudiesBySemester(activeSemester);

  return <StudiesView initialData={studies} currentSemester={activeSemester} />;
}
