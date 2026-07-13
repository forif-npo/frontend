export interface ProgrammingCard {
  id: number;
  title: string;
  content: string;
}

export const PROGRAMMING_CARDS: ProgrammingCard[] = [
  {
    id: 1,
    title: "프론트엔드 개발",
    content: `-정의-\n웹사이트나 웹 앱에서 사용자가 직접 보고 클릭하고 입력하는 화면(인터페이스)을 만드는 분야예요. 버튼 하나, 애니메이션 하나까지 "사용자가 어떻게 느낄까"를 고민하며 만듭니다.\n\n-주요 기술-\nHTML/CSS로 화면의 뼈대와 디자인을 잡고, JavaScript(및 TypeScript)로 동작을 입혀요. 규모가 커지면 React, Vue.js, Angular 같은 프레임워크로 화면을 효율적으로 관리합니다.\n\n-이런 걸 만들어요-\n쇼핑몰 상품 페이지, 인스타그램 피드, 대시보드, 포리프 홈페이지처럼 눈에 보이는 거의 모든 웹 화면이 프론트엔드의 결과물이에요.\n\n-이런 분께 추천-\n• 결과물이 눈에 바로바로 보이는 게 좋은 분\n• 디자인과 사용자 경험(UX)에 관심이 많은 분\n• 작은 변화로 화면이 달라지는 즉각적인 피드백을 즐기는 분`,
  },
  {
    id: 2,
    title: "백엔드 개발",
    content: `-정의-\n눈에 보이지 않는 서버 쪽에서 데이터를 처리하고 저장하며, 화면(프론트엔드)이 필요로 하는 정보를 만들어 보내주는 분야예요. 서비스의 "두뇌와 창고" 역할을 합니다.\n\n-주요 기술-\nJava(Spring), Python(Django/FastAPI), Node.js 같은 언어·프레임워크로 로직을 짜고, MySQL·PostgreSQL 같은 데이터베이스(SQL)로 데이터를 다뤄요. API를 설계해 프론트엔드와 데이터를 주고받습니다.\n\n-이런 걸 만들어요-\n로그인/회원가입 처리, 결제 시스템, 게시글 저장과 조회, 추천 알고리즘 서버 등 서비스의 핵심 동작을 담당해요.\n\n-이런 분께 추천-\n• 데이터가 어떻게 흐르고 저장되는지가 궁금한 분\n• 논리적으로 구조를 설계하는 걸 좋아하는 분\n• 안정적이고 빠른 시스템을 만드는 데 보람을 느끼는 분`,
  },
  {
    id: 3,
    title: "모바일 앱 개발",
    content: `-정의-\n스마트폰·태블릿에서 동작하는 애플리케이션을 만드는 분야예요. 손안의 작은 화면에서 카메라, 알림, 위치 같은 기기 기능을 활용해 서비스를 만듭니다.\n\n-주요 기술-\nAndroid는 Kotlin/Java, iOS는 Swift를 주로 써요. React Native·Flutter를 쓰면 하나의 코드로 안드로이드와 아이폰 앱을 동시에 만들 수도 있습니다.\n\n-이런 걸 만들어요-\n배달 앱, 메신저, 운동 기록 앱, 알림이 오는 일정 관리 앱처럼 매일 쓰는 모바일 서비스를 만들어요.\n\n-이런 분께 추천-\n• 내가 만든 걸 내 폰에 바로 깔아 써보고 싶은 분\n• 모바일 환경에 맞는 UI/UX 설계에 관심 있는 분\n• 알림·카메라·위치 등 기기 기능을 다뤄보고 싶은 분`,
  },
  {
    id: 4,
    title: "데이터 사이언스 & 머신러닝",
    content: `-정의-\n쌓여 있는 대량의 데이터에서 의미 있는 패턴을 찾아내고, 그 데이터로 스스로 학습하는 인공지능 모델을 만드는 분야예요. "데이터로 미래를 예측하고 판단하는" 일을 합니다.\n\n-주요 기술-\nPython이 사실상 표준이에요. Pandas·NumPy로 데이터를 다루고, scikit-learn으로 분석을, TensorFlow·PyTorch로 딥러닝 모델을 만듭니다. 통계와 선형대수 같은 수학 기초가 큰 힘이 돼요.\n\n-이런 걸 만들어요-\n넷플릭스 추천 시스템, 스팸 메일 필터, 수요 예측, 이미지 분류, 챗봇·생성형 AI(GPT 등)가 모두 이 분야의 응용이에요.\n\n-이런 분께 추천-\n• 숫자와 데이터 속 숨은 규칙을 찾는 게 재밌는 분\n• 요즘 핫한 AI를 직접 만들어보고 싶은 분\n• 수학·통계에 거부감이 없는(혹은 도전하고 싶은) 분`,
  },
  {
    id: 5,
    title: "게임 개발",
    content: `-정의-\nPC·콘솔·모바일에서 즐기는 게임을 만드는 분야예요. 그래픽, 사운드, 조작감, 규칙(게임 로직)까지 여러 요소를 합쳐 하나의 "플레이 경험"을 설계합니다.\n\n-주요 기술-\nUnity(C#)와 Unreal Engine(C++) 같은 게임 엔진을 주로 써요. 캐릭터 움직임, 충돌 처리(물리 엔진), 점수 시스템 등을 코드로 구현하고, 그래픽스에 대한 이해도 도움이 됩니다.\n\n-이런 걸 만들어요-\n2D 캐주얼 게임, 3D 액션 게임, 모바일 퍼즐 게임은 물론 VR 콘텐츠까지 다양하게 만들 수 있어요.\n\n-이런 분께 추천-\n• 게임을 즐기는 걸 넘어 직접 만들어보고 싶은 분\n• 기획·그래픽·코드가 어우러지는 종합 창작을 좋아하는 분\n• 결과물을 친구들과 바로 플레이하며 피드백받고 싶은 분`,
  },
  {
    id: 6,
    title: "시스템 프로그래밍",
    content: `-정의-\n운영체제, 디바이스 드라이버, 임베디드 시스템처럼 컴퓨터와 하드웨어에 가장 가까운 저수준 소프트웨어를 만드는 분야예요. 다른 모든 프로그램이 그 위에서 돌아가는 "기반"을 다룹니다.\n\n-주요 기술-\n메모리와 성능을 직접 제어할 수 있는 C, C++을 주로 쓰고, 최근에는 안전성과 성능을 함께 잡는 Rust도 많이 써요. 때로는 하드웨어에 직접 명령하는 Assembly까지 다룹니다.\n\n-이런 걸 만들어요-\n운영체제 커널, IoT 기기 펌웨어, 자동차·가전 속 임베디드 소프트웨어, 고성능이 필요한 시스템 등을 만들어요.\n\n-이런 분께 추천-\n• 컴퓨터가 내부에서 "실제로 어떻게 동작하는지" 궁금한 분\n• 메모리·성능을 한계까지 다뤄보고 싶은 분\n• 쉽게 접하기 어려운 깊이 있는 주제에 도전하고 싶은 분`,
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
    text: "개강을 맞아 새로운 동아리에 들어가려 해요. 어떤 동아리에 들어갈까요?",
    options: ["FORIF", "포리프"],
  },
  {
    id: 2,
    title: "관심 분야",
    text: "포리프에는 아주 다양한 스터디가 열려 어떤 스터디를 선택해야 할지 고민이에요. 어떤 분야에 관심이 있나요?",
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

// --- 스터디 추천 로직 ---

export interface StudyRecommendation {
  /** 분야 표시명 (예: "프론트엔드") */
  fieldLabel: string;
  /** 스터디 목록 필터(`tag`)로 넘길 라벨. 없으면 분야 필터 미적용 */
  tag?: string;
  /** 난이도 표시명 (예: "보통") */
  difficultyLabel: string;
  /** 스터디 목록 필터(`difficulty`)로 넘길 값 (예: "NORMAL") */
  difficulty?: string;
  /** 진행 방식 (강의형 / 프로젝트형) */
  format: string;
  /** 추천 결과 한 줄 설명 */
  description: string;
}

// Q2(관심 분야) 답변 인덱스 → 목록 필터 태그 라벨 매핑
const FIELD_BY_INTEREST: Array<{ label: string; tag?: string }> = [
  { label: "프론트엔드", tag: "프론트엔드" },
  { label: "백엔드", tag: "백엔드" },
  { label: "데이터", tag: "데이터" },
  { label: "알고리즘", tag: "알고리즘" },
  { label: "인공지능", tag: "인공지능" },
  { label: "심화·전문 분야", tag: undefined },
];

// Q4(난이도) 답변 인덱스 → DIFFICULTY 값/라벨 매핑
const DIFFICULTY_BY_LEVEL: Array<{ label: string; value: string }> = [
  { label: "쉬움", value: "EASY" },
  { label: "보통", value: "NORMAL" },
  { label: "조금 어려움", value: "SEMI_HARD" },
  { label: "어려움", value: "HARD" },
];

// Q5(진행 방식) 답변 인덱스 → 방식 표시명 매핑
const FORMAT_BY_STYLE = ["강의형", "프로젝트형"];

/**
 * 추천 모달의 답변 배열을 받아 분야·난이도·방식을 도출한다.
 * 답변 인덱스는 RECOMMENDATION_QUESTIONS의 옵션 순서를 기준으로 매핑한다.
 */
export function getStudyRecommendation(answers: string[]): StudyRecommendation {
  const indexOfAnswer = (questionIndex: number): number => {
    const answer = answers[questionIndex];
    const options = RECOMMENDATION_QUESTIONS[questionIndex]?.options ?? [];
    return Math.max(0, options.indexOf(answer ?? ""));
  };

  const field = FIELD_BY_INTEREST[indexOfAnswer(1)] ?? FIELD_BY_INTEREST[5];
  const difficulty =
    DIFFICULTY_BY_LEVEL[indexOfAnswer(3)] ?? DIFFICULTY_BY_LEVEL[1];
  const format = FORMAT_BY_STYLE[indexOfAnswer(4)] ?? FORMAT_BY_STYLE[0];

  return {
    fieldLabel: field.label,
    tag: field.tag,
    difficultyLabel: difficulty.label,
    difficulty: difficulty.value,
    format,
    description: `${field.label} 분야의 ${difficulty.label} 난이도, ${format} 스터디를 추천해요.`,
  };
}
