import type { StudyEditForm } from "./types";

export const EMPTY_STUDY_EDIT_FORM: StudyEditForm = {
  study_name: "",
  one_liner: "",
  explanation: "",
  goal: "",
  start_time: "",
  end_time: "",
  week_day: "",
  location: "",
  location_detail: "",
  difficulty: "",
  capacity: "",
  tags: [],
};

export const WEEK_DAY_OPTIONS = [
  { value: "0", label: "일요일" },
  { value: "1", label: "월요일" },
  { value: "2", label: "화요일" },
  { value: "3", label: "수요일" },
  { value: "4", label: "목요일" },
  { value: "5", label: "금요일" },
  { value: "6", label: "토요일" },
];

export const DIFFICULTY_OPTIONS = [
  { value: "1", label: "쉬움" },
  { value: "2", label: "조금 쉬움" },
  { value: "3", label: "보통" },
  { value: "4", label: "조금 어려움" },
  { value: "5", label: "어려움" },
];

export const DIFFICULTY_TO_LEVEL: Record<string, string> = {
  EASY: "1",
  SEMI_EASY: "2",
  NORMAL: "3",
  SEMI_HARD: "4",
  HARD: "5",
};

export const STUDY_TAG_OPTIONS = [
  { id: 1, name: "database", label: "데이터베이스" },
  { id: 2, name: "basic", label: "프로그래밍 기초" },
  { id: 3, name: "frontend", label: "프론트엔드" },
  { id: 4, name: "backend", label: "백엔드" },
  { id: 5, name: "fullstack", label: "풀스택" },
  { id: 6, name: "app", label: "앱" },
  { id: 7, name: "ai", label: "인공지능" },
  { id: 8, name: "data", label: "데이터" },
  { id: 9, name: "security", label: "보안" },
  { id: 10, name: "game", label: "게임" },
  { id: 11, name: "design", label: "디자인" },
  { id: 12, name: "algorithm", label: "알고리즘" },
  { id: 13, name: "blockchain", label: "블록체인" },
  { id: 14, name: "machine-learning", label: "머신러닝" },
  { id: 15, name: "ai-agent", label: "AI 에이전트" },
  { id: 16, name: "llm", label: "LLM" },
  { id: 36, name: "quant", label: "퀀트" },
  { id: 17, name: "python", label: "Python" },
  { id: 18, name: "java", label: "Java" },
  { id: 19, name: "typescript", label: "TypeScript" },
  { id: 20, name: "c", label: "C" },
  { id: 21, name: "cpp", label: "C++" },
  { id: 22, name: "sql", label: "SQL" },
  { id: 23, name: "react", label: "React" },
  { id: 24, name: "nextjs", label: "Next.js" },
  { id: 25, name: "vuejs", label: "Vue.js" },
  { id: 26, name: "spring-boot", label: "Spring Boot" },
  { id: 27, name: "nodejs", label: "Node.js" },
  { id: 28, name: "flutter", label: "Flutter" },
  { id: 29, name: "git", label: "Git" },
  { id: 30, name: "aws", label: "AWS" },
  { id: 31, name: "docker", label: "Docker" },
  { id: 32, name: "figma", label: "Figma" },
  { id: 33, name: "langchain", label: "LangChain" },
  { id: 34, name: "lecture", label: "강의형" },
  { id: 35, name: "project", label: "프로젝트형" },
] as const;

const LEGACY_STUDY_TAGS: Record<string, (typeof STUDY_TAG_OPTIONS)[number]> = {
  개인개발: STUDY_TAG_OPTIONS[4],
  모바일: STUDY_TAG_OPTIONS[5],
  "프로그래밍 언어 기초": STUDY_TAG_OPTIONS[1],
};

export const LEGACY_STUDY_TAG_IDS: Record<string, number> = Object.fromEntries(
  Object.entries(LEGACY_STUDY_TAGS).map(([label, tag]) => [label, tag.id]),
);

function findStudyTag(value: string) {
  return (
    STUDY_TAG_OPTIONS.find(
      (option) => option.name === value || option.label === value,
    ) ?? LEGACY_STUDY_TAGS[value]
  );
}

/** 웹 스터디 화면과 같은 한글 태그 명칭을 반환한다. */
export function getStudyTagLabel(value: string): string {
  return findStudyTag(value)?.label ?? value;
}
