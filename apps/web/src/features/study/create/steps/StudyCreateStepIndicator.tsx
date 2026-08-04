"use client";

import { StudyStepIndicator } from "../../components/StudyStepIndicator";

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
  return <StudyStepIndicator steps={STEPS} />;
}
