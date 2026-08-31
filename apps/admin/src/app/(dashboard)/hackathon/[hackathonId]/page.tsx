import { auth } from "@/auth";
import { PageState } from "@ui/components/server";
import {
  fetchAwards,
  fetchCriteria,
  fetchEvaluationSummary,
  fetchHackathon,
  fetchParticipants,
  fetchTeams,
} from "../api";
import { ManagementView } from "./management-view";

interface PageProps {
  params: Promise<{ hackathonId: string }>;
}

export default async function Page({ params }: PageProps) {
  const [{ hackathonId: hackathonIdParam }, session] = await Promise.all([
    params,
    auth(),
  ]);
  const hackathonId = Number(hackathonIdParam);
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

  if (Number.isNaN(hackathonId)) {
    return (
      <PageState
        fullHeight
        title="잘못된 접근입니다"
        description="유효하지 않은 해커톤 ID입니다."
      />
    );
  }

  try {
    // 해커톤 단건만 필수. 나머지 목록은 개별 실패 시 빈 값으로 폴백하여
    // 한 엔드포인트(예: 집계 500)가 페이지 전체를 죽이지 않도록 한다.
    const [hackathon, criteria, summary, teams, awards, participants] =
      await Promise.all([
        fetchHackathon(hackathonId, accessToken),
        fetchCriteria(hackathonId, accessToken).catch((e) => {
          console.error("[fetchCriteria]", e);
          return [];
        }),
        fetchEvaluationSummary(hackathonId, accessToken).catch((e) => {
          console.error("[fetchEvaluationSummary]", e);
          return [];
        }),
        fetchTeams(hackathonId, accessToken).catch((e) => {
          console.error("[fetchTeams]", e);
          return [];
        }),
        fetchAwards(hackathonId, accessToken).catch((e) => {
          console.error("[fetchAwards]", e);
          return [];
        }),
        fetchParticipants(hackathonId, accessToken).catch((e) => {
          console.error("[fetchParticipants]", e);
          return [];
        }),
      ]);

    if (!hackathon) {
      return <PageState fullHeight title="해커톤을 찾을 수 없습니다" />;
    }

    return (
      <ManagementView
        hackathon={hackathon}
        criteria={criteria}
        summary={summary}
        teams={teams}
        awards={awards}
        participants={participants}
      />
    );
  } catch (error) {
    console.error("[Hackathon Management Page Error]", error);
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
