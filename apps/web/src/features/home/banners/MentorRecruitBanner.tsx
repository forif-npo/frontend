import { Button } from "@ui/components/client";
import { Body, Display } from "@ui/components/server";
import Link from "next/link";

export function MentorRecruitBanner() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(118deg,#063bb4_0%,#0b50d0_53%,#2b72e7_100%)] px-5 py-4 text-white shadow-[0_18px_50px_rgba(11,80,208,0.22)] md:px-12 md:py-9">
      <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:22px_22px]" />
      <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[#7eb1ff]/20 blur-3xl" />
      <div className="absolute inset-x-5 top-1/2 z-10 flex -translate-y-1/2 items-center md:relative md:inset-auto md:grid md:h-[calc(100%-4.5rem)] md:translate-y-0 md:grid-cols-1 md:gap-4 md:px-0 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex w-full items-start max-md:flex-row max-md:items-center max-md:justify-between max-md:gap-2 md:flex-col">
          <div className="flex flex-col">
            <Body
              size="l"
              className="mb-1 font-semibold leading-none text-white/85 max-md:text-[12px] md:mb-3"
            >
              <span className="md:hidden">2026-2학기 · 8.10 ~ 8.17</span>
              <span className="hidden md:inline">
                8.10 ~ 8.17 · 2026-2학기 멘토 모집
              </span>
            </Body>
            <Display
              size="s"
              className="mb-5 text-white max-md:mb-0 max-md:whitespace-nowrap max-md:text-[22px] max-md:leading-tight xl:whitespace-nowrap xl:text-[40px] xl:leading-tight"
            >
              <span className="md:hidden">스터디 멘토 모집</span>
              <span className="hidden md:inline">
                당신의 열정을 업그레이드하세요
              </span>
            </Display>
            <p className="mt-1 text-[12px] font-medium text-white/80 md:hidden">
              당신의 열정을 업그레이드하세요
            </p>
          </div>
          <Link href="/studies/create">
            <Button
              variant="secondary"
              className="!min-h-[40px] px-4 md:!min-h-[52px] md:px-5 max-md:[&>label]:text-[16px]"
            >
              <span className="md:hidden">개설하기</span>
              <span className="hidden md:inline">스터디 개설하기</span>
            </Button>
          </Link>
        </div>

        <div className="relative hidden h-full min-h-0 xl:block">
          <span className="absolute -right-2 top-1/2 -translate-y-1/2 text-[105px] font-black tracking-[-0.1em] text-white/10">
            MENTOR
          </span>
          <div className="absolute left-10 top-1/2 flex h-[174px] w-[285px] -translate-y-1/2 flex-col justify-between rounded-3xl border border-white/25 bg-white/10 p-6 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-[0.22em] text-white/70">
                FORIF
              </span>
              <span className="rounded-full bg-[#a9caff] px-2 py-1 text-[10px] font-bold text-[#063bb4]">
                RECRUITING
              </span>
            </div>
            <div>
              <p className="text-[42px] font-black leading-none tracking-tight">
                MENTOR
              </p>
              <p className="mt-2 text-sm font-medium text-white/75">
                LEAD · SHARE · GROW
              </p>
            </div>
          </div>
          <div className="absolute bottom-5 left-0 flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-[#a9caff] text-center text-[11px] font-black leading-tight text-[#063bb4] shadow-lg">
            2026
            <br />
            2ND
          </div>
          <div className="absolute right-3 top-5 h-20 w-20 rounded-full border-[15px] border-white/20" />
        </div>
      </div>
    </div>
  );
}
