import { auth } from "@/auth";
import { MyPageClient } from "./MyPageClient";
import {
  getUserProfile,
  getUserStudies,
  getStudyApplications,
} from "@core/my-page/api";
import { redirect } from "next/navigation";

export default async function MyPage() {
  const session = await auth();

  // Middleware ensures auth, but double-check
  if (!session?.accessToken) {
    redirect("/signin");
  }

  try {
    // Fetch user profile, studies, and applications in parallel
    const [profile, studiesData, applicationsData] = await Promise.all([
      getUserProfile(session.accessToken),
      getUserStudies(session.accessToken),
      getStudyApplications(session.accessToken),
    ]);

    return (
      <MyPageClient
        profile={profile}
        studiesData={studiesData}
        applicationsData={applicationsData}
      />
    );
  } catch (error) {
    console.error("Failed to load my page data:", error);

    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            데이터를 불러올 수 없습니다
          </h1>
          <p className="text-gray-600">잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    );
  }
}
