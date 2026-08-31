import { auth } from "@/auth";
import { PageState } from "@ui/components/server";
import { fetchHackathons } from "./api";
import { HackathonView } from "./hackathon-view";

export default async function Page() {
  const session = await auth();
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
    const hackathons = await fetchHackathons(accessToken);
    return <HackathonView initialData={hackathons} />;
  } catch (error) {
    console.error("[Hackathon Page Error]", error);
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
