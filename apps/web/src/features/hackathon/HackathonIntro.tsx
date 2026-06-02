import { Body, Heading, Label } from "@ui/components/server";

export function HackathonIntro() {
  const steps = [
    { num: 1, title: "참가 신청", desc: "현재 학기 부원 누구나" },
    { num: 2, title: "팀 구성", desc: "팀장 승인으로 합류" },
    { num: 3, title: "개발 및 제출", desc: "24시간 집중 개발" },
    { num: 4, title: "상호 평가", desc: "참가자 투표로 심사" },
    { num: 5, title: "수상 및 아카이브", desc: "결과물 영구 보존" },
  ];

  return (
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      {/* Hero */}
      <section className="rounded-3 border-primary-20 from-primary-5 to-primary-5 relative mb-8 overflow-hidden border bg-gradient-to-br via-white p-8 sm:p-12">
        <div className="bg-primary-10 absolute right-0 top-0 h-72 w-72 -translate-y-1/2 translate-x-1/3 rounded-full opacity-50 blur-3xl" />
        <div className="relative z-10 grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_300px]">
          <div>
            <Label
              size="xs"
              className="text-text-primary mb-3 block font-bold uppercase tracking-[0.15em]"
            >
              FORIF Hackathon
            </Label>
            <Heading size="l" className="text-text-basic mb-4">
              아이디어를 팀 프로젝트로 완성하는 하루
            </Heading>
            <Body size="m" className="text-text-subtle max-w-lg">
              FORIF 해커톤은 학기 중 쌓은 기술과 관심사를 바탕으로 팀을 만들고,
              짧은 시간 안에 문제 정의부터 결과물 발표까지 경험하는 행사입니다.
            </Body>
          </div>
          <div className="bg-surface-primary-subtler border-primary-20 rounded-3 flex flex-col justify-center gap-3 border p-6">
            <Label size="xs" className="text-text-subtle">
              모집 예정
            </Label>
            <Heading size="xs" className="text-text-primary">
              다음 해커톤을 준비 중입니다
            </Heading>
            <Body size="s" className="text-text-subtle">
              해커톤이 생성되면 모집 마감 타이머와 참가 신청 화면이 표시됩니다.
            </Body>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="rounded-3 border-border-gray-light bg-surface-white border p-8 shadow-sm">
        <Heading size="s" className="text-text-basic mb-6">
          진행 방식
        </Heading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-surface-gray-subtler border-border-gray-light rounded-3 hover:border-border-primary hover:bg-surface-primary-subtler group flex flex-col gap-3 border p-5 transition-all"
            >
              <span className="bg-button-primary-fill text-text-inverse-static text-label-xs inline-flex h-8 w-8 items-center justify-center rounded-full font-extrabold">
                {step.num}
              </span>
              <Label size="s" className="text-text-basic font-bold">
                {step.title}
              </Label>
              <Body size="s" className="text-text-subtle">
                {step.desc}
              </Body>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
