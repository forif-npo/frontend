import { auth } from "@/auth";
import { fetchHackathons } from "./api";
import { HackathonView } from "./hackathon-view";

export default async function Page() {
  const session = await auth();
  const accessToken = session?.access_token;

  if (!accessToken) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-bold">로그인이 필요합니다</h2>
        <p className="mb-4 text-gray-600">access token을 찾을 수 없습니다.</p>
      </div>
    );
  }

  try {
    const hackathons = await fetchHackathons(accessToken);
    return <HackathonView initialData={hackathons} />;
  } catch (error) {
    console.error("[Hackathon Page Error]", error);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-bold">데이터를 불러올 수 없습니다</h2>
        <p className="mb-4 text-gray-600">
          {error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다"}
        </p>
      </div>
    );
  }
}
