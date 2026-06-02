const history = [
  { year: 2025, content: ["포리프 10주년 기념 행사"] },
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
  { year: 2021, content: ["한양대학교 중앙동아리 승격", "프로젝트 뭉공포"] },
  { year: 2020, content: ["한양대학교 준동아리 승격", "프로젝트 잔디심기"] },
  { year: 2018, content: "청년참 지원사업선정" },
  { year: 2017, content: "한양 학술타운 총장상 수상" },
  { year: 2015, content: ["FORIF 창립", "소셜 벤쳐 동아리 선정"] },
];

function HistoryLine({
  year,
  content,
  idx,
}: {
  year: number;
  content: string | string[];
  idx: number;
}) {
  const isFirst = idx === 0;
  const isLast = idx === history.length - 1;

  // Timeline vertical line positioning
  let lineStyle: React.CSSProperties;
  if (isFirst) {
    lineStyle = { top: "50%", height: "50%", bottom: 0 };
  } else if (isLast) {
    lineStyle = { top: 0, height: "50%" };
  } else {
    lineStyle = { top: 0, height: "100%" };
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      {/* Year */}
      <div style={{ minWidth: 48, flexShrink: 0 }}>
        <p
          style={{
            fontSize: "12pt",
            lineHeight: "16pt",
            letterSpacing: "0.4pt",
          }}
        >
          {year}
        </p>
      </div>

      {/* Dot + line */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "stretch",
          marginLeft: 24,
          marginRight: 24,
        }}
      >
        {/* Vertical line */}
        <div
          style={{
            content: '""',
            position: "absolute",
            display: "block",
            zIndex: 0,
            left: 7,
            width: "0.1rem",
            backgroundColor: "rgba(0,0,0,0.12)",
            ...lineStyle,
          }}
        />
        {/* Dot */}
        <div
          style={{
            width: 16,
            height: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 16,
            marginBottom: 16,
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 16,
              height: "auto",
              aspectRatio: 1,
              borderRadius: "50%",
              border: "2px solid #fff",
              backgroundColor: "#1D40BA",
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: typeof content === "string" ? 0 : 8,
          paddingTop: 32,
          paddingBottom: 32,
          width: "100%",
        }}
      >
        {typeof content === "string" ? (
          <p
            style={{
              fontSize: "12pt",
              lineHeight: "16pt",
              letterSpacing: "0.4pt",
            }}
          >
            {content}
          </p>
        ) : (
          content.map((label) => (
            <p
              key={label}
              style={{
                fontSize: "12pt",
                lineHeight: "16pt",
                letterSpacing: "0.4pt",
              }}
            >
              {label}
            </p>
          ))
        )}
      </div>
    </div>
  );
}

export function HistoryTimeline() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {history.map((item, idx) => (
        <HistoryLine
          key={idx}
          year={item.year}
          content={item.content}
          idx={idx}
        />
      ))}
    </div>
  );
}
