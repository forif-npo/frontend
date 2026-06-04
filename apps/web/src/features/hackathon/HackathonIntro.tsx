import { Body, Heading, Label } from "@ui/components/server";
import { HackathonAbout } from "./HackathonAbout";

/**
 * 진행중인 해커톤이 없을 때 표시하는 안내 화면.
 */
export function HackathonIntro() {
  return (
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      {/* 빈 상태 안내 */}
      <section className="rounded-3 border-border-gray-light bg-surface-white mb-8 flex flex-col items-center gap-3 border p-12 text-center shadow-sm">
        <Label
          size="xs"
          className="text-text-subtle font-bold uppercase tracking-[0.15em]"
        >
          FORIF Hackathon
        </Label>
        <Heading size="s" className="text-text-basic">
          현재 진행중인 해커톤이 없습니다
        </Heading>
        <Body size="s" className="text-text-subtle max-w-md">
          해커톤이 생성되면 모집 마감 타이머와 참가 신청 화면이 표시됩니다.
        </Body>
      </section>

      <HackathonAbout />
    </main>
  );
}
