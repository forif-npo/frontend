import type { ProductApplication, ProductDetail } from "./types";

/**
 * 백엔드 프로덕트 API가 준비될 때까지 사용하는 목업 데이터.
 * API 연동 시 api.ts만 실제 호출로 교체하고 이 파일은 제거한다.
 */
export const MOCK_PRODUCTS: ProductDetail[] = [
  {
    slug: "attendly",
    name: "Attendly",
    one_liner: "스터디·세미나 출석을 QR 한 번으로 끝내는 출석 관리 서비스",
    status: "LIVE",
    source_type: "HACKATHON",
    source_label: "2026-1 해커톤 대상",
    tags: ["웹", "생산성"],
    thumbnail_url: null,
    act_year: 2026,
    description:
      "매주 반복되는 스터디 출석 체크를 위해 만들었습니다. 멘토가 세션을 열면 참여자는 QR 코드를 스캔해 3초 만에 출석을 남길 수 있고, 누적 출석률은 대시보드에서 한눈에 확인할 수 있습니다.\n\n2026-1 해커톤에서 대상을 수상한 뒤 실제 FORIF 스터디 운영에 도입하는 것을 목표로 개선을 이어가고 있습니다.",
    service_url: "https://attendly.forif.org",
    github_url: "https://github.com/forif-npo/attendly",
    tech_stack: ["Next.js", "Spring Boot", "MySQL", "Redis"],
    members: [
      { user_name: "김서연", role_label: "팀장 · 백엔드" },
      { user_name: "이준호", role_label: "프론트엔드" },
      { user_name: "박지민", role_label: "디자인" },
    ],
    screenshots: [],
  },
  {
    slug: "hyu-eats",
    name: "한양 이츠",
    one_liner: "오늘 학식 뭐 나와? 한양대 학식 메뉴·혼잡도 알리미",
    status: "LIVE",
    source_type: "STUDY",
    source_label: "2025-2 React 스터디",
    tags: ["웹", "캠퍼스"],
    thumbnail_url: null,
    act_year: 2025,
    description:
      "학생회관·생활과학관 식당의 오늘 메뉴를 아침마다 크롤링해 보여주고, 시간대별 혼잡도를 함께 제공합니다. React 스터디 팀 프로젝트로 시작해 지금은 매일 아침 알림 구독자가 이용하는 서비스로 자랐습니다.",
    service_url: "https://hyu-eats.forif.org",
    github_url: "https://github.com/forif-npo/hyu-eats",
    tech_stack: ["React", "FastAPI", "PostgreSQL"],
    members: [
      { user_name: "최민준", role_label: "팀장 · 풀스택" },
      { user_name: "정하늘", role_label: "크롤링 · 데이터" },
    ],
    screenshots: [],
  },
  {
    slug: "algohub",
    name: "AlgoHub",
    one_liner: "알고리즘 스터디의 주차별 진도와 문제 풀이 현황을 한 곳에서",
    status: "LIVE",
    source_type: "STUDY",
    source_label: "2025-1 알고리즘 스터디",
    tags: ["웹", "교육"],
    thumbnail_url: null,
    act_year: 2025,
    description:
      "백준·프로그래머스 풀이 현황을 자동으로 수집해 스터디원별 진도를 시각화합니다. 매주 누가 어떤 문제를 풀었는지 확인하는 시간을 없애고, 스터디는 풀이 공유에만 집중할 수 있게 합니다.",
    service_url: "https://algohub.forif.org",
    github_url: "https://github.com/forif-npo/algohub",
    tech_stack: ["Vue", "NestJS", "MongoDB"],
    members: [
      { user_name: "강도윤", role_label: "팀장 · 백엔드" },
      { user_name: "윤서아", role_label: "프론트엔드" },
    ],
    screenshots: [],
  },
  {
    slug: "moim",
    name: "모임",
    one_liner: "팀플 시간 조율, 링크 하나로 끝",
    status: "RETIRED",
    source_type: "HACKATHON",
    source_label: "2024-2 해커톤 출품작",
    tags: ["웹", "생산성"],
    thumbnail_url: null,
    act_year: 2024,
    description:
      "참여자들이 가능한 시간을 색칠하면 겹치는 시간대를 바로 찾아주는 시간 조율 서비스입니다. 해커톤 이후 1년간 운영했고, 팀원들의 졸업과 함께 서비스를 종료했습니다.",
    service_url: null,
    github_url: "https://github.com/forif-npo/moim",
    tech_stack: ["Svelte", "Supabase"],
    members: [
      { user_name: "임태양", role_label: "팀장 · 풀스택" },
      { user_name: "한유진", role_label: "디자인" },
    ],
    screenshots: [],
  },
  {
    slug: "campus-navi",
    name: "캠퍼스 내비",
    one_liner: "한양대 캠퍼스 최단 경로 안내 — 지하 통로와 셔틀까지",
    status: "PAUSED",
    source_type: "SIDE",
    source_label: null,
    tags: ["앱", "캠퍼스"],
    thumbnail_url: null,
    act_year: 2025,
    description:
      "언덕이 많은 한양대 캠퍼스에서 건물 간 최단 경로를 안내합니다. 지하 통로·에스컬레이터·셔틀버스를 고려한 경로를 제공하는 것이 특징입니다. 현재 지도 데이터 갱신을 위해 잠시 운영을 중단했습니다.",
    service_url: null,
    github_url: "https://github.com/forif-npo/campus-navi",
    tech_stack: ["React Native", "Spring Boot"],
    members: [
      { user_name: "오시우", role_label: "팀장 · 앱" },
      { user_name: "신다은", role_label: "백엔드" },
      { user_name: "배현우", role_label: "지도 데이터" },
    ],
    screenshots: [],
  },
  {
    slug: "review-raccoon",
    name: "리뷰 라쿤",
    one_liner: "PR을 올리면 먼저 훑어주는 팀 전용 코드 리뷰 봇",
    status: "DEV",
    source_type: "STUDY",
    source_label: "2026-1 AI 스터디",
    tags: ["AI", "개발도구"],
    thumbnail_url: null,
    act_year: 2026,
    description:
      "GitHub PR이 올라오면 컨벤션 위반과 자주 나오는 실수를 먼저 짚어주는 리뷰 봇입니다. AI 스터디에서 LLM 활용을 실습하며 만들고 있고, FORIF 저장소에 시범 적용하는 것이 목표입니다.",
    service_url: null,
    github_url: "https://github.com/forif-npo/review-raccoon",
    tech_stack: ["Python", "LangChain", "GitHub Actions"],
    members: [
      { user_name: "서지호", role_label: "팀장 · AI" },
      { user_name: "문채원", role_label: "백엔드" },
    ],
    screenshots: [],
  },
];

export function getMockProducts() {
  return MOCK_PRODUCTS;
}

export function getMockProductBySlug(slug: string) {
  return MOCK_PRODUCTS.find((product) => product.slug === slug) ?? null;
}

/**
 * 내 신청 현황 목업 — 운영진 평가 결과(승인/반려)가 어떻게 보이는지 시연용.
 * API 연동 시 GET /api/v1/products/applications/me 응답으로 대체된다.
 */
export const MOCK_MY_APPLICATIONS: ProductApplication[] = [
  {
    application_id: "mock-approved-1",
    name: "AlgoHub",
    slug: "algohub",
    one_liner: "알고리즘 스터디의 주차별 진도와 문제 풀이 현황을 한 곳에서",
    description: "",
    source_type: "STUDY",
    service_url: "https://algohub.vercel.app",
    github_url: "https://github.com/forif-npo/algohub",
    tech_stack: ["Vue", "NestJS", "MongoDB"],
    status: "APPROVED",
    reject_reason: null,
    applied_at: "2026-06-28",
  },
  {
    application_id: "mock-rejected-1",
    name: "중고책 마켓",
    slug: "bookmarket",
    one_liner: "한양대 전공책 중고 거래 서비스",
    description: "",
    source_type: "SIDE",
    service_url: null,
    github_url: null,
    tech_stack: ["React"],
    status: "REJECTED",
    reject_reason:
      "배포된 서비스 URL이 없어 검토가 어렵습니다. 배포 후 다시 신청해주세요. 또한 거래 기능은 결제 관련 정책 검토가 필요하니 소개에 운영 방식을 함께 적어주시면 좋습니다.",
    applied_at: "2026-07-02",
  },
];
