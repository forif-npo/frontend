// Static data for home page sections

export interface HackathonData {
  id: string;
  title: string;
  description: string;
  date: string;
  thumbnail: string;
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

// CTA Section Data
export const ctaData = {
  title: "지식의 선순환이 일어날 수 있도록",
  description:
    "프로그래밍을 시작하려는 이들부터 성장의 한계를 넘어서는 개발자까지, 포리프는 모든 여정의 동반자입니다. 지식을 나누고, 경험을 공유하며, 서로의 성장을 이끄는 선순환의 흐름 속에서 우리는 함께 배우고, 함께 나아갑니다. 코드로 연결되고 마음으로 이어지는 이 네트워크 안에서, 당신의 가능성은 더욱 확장됩니다.",
  ctaText: "포리프 소개 보러가기",
  ctaLink: "/club",
};
