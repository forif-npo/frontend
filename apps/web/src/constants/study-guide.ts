export interface ProgrammingCardSection {
  title: string;
  body: string;
}

export interface ProgrammingCard {
  id: number;
  title: string;
  sections: ProgrammingCardSection[];
}

export const PROGRAMMING_CARDS: ProgrammingCard[] = [
  {
    id: 1,
    title: "프론트엔드 개발",
    sections: [
      {
        title: "정의",
        body: '웹사이트나 웹 앱에서 사용자가 직접 보고 클릭하고 입력하는 화면(인터페이스)을 만드는 분야예요. 버튼 하나, 애니메이션 하나까지 "사용자가 어떻게 느낄까"를 고민하며 만듭니다.',
      },
      {
        title: "주요 기술",
        body: "HTML/CSS로 화면의 뼈대와 디자인을 잡고, JavaScript(및 TypeScript)로 동작을 입혀요. 규모가 커지면 React, Vue.js, Angular 같은 프레임워크로 화면을 효율적으로 관리합니다.",
      },
      {
        title: "이런 걸 만들어요",
        body: "쇼핑몰 상품 페이지, 인스타그램 피드, 대시보드, 포리프 홈페이지처럼 눈에 보이는 거의 모든 웹 화면이 프론트엔드의 결과물이에요.",
      },
      {
        title: "이런 분께 추천",
        body: "• 결과물이 눈에 바로바로 보이는 게 좋은 분\n• 디자인과 사용자 경험(UX)에 관심이 많은 분\n• 작은 변화로 화면이 달라지는 즉각적인 피드백을 즐기는 분",
      },
    ],
  },
  {
    id: 2,
    title: "백엔드 개발",
    sections: [
      {
        title: "정의",
        body: '눈에 보이지 않는 서버 쪽에서 데이터를 처리하고 저장하며, 화면(프론트엔드)이 필요로 하는 정보를 만들어 보내주는 분야예요. 서비스의 "두뇌와 창고" 역할을 합니다.',
      },
      {
        title: "주요 기술",
        body: "Java(Spring), Python(Django/FastAPI), Node.js 같은 언어·프레임워크로 로직을 짜고, MySQL·PostgreSQL 같은 데이터베이스(SQL)로 데이터를 다뤄요. API를 설계해 프론트엔드와 데이터를 주고받습니다.",
      },
      {
        title: "이런 걸 만들어요",
        body: "로그인/회원가입 처리, 결제 시스템, 게시글 저장과 조회, 추천 알고리즘 서버 등 서비스의 핵심 동작을 담당해요.",
      },
      {
        title: "이런 분께 추천",
        body: "• 데이터가 어떻게 흐르고 저장되는지가 궁금한 분\n• 논리적으로 구조를 설계하는 걸 좋아하는 분\n• 안정적이고 빠른 시스템을 만드는 데 보람을 느끼는 분",
      },
    ],
  },
  {
    id: 3,
    title: "모바일 앱 개발",
    sections: [
      {
        title: "정의",
        body: "스마트폰·태블릿에서 동작하는 애플리케이션을 만드는 분야예요. 손안의 작은 화면에서 카메라, 알림, 위치 같은 기기 기능을 활용해 서비스를 만듭니다.",
      },
      {
        title: "주요 기술",
        body: "Android는 Kotlin/Java, iOS는 Swift를 주로 써요. React Native·Flutter를 쓰면 하나의 코드로 안드로이드와 아이폰 앱을 동시에 만들 수도 있습니다.",
      },
      {
        title: "이런 걸 만들어요",
        body: "배달 앱, 메신저, 운동 기록 앱, 알림이 오는 일정 관리 앱처럼 매일 쓰는 모바일 서비스를 만들어요.",
      },
      {
        title: "이런 분께 추천",
        body: "• 내가 만든 걸 내 폰에 바로 깔아 써보고 싶은 분\n• 모바일 환경에 맞는 UI/UX 설계에 관심 있는 분\n• 알림·카메라·위치 등 기기 기능을 다뤄보고 싶은 분",
      },
    ],
  },
  {
    id: 4,
    title: "데이터 사이언스 & 머신러닝",
    sections: [
      {
        title: "정의",
        body: '쌓여 있는 대량의 데이터에서 의미 있는 패턴을 찾아내고, 그 데이터로 스스로 학습하는 인공지능 모델을 만드는 분야예요. "데이터로 미래를 예측하고 판단하는" 일을 합니다.',
      },
      {
        title: "주요 기술",
        body: "Python이 사실상 표준이에요. Pandas·NumPy로 데이터를 다루고, scikit-learn으로 분석을, TensorFlow·PyTorch로 딥러닝 모델을 만듭니다. 통계와 선형대수 같은 수학 기초가 큰 힘이 돼요.",
      },
      {
        title: "이런 걸 만들어요",
        body: "넷플릭스 추천 시스템, 스팸 메일 필터, 수요 예측, 이미지 분류, 챗봇·생성형 AI(GPT 등)가 모두 이 분야의 응용이에요.",
      },
      {
        title: "이런 분께 추천",
        body: "• 숫자와 데이터 속 숨은 규칙을 찾는 게 재밌는 분\n• 요즘 핫한 AI를 직접 만들어보고 싶은 분\n• 수학·통계에 거부감이 없는(혹은 도전하고 싶은) 분",
      },
    ],
  },
  {
    id: 5,
    title: "게임 개발",
    sections: [
      {
        title: "정의",
        body: 'PC·콘솔·모바일에서 즐기는 게임을 만드는 분야예요. 그래픽, 사운드, 조작감, 규칙(게임 로직)까지 여러 요소를 합쳐 하나의 "플레이 경험"을 설계합니다.',
      },
      {
        title: "주요 기술",
        body: "Unity(C#)와 Unreal Engine(C++) 같은 게임 엔진을 주로 써요. 캐릭터 움직임, 충돌 처리(물리 엔진), 점수 시스템 등을 코드로 구현하고, 그래픽스에 대한 이해도 도움이 됩니다.",
      },
      {
        title: "이런 걸 만들어요",
        body: "2D 캐주얼 게임, 3D 액션 게임, 모바일 퍼즐 게임은 물론 VR 콘텐츠까지 다양하게 만들 수 있어요.",
      },
      {
        title: "이런 분께 추천",
        body: "• 게임을 즐기는 걸 넘어 직접 만들어보고 싶은 분\n• 기획·그래픽·코드가 어우러지는 종합 창작을 좋아하는 분\n• 결과물을 친구들과 바로 플레이하며 피드백받고 싶은 분",
      },
    ],
  },
  {
    id: 6,
    title: "시스템 프로그래밍",
    sections: [
      {
        title: "정의",
        body: '운영체제, 디바이스 드라이버, 임베디드 시스템처럼 컴퓨터와 하드웨어에 가장 가까운 저수준 소프트웨어를 만드는 분야예요. 다른 모든 프로그램이 그 위에서 돌아가는 "기반"을 다룹니다.',
      },
      {
        title: "주요 기술",
        body: "메모리와 성능을 직접 제어할 수 있는 C, C++을 주로 쓰고, 최근에는 안전성과 성능을 함께 잡는 Rust도 많이 써요. 때로는 하드웨어에 직접 명령하는 Assembly까지 다룹니다.",
      },
      {
        title: "이런 걸 만들어요",
        body: "운영체제 커널, IoT 기기 펌웨어, 자동차·가전 속 임베디드 소프트웨어, 고성능이 필요한 시스템 등을 만들어요.",
      },
      {
        title: "이런 분께 추천",
        body: '• 컴퓨터가 내부에서 "실제로 어떻게 동작하는지" 궁금한 분\n• 메모리·성능을 한계까지 다뤄보고 싶은 분\n• 쉽게 접하기 어려운 깊이 있는 주제에 도전하고 싶은 분',
      },
    ],
  },
];

export interface StudyGuideTextSection {
  eyebrow: string;
  heading: string;
  body: string;
}

export type StudyGuideTableLineTone = "basic" | "subtle";

export interface StudyGuideTableLine {
  text: string;
  tone?: StudyGuideTableLineTone;
}

export interface StudyGuideTableRow {
  label: string;
  lines: StudyGuideTableLine[];
}

export interface StudyTypeGuide {
  title: string;
  description: string;
  rows: StudyGuideTableRow[];
}

export const STUDY_GUIDE_HERO = {
  title: "스터디 가이드",
  description: "나에게 맞는 스터디를 찾아보세요!",
};

export const STUDY_GUIDE_CARD_CTA_LABEL = "자세히 보기";

export const STUDY_GUIDE_SECTIONS = {
  introduction: {
    eyebrow: "스터디 소개",
    heading: "프로그래밍이 뭔가요?",
    body: "프로그래밍은 다양한 분야로 나뉘며, 각 분야마다 특징적인 기술과 도구를 사용합니다.\n다음은 주요 프로그래밍 분야들입니다.",
  },
  procedure: {
    eyebrow: "스터디 진행 과정",
    heading: "우리의 한 학기는 이렇게 진행돼요.",
    body: "정규 스터디 기준 15주 중 시험 기간을 고려하여 8주 이상의 스터디가 진행됩니다.\n스터디가 종료된 이후에는 한 학기의 마지막 행사인 해커톤이 개최됩니다.\n\n이외에도 알고리즘 대회, 홈커밍 데이 등 학기별로 다양한 행사를 진행합니다.",
  },
  completion: {
    eyebrow: "스터디 수료",
    heading: "스터디 이수와 수료증",
    body: "스터디 총 수업 중 3/4 이상을 참석하고 해커톤에 참여했을 시 스터디 이수 조건을 충족합니다.\n스터디를 이수하면 해커톤이 끝난 뒤 수료증이 지급됩니다.",
  },
  recommendation: {
    eyebrow: "스터디 추천",
    heading: "나에게 맞는 스터디는?",
    body: "포리프의 스터디를 듣고싶지만, 어떤 스터디를 들어야 할지 고민이 된다면,\n저희가 스터디 선택을 도와드릴게요!\n아래의 테스트를 진행하여 관심 분야를 알아보고\n강의 방식, 난이도, 관심 분야를 고려하여 본인에게 맞는 스터디를 수강해보세요.",
  },
} satisfies Record<string, StudyGuideTextSection>;

export const STUDY_OPERATION_GUIDE = {
  eyebrow: "스터디 운영 방식",
  heading: "스터디 진행 방식",
  body: "포리프의 스터디는 크게 '정규스터디'와 '자율스터디'로 나누어집니다. 정규스터디는 또다시 강의형과 프로젝트형으로 나누어집니다.",
  studyTypes: [
    {
      title: "1. 정규 스터디",
      description:
        "매 학기가 시작하며 다양한 지식을 갖춘 멘토님들이 스터디를 개설합니다. 이렇게 개설되는 스터디를 '정규스터디'라고 합니다.",
      rows: [
        {
          label: "모집",
          lines: [{ text: "3월 / 9월 초 부원 모집 기간" }],
        },
        {
          label: "진행 횟수",
          lines: [
            {
              text: "총 15주 중 중간고사 / 기말고사 기간을 고려하여 8주 이상의 스터디가 진행됩니다.",
            },
          ],
        },
        {
          label: "진행 일시",
          lines: [{ text: "주 1회, 멘토가 지정한 요일과 시간에 진행됩니다." }],
        },
        {
          label: "개설 스터디",
          lines: [
            {
              text: "개설 스터디는 매 학기마다 다르며, 포리프는 매 학기 다양한 분야의 스터디가 개설되고 있습니다.",
            },
          ],
        },
        {
          label: "진행 방식",
          lines: [
            { text: "강의형과 프로젝트형으로 나누어집니다." },
            {
              text: "- 강의형: 다인원을 대상으로 이루어지며, 멘토가 강의식으로 수업을 진행합니다. 일반적으로 기초스터디가 이에 해당합니다.",
              tone: "subtle",
            },
            {
              text: "- 프로젝트형: 소규모로 진행되며, 프로젝트 결과물을 만들어내는 것을 중심으로 진행됩니다. 기본적인 프로그래밍 능력이 요구됩니다.",
              tone: "subtle",
            },
          ],
        },
        {
          label: "혜택",
          lines: [{ text: "일정 요건 충족 시 수료증이 발급됩니다." }],
        },
      ],
    },
    {
      title: "2. 자율 스터디",
      description:
        "자율 스터디는 정규 스터디와는 다르게 학기가 시작된 후 부원들의 수요에 따라 개설되는 스터디입니다. 일반적으로 '멘토'는 존재하지 않으며, 함께 공부할 사람들이 모여 스터디를 진행합니다.",
      rows: [
        {
          label: "모집",
          lines: [{ text: "3월 / 9월 중순" }],
        },
        {
          label: "진행 횟수 및 일시",
          lines: [{ text: "스터디원들간의 조율로 진행 계획을 세웁니다." }],
        },
        {
          label: "개설 방법",
          lines: [
            {
              text: "운영진측에 스터디 계획서를 제출하면 스터디 홍보가 진행됩니다.",
            },
          ],
        },
        {
          label: "혜택",
          lines: [
            { text: "스터디 별 기준에 따라 최대 5만원 지급" },
            {
              text: "* 자율스터디 수강은 포리프 인증서가 발급되지 않습니다.",
              tone: "subtle",
            },
            {
              text: "* 자율스터디는 출석체크 대상에 포함되지 않으며 정해진 회차나 일정이 없습니다.",
              tone: "subtle",
            },
          ],
        },
      ],
    },
  ] satisfies StudyTypeGuide[],
  summary:
    "위의 내용과 같이 포리프의 스터디는 크게 정규스터디와 자율스터디로 구성되어 있습니다.\n학기 초, 부원모집 시 지원자들은 '정규스터디'에 지원하거나 '자율부원'에 지원합니다.\n\n정규스터디 부원은 정규스터디와 자율스터디를 동시에 수강할 수도 있고, 정규스터디만 수강할 수도 있습니다. 반대로 자율부원은 정규스터디를 수강하지 않지만, 자율스터디를 수강할 수 있습니다.\n\n자율부원은 스터디를 정규스터디 수강을 제외한 모든 포리프 행사 참여와 부원으로서의 혜택을 누릴 수 있습니다.",
};

export const STUDY_RECOMMENDATION_CTA_LABEL = "나에게 맞는 스터디 알아보기";

export const STUDY_RECOMMENDATION_SIDE_PANEL = {
  description: "포리프의 다양한 스터디 중\n어떤 스터디가 나에게 맞을까?",
  buttonLabel: STUDY_RECOMMENDATION_CTA_LABEL,
  mobileLabel: "스터디 추천받기",
};

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

export const GUIDE_TAB_SCROLL_OFFSET = 96;

export type StudyRecommendationResultKey =
  | "fieldLabel"
  | "difficultyLabel"
  | "format";

export const RECOMMENDATION_MODAL_COPY = {
  title: "나에게 맞는 스터디 찾기",
  resultLabel: "추천 결과",
  resultRows: [
    { label: "관심 분야", key: "fieldLabel" },
    { label: "추천 난이도", key: "difficultyLabel" },
    { label: "진행 방식", key: "format" },
  ] satisfies Array<{ label: string; key: StudyRecommendationResultKey }>,
  resultHelperText:
    "아래 버튼을 누르면 이 조건에 맞는 스터디를 모아서 보여드려요.",
  resetButtonLabel: "다시 하기",
  listButtonLabel: "추천 스터디 보기",
};

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
