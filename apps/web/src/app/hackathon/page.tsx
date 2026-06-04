"use client";

import {
  EventFacts,
  HackathonAbout,
  HackathonIntro,
  TimerHero,
  getMainStage,
  type MainStage,
} from "@/features/hackathon";
import { useCurrentHackathon } from "@/hooks/hackathon";
import { HackathonPageSkeleton } from "@/components/skeleton/HackathonSkeleton";
import { Body, Heading, Link } from "@ui/components/server";
import { Button } from "@ui/components/client";

function detailCtaLabel(stage: MainStage): string {
  switch (stage) {
    case "RECRUITING":
      return "참가 신청하러 가기";
    case "TEAM_BUILDING":
      return "팀 구성하러 가기";
    case "IN_PROGRESS":
      return "진행 상황 보러 가기";
    case "JUDGING":
      return "심사 참여하러 가기";
    case "ENDED":
      return "결과 보러 가기";
    default:
      return "자세히 보러 가기";
  }
}

export default function HackathonPage() {
  const { hackathon, loading, error } = useCurrentHackathon();
  const stage = getMainStage(hackathon);

  if (loading) {
    return <HackathonPageSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Body size="m" className="text-text-danger">
          {error}
        </Body>
      </div>
    );
  }

  if (!hackathon || stage === "BEFORE_CREATED") {
    return <HackathonIntro />;
  }

  return (
    <>
      <TimerHero hackathon={hackathon} stage={stage} />
      <main className="max-w-main mx-auto flex w-full flex-col gap-8 px-4 py-10 lg:px-0">
        <EventFacts hackathon={hackathon} />

        <HackathonAbout />

        {/* 상세 페이지(지원·진행상황·심사)로 이동 */}
        <section className="rounded-3 border-primary-20 from-primary-5 to-primary-5 flex flex-col items-center gap-4 border bg-gradient-to-br via-white p-8 text-center">
          <Heading size="s" className="text-text-basic">
            해커톤에 참여해보세요
          </Heading>
          <Body size="s" className="text-text-subtle max-w-md">
            참가 신청, 팀 구성, 결과물 제출과 심사는 상세 페이지에서 진행됩니다.
          </Body>
          <Link href="/hackathon/detail">
            <Button variant="primary" size="large">
              {detailCtaLabel(stage)}
            </Button>
          </Link>
        </section>
      </main>
    </>
  );
}
