import { auth } from "@/auth";
import { parseSortingParams } from "@/lib/list-sorting";
import { fetchStudyApplications } from "./api";
import { StudyApplicationsView } from "./study-applications-view";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const session = await auth();

  if (!session?.access_token) {
    return <div className="p-8">로그인이 필요합니다.</div>;
  }

  const parsedPage = params.page ? Number.parseInt(params.page, 10) : 0;
  const page = Number.isNaN(parsedPage) ? 0 : Math.max(parsedPage, 0);
  const sorting = parseSortingParams(params.sort);
  const applications = await fetchStudyApplications({
    accessToken: session.access_token,
    page,
    search: params.search,
    sorting,
  });

  return (
    <StudyApplicationsView
      initialData={applications}
      initialSearch={params.search ?? ""}
      initialSorting={sorting}
    />
  );
}
