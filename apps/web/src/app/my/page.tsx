import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  getUserProfile,
  getUserStudies,
  getStudyApplications,
} from "@core/my-page/api";
import { MyPageClient } from "./MyPageClient";

export default async function MyPage() {
  const session = await auth();
  if (!session?.accessToken) {
    redirect("/signin");
  }

  const token = session.accessToken;

  const [profile, studiesData, applicationsData] = await Promise.all([
    getUserProfile(token),
    getUserStudies(token).catch(() => []),
    getStudyApplications(token).catch(() => ({ applications: [] })),
  ]);

  return (
    <MyPageClient
      profile={profile}
      studiesData={studiesData}
      applicationsData={applicationsData}
    />
  );
}
