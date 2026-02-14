// Mock data for home page sections

export interface HackathonData {
  id: string;
  title: string;
  description: string;
  date: string;
  thumbnail: string;
  link: string;
}

export interface NewsData {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: "notice" | "blog" | "faq";
  thumbnail?: string;
  link: string;
}

export interface ServiceData {
  id: string;
  badge: string;
  title: string;
  description: string;
  link: string;
}

// Hackathon Banner Data
export const hackathonBanner = {
  title: "포리프의 해커톤에 대해 알아보세요",
  description:
    "포리프는 매 학기 해커톤을 개최하고 있어요. 구체적으로 알아보세요.",
  ctaText: "자세히보기",
  ctaLink: "/hackathon",
};

// Hackathon Cards Data
export const hackathonCards: HackathonData[] = [
  {
    id: "1",
    title: "LMS 학습 지원 알리미 서비스 AI LME",
    description:
      "나의 일정을 알고, 생활 패턴을 아는 나만의 친구와 질문을 주고 받는 것. 그것이 우리가 주목한 포인트.",
    date: "자세히보기",
    thumbnail: "/images/hackathon/study-img.png",
    link: "/hackathon/1",
  },
  {
    id: "2",
    title: "언제볼까?",
    description: "약속 잡기 번거로운 현대인들을 위한 시간표 공유 서비스",
    date: "자세히보기",
    thumbnail: "/images/hackathon/study-img.png",
    link: "/hackathon/2",
  },
  {
    id: "3",
    title: "포리프 DB 성장기",
    description: "포리프 웹사이트 DB의 성장을 돕고자 나왔다! 포리프 DB 성장기",
    date: "자세히 보기",
    thumbnail: "/images/hackathon/study-img.png",
    link: "/hackathon/3",
  },
  {
    id: "4",
    title: "포리프 DB 성장기",
    description: "포리프 웹사이트 DB의 성장을 돕고자 나왔다! 포리프 DB 성장기",
    date: "자세히 보기",
    thumbnail: "/images/hackathon/study-img.png",
    link: "/hackathon/3",
  },
  {
    id: "5",
    title: "포리프 DB 성장기",
    description: "포리프 웹사이트 DB의 성장을 돕고자 나왔다! 포리프 DB 성장기",
    date: "자세히 보기",
    thumbnail: "/images/hackathon/study-img.png",
    link: "/hackathon/3",
  },
  {
    id: "6",
    title: "포리프 DB 성장기",
    description: "포리프 웹사이트 DB의 성장을 돕고자 나왔다! 포리프 DB 성장기",
    date: "자세히 보기",
    thumbnail: "/images/hackathon/study-img.png",
    link: "/hackathon/3",
  },
  {
    id: "7",
    title: "포리프 DB 성장기",
    description: "포리프 웹사이트 DB의 성장을 돕고자 나왔다! 포리프 DB 성장기",
    date: "자세히 보기",
    thumbnail: "/images/hackathon/study-img.png",
    link: "/hackathon/3",
  },
];

// News Data
export const newsData: NewsData[] = [
  {
    id: "1",
    title: "Refresh Token Rotation - 토큰 탈취 시나리오",
    summary:
      "프런트엔드 개발자, 나아가 인증 관련 로직을 구현해본 개발자라면 토큰 인증 방식에 대해 알고 있을 것입니다.",
    date: "2025.01.15",
    category: "blog",
    thumbnail: "/images/study/sample1.png",
    link: "/news/1",
  },
  {
    id: "2",
    title: "제 2회 HSPC를 개최합니다!",
    summary:
      "HSPC(Hanyang-Sejong Programming Contest, 가칭)는 한양대학교의 FORIF X 세종대학교의 인터페이스 X 세종대학교의 SAI 동아리가 연합하여 진행할 예정인 교내 비전공자 및 새싹 개발자를 위한 프로그래밍 평가 대회입니다.",
    date: "2025.01.10",
    category: "notice",
    link: "/news/2",
  },
  {
    id: "3",
    title: "스터디 신청 후 합격 여부는 어디서 알 수 있나요?",
    summary:
      "스터디 신청이 완료되면, 각 스터디 별로 정해진 일정에 따라 합격 여부를 알림톡으로 알려드립니다. 홈페이지에서도 합격 여부를 확인할 수 있습니다.",
    date: "2025.01.08",
    category: "faq",
    link: "/news/3",
  },
  {
    id: "4",
    title: "LLM은 가치관을 가질 수 있는가?",
    summary:
      "'진료지원 플랫폼'은 진료기록을 타 병원 방문 진료 시에도 확인할 수 있도록 플랫폼을 구축하는 것으로, 시가 강원특별자치도, 국민건강보험공단, 원주연세의료원, 도 경제진흥원, 한국스마트헬스케어협회와 공동 추진 중이다.",
    date: "2025.01.05",
    category: "blog",
    thumbnail: "/images/study/sample2.png",
    link: "/news/4",
  },
];

// Service Data
export const serviceData: ServiceData[] = [
  {
    id: "1",
    badge: "스터디",
    title: "스터디 가이드",
    description:
      "한양대학교 대운동장 지하 2층에 위치한 동아리 방에 관해 정보를 볼 수 있고 예약도 할 수 있는 서비스입니다.",
    link: "/studies/guide",
  },
  {
    id: "2",
    badge: "해커톤",
    title: "포리톤",
    description:
      "다음 학기 포리프를 이끌어나갈 멘토에 지원하세요. 여러분들의 많은 참여를 부탁드립니다! 문의는 '문의하기' 탭을 참조해주세요.",
    link: "/hackathon",
  },
  {
    id: "3",
    badge: "회계",
    title: "회계 공시",
    description:
      "스터디 수료 완료 시 해당 스터디를 수료했다는 증명서를 발급받을 수 있습니다.",
    link: "/accounting",
  },
  {
    id: "4",
    badge: "스터디",
    title: "스터디 개설",
    description:
      "스터디를 개설하고 멘토로서 후배들을 이끌어보세요. 가르치면서 배우는 성장을 경험할 수 있습니다.",
    link: "/studies/create",
  },
  {
    id: "5",
    badge: "증명",
    title: "증명서",
    description:
      "포리프 활동 증명서를 발급받을 수 있습니다. 스터디 수료증, 멘토 활동 증명서 등을 제공합니다.",
    link: "/certificate",
  },
  {
    id: "6",
    badge: "문의",
    title: "문의하기",
    description:
      "궁금한 점이 있으시면 언제든지 문의해주세요. 운영진이 친절하게 답변드리겠습니다.",
    link: "/contact",
  },
];

// CTA Section Data
export const ctaData = {
  title: "지식의 선순환이 일어날 수 있도록",
  description:
    "프로그래밍을 시작하려는 이들부터 성장의 한계를 넘어서는 개발자까지, 포리프는 모든 여정의 동반자입니다. 지식을 나누고, 경험을 공유하며, 서로의 성장을 이끄는 선순환의 흐름 속에서 우리는 함께 배우고, 함께 나아갑니다. 코드로 연결되고 마음으로 이어지는 이 네트워크 안에서, 당신의 가능성은 더욱 확장됩니다.",
  ctaText: "포리프 소개 보러가기",
  ctaLink: "/about",
};
