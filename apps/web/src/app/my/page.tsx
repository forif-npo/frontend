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

  // 멘토 여부를 세션 role로 판정하지 않는다. 멘토는 계정 종류가 아니라
  // "이 스터디의 멘토인가"라는 관계라, 부원 로그인으로도 본인이 개설한
  // 스터디가 있으면 관리 기능이 열려야 한다.
  const [profile, studiesData, applicationsData, createdStudies] =
    await Promise.all([
      getUserProfile(token),
      getUserStudies(token).catch(() => []),
      getStudyApplications(token).catch(() => ({ applications: [] })),
      getMyCreatedStudies(token).catch(() => []),
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
