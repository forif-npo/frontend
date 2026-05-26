import { Breadcrumb } from "@ui/components/server";

const HISTORY = [
  {
    year: 2025,
    content: ["포리프 10주년 기념 행사"],
  },
  {
    year: 2024,
    content: [
      "선배와의 만남",
      "HSPC 한양X세종 알고리즘 대회 개최",
      "제 2회 홈커밍데이",
      "제 13·14회 해커톤",
    ],
  },
  {
    year: 2023,
    content: [
      "한 학기 부원 수 200명 돌파",
      "HPEC 한양 알고리즘 대회 개최",
      "OOPARTS 연합 스터디",
      "제 1회 홈커밍데이",
      "제 11·12회 해커톤",
    ],
  },
  {
    year: 2021,
    content: ["한양대학교 중앙동아리 승격", "프로젝트 뭉공포"],
  },
  {
    year: 2020,
    content: ["한양대학교 준동아리 승격", "프로젝트 잔디심기"],
  },
  {
    year: 2018,
    content: ["청년참 지원사업선정"],
  },
  {
    year: 2017,
    content: ["한양 학술타운 총장상 수상"],
  },
  {
    year: 2015,
    content: ["FORIF 창립", "소셜 벤쳐 동아리 선정"],
  },
];

const MARQUEE_TAGS = [
  "한양대학교 중앙동아리",
  "프로그래밍 동아리",
  "FORIF",
  "비전공자도 환영",
  "지식의 선순환",
  "함께 성장",
  "멘토와 멘티",
  "해커톤",
  "스터디",
  "네트워킹",
];

function MarqueeRow({ reverse }: { reverse?: boolean }) {
  const items = [...MARQUEE_TAGS, ...MARQUEE_TAGS];
  return (
    <div className="relative flex overflow-hidden py-2">
      <div
        className={`flex shrink-0 gap-6 whitespace-nowrap ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {items.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="text-lg font-medium text-white/60"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function HistoryLine({
  year,
  content,
  isFirst,
  isLast,
}: {
  year: number;
  content: string[];
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex items-stretch px-2">
      {/* Year */}
      <div className="flex w-14 shrink-0 items-center">
        <span className="text-sm font-medium text-gray-700">{year}</span>
      </div>

      {/* Timeline dot + line */}
      <div className="relative mx-4 flex flex-col items-center">
        {/* Line above dot */}
        {!isFirst && <div className="absolute top-0 h-1/2 w-px bg-gray-200" />}
        {/* Dot */}
        <div className="z-10 my-auto flex h-4 w-4 items-center justify-center">
          <div className="h-3.5 w-3.5 rounded-full border-2 border-white bg-[#1D40BA]" />
        </div>
        {/* Line below dot */}
        {!isLast && (
          <div className="absolute bottom-0 h-1/2 w-px bg-gray-200" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 py-4">
        {content.map((label) => (
          <span key={label} className="text-sm text-gray-600">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ClubAboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative flex h-[80vh] items-center justify-center bg-black/60 bg-[url('/images/about-bg.png')] bg-cover bg-center bg-blend-darken">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold leading-tight md:text-[120px] md:leading-[140px]">
            about_
          </h1>
          <p className="text-4xl font-bold md:text-[120px] md:leading-[140px]">
            <span className="text-[#1D40BA]">{"{"}</span> FORIF{" "}
            <span className="text-[#1D40BA]">{"}"}</span>
          </p>
        </div>
      </section>

      {/* Mission Section with Marquee */}
      <section className="relative flex min-h-[60vh] flex-col justify-center overflow-hidden bg-[#1D40BA] px-8 py-16 md:min-h-screen md:px-12">
        <h2 className="mb-auto text-2xl font-bold text-white md:text-4xl">
          프로그래밍을 하고 싶은 누구나,
          <br />
          포리프와 함께.
        </h2>
        <div className="my-auto space-y-2">
          <MarqueeRow />
          <MarqueeRow reverse />
          <MarqueeRow />
        </div>
        <p className="mt-auto text-right text-2xl font-bold text-white md:text-4xl">
          지식의 선순환을.
        </p>
      </section>

      {/* History Section */}
      <section id="history" className="mx-auto max-w-[1100px] px-6 py-20">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "홈", href: "/" },
              { label: "동아리", href: "/club" },
              { label: "동아리 소개" },
            ]}
          />
        </div>

        <div className="flex flex-col items-center">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            강렬한 <span className="text-[#1D40BA]">FORIF</span>의 역사
          </h2>

          <div className="w-full max-w-lg">
            {HISTORY.map((item, idx) => (
              <HistoryLine
                key={item.year}
                year={item.year}
                content={item.content}
                isFirst={idx === 0}
                isLast={idx === HISTORY.length - 1}
              />
            ))}
          </div>

          <h2 className="mt-20 text-center text-3xl font-bold md:text-4xl">
            <span className="text-[#1D40BA]">지식의 선순환</span>이 일어날 수
            있도록.
          </h2>
        </div>
      </section>
    </div>
  );
}
