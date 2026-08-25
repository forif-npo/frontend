export const STUDY_TAG_CATEGORIES = [
  "분야",
  "기술스택",
  "언어",
  "형식",
] as const;

export type StudyTagCategory = (typeof STUDY_TAG_CATEGORIES)[number];

export const STUDY_TAG_OPTIONS = [
  { id: 1, name: "database", label: "데이터베이스", category: "분야" },
  { id: 2, name: "basic", label: "프로그래밍 기초", category: "분야" },
  { id: 3, name: "frontend", label: "프론트엔드", category: "분야" },
  { id: 4, name: "backend", label: "백엔드", category: "분야" },
  { id: 5, name: "fullstack", label: "풀스택", category: "분야" },
  { id: 6, name: "app", label: "앱", category: "분야" },
  { id: 7, name: "ai", label: "인공지능", category: "분야" },
  { id: 8, name: "data", label: "데이터", category: "분야" },
  { id: 9, name: "security", label: "보안", category: "분야" },
  { id: 10, name: "game", label: "게임", category: "분야" },
  { id: 11, name: "design", label: "디자인", category: "분야" },
  { id: 12, name: "algorithm", label: "알고리즘", category: "분야" },
  { id: 13, name: "blockchain", label: "블록체인", category: "분야" },
  { id: 14, name: "machine-learning", label: "머신러닝", category: "분야" },
  { id: 15, name: "ai-agent", label: "AI 에이전트", category: "분야" },
  { id: 16, name: "llm", label: "LLM", category: "분야" },
  { id: 36, name: "quant", label: "퀀트", category: "분야" },
  { id: 17, name: "python", label: "Python", category: "언어" },
  { id: 18, name: "java", label: "Java", category: "언어" },
  { id: 19, name: "typescript", label: "TypeScript", category: "언어" },
  { id: 20, name: "c", label: "C", category: "언어" },
  { id: 21, name: "cpp", label: "C++", category: "언어" },
  { id: 22, name: "sql", label: "SQL", category: "언어" },
  { id: 23, name: "react", label: "React", category: "기술스택" },
  { id: 24, name: "nextjs", label: "Next.js", category: "기술스택" },
  { id: 25, name: "vuejs", label: "Vue.js", category: "기술스택" },
  { id: 26, name: "spring-boot", label: "Spring Boot", category: "기술스택" },
  { id: 27, name: "nodejs", label: "Node.js", category: "기술스택" },
  { id: 28, name: "flutter", label: "Flutter", category: "기술스택" },
  { id: 29, name: "git", label: "Git", category: "기술스택" },
  { id: 30, name: "aws", label: "AWS", category: "기술스택" },
  { id: 31, name: "docker", label: "Docker", category: "기술스택" },
  { id: 32, name: "figma", label: "Figma", category: "기술스택" },
  { id: 33, name: "langchain", label: "LangChain", category: "기술스택" },
  { id: 34, name: "lecture", label: "강의형", category: "형식" },
  { id: 35, name: "project", label: "프로젝트형", category: "형식" },
] as const satisfies ReadonlyArray<{
  id: number;
  name: string;
  label: string;
  category: StudyTagCategory;
}>;

export const STUDY_TAG_OPTIONS_BY_CATEGORY = STUDY_TAG_CATEGORIES.map(
  (category) => ({
    category,
    options: STUDY_TAG_OPTIONS.filter((tag) => tag.category === category),
  }),
);

export const STUDY_LOCATION_MAP = {
  동아리방: {
    label: "동아리방",
    placeName: "한양대학교 FORIF 동아리방",
    latitude: 37.5551,
    longitude: 127.0475,
  },
  "IT/BT관": {
    label: "IT/BT관",
    placeName: "한양대학교 서울캠퍼스 IT/BT관",
    latitude: 37.5561,
    longitude: 127.0498,
  },
  FTC: {
    label: "FTC",
    placeName: "한양대학교 서울캠퍼스 FTC",
    latitude: 37.5548,
    longitude: 127.0472,
  },
  신소재공학관: {
    label: "신소재공학관",
    placeName: "한양대학교 서울캠퍼스 신소재공학관",
    latitude: 37.5547,
    longitude: 127.0453,
  },
  제1공학관: {
    label: "제1공학관",
    placeName: "한양대학교 서울캠퍼스 제1공학관",
    latitude: 37.5568,
    longitude: 127.0457,
  },
} as const;

export const STUDY_LOCATION_OPTIONS = [
  { value: "장소 미정", label: "장소 미정" },
  ...Object.entries(STUDY_LOCATION_MAP).map(([value, location]) => ({
    value,
    label: location.label,
  })),
  { value: "온라인", label: "온라인" },
] as const;

export const STUDY_WEEK_DAY_OPTIONS = [
  { value: "1", label: "월요일" },
  { value: "2", label: "화요일" },
  { value: "3", label: "수요일" },
  { value: "4", label: "목요일" },
  { value: "5", label: "금요일" },
  { value: "6", label: "토요일" },
  { value: "0", label: "일요일" },
] as const;

export const STUDY_DIFFICULTY_OPTIONS = [
  { value: "1", label: "쉬움" },
  { value: "2", label: "조금 쉬움" },
  { value: "3", label: "보통" },
  { value: "4", label: "조금 어려움" },
  { value: "5", label: "어려움" },
] as const;
