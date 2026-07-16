import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  getUserProfile,
  getUserStudies,
  getStudyApplications,
} from "@core/my-page/api";
import { getMyCreatedStudies } from "@core/study-manage/api";
import { MyPageClient } from "./MyPageClient";

export default async function MyPage() {
  const session = await auth();
  if (!session?.accessToken) {
    redirect("/signin");
  }

  const token = session.accessToken;
  // 스터디 관리는 멘토 계정(웹 멘토 탭 로그인)에서만 노출한다.
  // 구글(부원) 세션은 같은 사람이 멘토여도 관리 기능을 쓸 수 없다.
  const isMentorSession = session.role === "MENTOR";

  const [profile, studiesData, applicationsData, createdStudies] =
    await Promise.all([
      getUserProfile(token),
      getUserStudies(token).catch(() => []),
      getStudyApplications(token).catch(() => ({ applications: [] })),
      isMentorSession
        ? getMyCreatedStudies(token).catch(() => [])
        : Promise.resolve([]),
    ]);

  return (
    <MyPageClient
      profile={profile}
      studiesData={studiesData}
      applicationsData={applicationsData}
      createdStudies={createdStudies}
    />
  );
}
