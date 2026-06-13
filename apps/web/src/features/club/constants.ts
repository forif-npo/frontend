// 동아리 소개 페이지에서 쓰는 데이터. 숫자/문구는 여기서 수정하면 됩니다.

export interface ClubStat {
  /** 카운트업 목표 숫자 */
  value: number;
  /** 숫자 뒤에 붙는 접미사 (예: "+", "회", "명") */
  suffix?: string;
  /** 통계 설명 */
  label: string;
}

// 모든 수치는 동아리 연혁(HistoryTimeline)에 근거합니다.
export const CLUB_STATS: ClubStat[] = [
  { value: 10, suffix: "년+", label: "함께한 시간" },
  { value: 200, suffix: "명+", label: "한 학기 부원" },
  { value: 16, suffix: "회", label: "누적 해커톤" },
  { value: 2, suffix: "회", label: "알고리즘 대회" },
];

export interface ClubValue {
  /** 영문 키워드 */
  keyword: string;
  title: string;
  description: string;
}

export const CLUB_VALUES: ClubValue[] = [
  {
    keyword: "SHARE",
    title: "지식의 선순환",
    description:
      "먼저 배운 사람이 다음 사람에게 나누고, 그 사람이 또 다음 사람에게 전합니다. 멘토와 멘티가 함께 성장하는 선순환이 포리프의 핵심이에요.",
  },
  {
    keyword: "GROWTH",
    title: "전공을 넘어선 성장",
    description:
      "전공자도, 비전공자도 환영합니다. 스터디부터 해커톤·대회까지, 직접 만들고 부딪히며 실력을 키우는 경험을 제공해요.",
  },
  {
    keyword: "TOGETHER",
    title: "함께하는 문화",
    description:
      "혼자라면 어려운 것도 함께라면 해낼 수 있어요. OT, MT, 홈커밍데이, 정기 모임으로 끈끈하게 이어지는 커뮤니티를 만듭니다.",
  },
];

export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  /** 데스크탑 그리드에서 차지할 가로 칸 수 (기본 1) */
  colSpan?: 1 | 2;
  /** 데스크탑 그리드에서 차지할 세로 칸 수 (기본 1) */
  rowSpan?: 1 | 2;
}

// 실제 활동 사진. 새 사진이 생기면 src/caption을 교체하세요.
// 데스크탑은 4열×3행(12칸) 고정 높이 그리드. 2×2 두 개 + 1×1 네 개로 빈칸 없이 채운다.
//   [정규][정규][ MT  ][프로젝트]
//   [정규][정규][해커톤][해커톤]
//   [ OT ][정기모임][해커톤][해커톤]
// 배열 순서가 곧 배치 순서다(좌→우, 위→아래 자동 배치). 순서를 바꾸면 배치가 바뀐다.
export const GALLERY_ITEMS: GalleryItem[] = [
  {
    src: "/images/study-25-2.jpg",
    alt: "정규 스터디",
    caption: "정규 스터디",
    colSpan: 2,
    rowSpan: 2,
  },
  { src: "/images/MT.jpg", alt: "MT 단체 사진", caption: "MT" },
  {
    src: "/images/about-bg.png",
    alt: "프로젝트 발표",
    caption: "프로젝트 발표",
  },
  {
    src: "/images/hackathon.jpg",
    alt: "해커톤 현장",
    caption: "해커톤",
    colSpan: 2,
    rowSpan: 2,
  },
  { src: "/images/ot_2024_1.jpeg", alt: "신학기 OT", caption: "신학기 OT" },
  { src: "/images/moim.jpg", alt: "정기 모임", caption: "정기 모임" },
];
