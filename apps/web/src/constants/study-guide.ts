export interface ProgrammingCard {
  id: number;
  title: string;
  content: string;
}

export const PROGRAMMING_CARDS: ProgrammingCard[] = [
  {
    id: 1,
    title: "프론트엔드 개발",
    content: `-정의-\n사용자가 직접 보고 상호작용하는 웹사이트의 인터페이스를 개발하는 분야\n\n-주요 기술-\nHTML, CSS, JavaScript, React, Vue.js, Angular 등\n\n-특징-\n시각적 디자인과 사용자 경험(UX)에 중점을 둡니다.`,
  },
  {
    id: 2,
    title: "백엔드 개발",
    content: `-정의-\n서버 측에서 데이터를 처리하고 저장하는 로직을 개발하는 분야\n\n-주요 기술-\nPython, Java, Node.js, PHP, SQL 등\n\n-특징-\n데이터베이스 관리, 서버 로직, API 개발 등을 다룹니다.`,
  },
  {
    id: 3,
    title: "모바일 앱 개발",
    content: `-정의-\n스마트폰이나 태블릿용 애플리케이션을 개발하는 분야\n\n-주요 기술-\nAndroid(Java/Kotlin), iOS(Swift), React Native, Flutter 등\n\n-특징-\n모바일 기기의 특성을 고려한 UI/UX 설계가 중요합니다.`,
  },
  {
    id: 4,
    title: "데이터 사이언스 & 머신러닝",
    content: `-정의-\n대량의 데이터를 분석하고 인공지능 모델을 개발하는 분야\n\n-주요 기술-\nPython, R, TensorFlow, PyTorch, Pandas 등\n\n-특징-\n통계, 수학, 알고리즘에 대한 이해가 필요합니다.`,
  },
  {
    id: 5,
    title: "게임 개발",
    content: `-정의-\n컴퓨터, 콘솔, 모바일 등의 플랫폼을 위한 게임을 개발하는 분야\n\n-주요 기술-\nC++, Unity(C#), Unreal Engine 등\n\n-특징-\n그래픽스, 물리 엔진, 게임 로직 등 다양한 요소를 다룹니다.`,
  },
  {
    id: 6,
    title: "시스템 프로그래밍",
    content: `-정의-\n운영 체제, 드라이버, 임베디드 시스템 등을 개발하는 분야\n\n-주요 기술-\nC, C++, Rust, Assembly 등\n\n-특징-\n하드웨어에 가까운 저수준 프로그래밍을 다룹니다.`,
  },
];

export interface RecommendationQuestion {
  id: number;
  title: string;
  text: string;
  options: string[];
}

export const RECOMMENDATION_QUESTIONS: RecommendationQuestion[] = [
  {
    id: 1,
    title: "관심 분야",
    text: "2학기 개강을 맞아 새로운 동아리에 들어가려 해요. 어떤 동아리에 들어갈까요?",
    options: ["FORIF", "포리프"],
  },
  {
    id: 2,
    title: "관심 분야",
    text: "포리프에는 아주 다양한 스터디가 열려 어떤 스터디를 선택해야 할 지 고민이에요. 어떤 분야에 관심이 있나요?",
    options: [
      "나는 눈에 바로바로 보이는게 좋아! (Front-end)",
      "눈에 바로 보이지는 않지만, 서버에서 데이터를 처리하고 저장하는 것이 궁금해! (Back-end)",
      "데이터를 다루어보자!",
      "알고리즘 공부를 해볼까?",
      "요즘 AI가 핫하다며? GPT는 어때?",
      "쉽게 배울수 없는 주제를 배워보고 싶어.",
    ],
  },
  {
    id: 3,
    title: "학습 스타일",
    text: "학습을 할 때 이론 학습과 실습 중 어느 것을 더 중요시하나요?",
    options: ["이론 학습", "실습", "둘 다"],
  },
  {
    id: 4,
    title: "스터디 난이도",
    text: "본인은 프로그래밍에 대해 어느 정도 알고 있다고 생각하며, 어떤 난이도의 스터디를 수강하고 싶나요?",
    options: [
      "완전 처음 해본다! 기초 스터디를 수강하고 싶어요.",
      "어느정도 기초 지식이 있어요.(창컴/공창컴 이수) 기초적인 지식을 응용하는 스터디를 수강하고 싶어요.",
      "저는 2학년 이상의 전공자입니다. 조금은 난이도가 있는 스터디를 원해요.",
      "심도깊은 주제를 다루는 스터디에 참여하고 싶어요.",
    ],
  },
  {
    id: 5,
    title: "스터디 방식",
    text: "포리프의 스터디 진행 방식에는 두가지가 있어요. 강의형과 프로젝트형 스터디 중 어떤 방식을 선호하시나요?",
    options: [
      "대규모로 멘토가 강의식으로 진행하는 [강의형 진행 방식]이 좋아요.",
      "소수의 사람들이 모여 결과물을 만들어내는 [프로젝트형 진행 방식]이 좋아요.",
    ],
  },
  {
    id: 6,
    title: "스터디 결과물",
    text: "스터디를 통해 어떤 부분을 얻어가고 싶나요?",
    options: [
      "프로그래밍의 기초적인 지식을 탄탄히 다지고 싶어요.",
      "응용을 하는 법을 배우고 싶어요.",
      "혼자 공부하기는 어려운 분야를 사람들과 함께 인사이트를 얻으며 공부하고 싶어요.",
    ],
  },
];

export const GUIDE_TABS = [
  { label: "스터디 소개", id: "introduction" },
  { label: "스터디 운영 방식", id: "ongoing" },
  { label: "스터디 진행 과정", id: "procedure" },
  { label: "스터디 이수", id: "completion" },
  { label: "스터디 추천", id: "recommendation" },
] as const;
