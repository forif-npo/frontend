"use client";

const STEPS = [
  {
    number: 1,
    title: "신청 정보 확인",
    description:
      "학번, 이름, 학과, 휴대폰번호를 확인해주세요. 멘토는 최대 2명까지 가능합니다.",
  },
  {
    number: 2,
    title: "스터디 개요 및 일정",
    description:
      "스터디 이름부터 자세한 소개글까지, 전반적인 사항을 입력합니다.",
  },
  {
    number: 3,
    title: "주차별 계획",
    description: "주차별 스터디 커리큘럼을 작성합니다.",
  },
  {
    number: 4,
    title: "난이도 및 기타사항",
    description: "난이도, 면접여부, 참고자료를 입력할 수 있습니다.",
  },
  {
    number: 5,
    title: "입력 정보 확인",
    description: "지금까지 작성한 정보를 다시 한 번 확인해주세요.",
  },
] as const;

export function StudyCreateStepIndicator() {
  return (
    <div className="flex w-full flex-col rounded-[12px] border border-[#b1b8be] bg-white p-8">
      {STEPS.map((step, index) => (
        <div key={step.number}>
          {/* Step Item */}
          <div className="flex gap-4">
            {/* Number + Divider */}
            <div className="flex shrink-0 flex-col items-start px-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#063a74]">
                <span className="text-[15px] font-bold leading-[1.5] text-white">
                  {step.number}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className="flex flex-1 items-center justify-center self-stretch">
                  <div className="h-full w-px bg-[#d6e0eb]" />
                </div>
              )}
            </div>

            {/* Text */}
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-[17px] font-bold leading-[1.5] text-[#052b57]">
                {step.title}
              </p>
              <p className="text-text-subtle text-[17px] leading-[1.5]">
                {step.description}
              </p>
            </div>
          </div>

          {/* Divider between steps */}
          {index < STEPS.length - 1 && (
            <div className="flex h-8 w-10 items-center justify-center px-2">
              <div className="h-full w-px bg-[#d6e0eb]" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
