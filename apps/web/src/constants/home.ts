// Static data for home page sections

export interface HackathonData {
  id: string;
  title: string;
  description: string;
  date: string;
  thumbnail: string;
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
  ctaText: "자세히 보기",
  ctaLink: "/hackathon",
};

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
    title: "포리프 해커톤",
    description: "저희 동아리의 대표 행사, 포리프 해커톤에 대해 알아보세요.",
    link: "/hackathon",
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
  ctaLink: "/club",
};
