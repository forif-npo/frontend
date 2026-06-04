import type { MainStage } from "../utils";

export type ActiveStage = Extract<
  MainStage,
  "TEAM_BUILDING" | "IN_PROGRESS" | "JUDGING"
>;

export type TeamFormState = {
  name: string;
  topic: string;
  description: string;
  maxMembers: string;
};

export type SubmissionFormState = {
  projectName: string;
  summary: string;
  description: string;
  githubUrl: string;
  deployUrl: string;
  imageUrl: string;
  techStacks: string;
};

export const EMPTY_TEAM_FORM: TeamFormState = {
  name: "",
  topic: "",
  description: "",
  maxMembers: "4",
};

export const EMPTY_SUBMISSION_FORM: SubmissionFormState = {
  projectName: "",
  summary: "",
  description: "",
  githubUrl: "",
  deployUrl: "",
  imageUrl: "",
  techStacks: "",
};

export function statusValue(current: ActiveStage, target: ActiveStage) {
  const order: ActiveStage[] = ["TEAM_BUILDING", "IN_PROGRESS", "JUDGING"];
  const currentIndex = order.indexOf(current);
  const targetIndex = order.indexOf(target);
  if (currentIndex === targetIndex) return "진행 중";
  if (currentIndex > targetIndex) return "완료";
  return "예정";
}

export function phaseLabel(stage: ActiveStage) {
  switch (stage) {
    case "TEAM_BUILDING":
      return "팀 구성";
    case "IN_PROGRESS":
      return "개발/제출";
    case "JUDGING":
      return "심사";
  }
}
