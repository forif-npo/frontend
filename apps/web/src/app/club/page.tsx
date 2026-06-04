"use client";

import { useEffect, useState } from "react";

import { Marquee } from "@/features/club/Marquee";
import { HistoryTimeline } from "@/features/club/HistoryTimeline";

const PRIMARY = "#1D40BA";

function useDeviceSize() {
  const [size, setSize] = useState({ isMobile: false, isTablet: false });

  useEffect(() => {
    function update() {
      setSize({
        isMobile: window.innerWidth < 600,
        isTablet: window.innerWidth < 900,
      });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}

export default function ClubPage() {
  const { isMobile, isTablet } = useDeviceSize();

  return (
    <div>
      {/* Hero background */}
      <div
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/images/about-bg.png)`,
          width: "var(--vw)",
          height: "var(--vh)",
          position: "relative",
        }}
      >
        {/* Title - absolute centered */}
        <div
          className="font-pretendard font-bold"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            fontSize: isMobile ? "80px" : "120px",
            lineHeight: isMobile ? "100px" : "140px",
            fontWeight: 700,
            letterSpacing: "-0.333333px",
          }}
        >
          about_
          <br />
          <span
            style={{
              fontSize: isMobile ? "60px" : "120px",
            }}
          >
            <span style={{ color: PRIMARY }}>{"{"}</span> FORIF{" "}
            <span style={{ color: PRIMARY }}>{"}"}</span>
          </span>
        </div>
      </div>

      {/* Marquee section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "var(--vh)",
          backgroundColor: PRIMARY,
          position: "relative",
          paddingLeft: isMobile ? 32 : isTablet ? 64 : 96,
          paddingRight: isMobile ? 32 : isTablet ? 64 : 96,
          paddingBottom: 32,
          margin: "auto",
        }}
      >
        <p
          style={{
            fontSize: "36pt",
            lineHeight: "44pt",
            color: "white",
            fontWeight: 700,
            position: "absolute",
            top: 32,
          }}
        >
          프로그래밍을 하고 싶은 누구나,
          <br />
          포리프와 함께.
        </p>
        <Marquee />
        <p
          style={{
            fontSize: "36pt",
            lineHeight: "44pt",
            color: "white",
            fontWeight: 700,
            position: "absolute",
            bottom: 32,
            right: 64,
          }}
        >
          지식의 선순환을.
        </p>
      </div>

      {/* History section */}
      <div
        style={{
          minHeight: "var(--vh)",
          position: "relative",
          paddingLeft: isMobile ? 32 : isTablet ? 64 : 96,
          paddingRight: isMobile ? 32 : isTablet ? 64 : 96,
          paddingBottom: 32,
          margin: "auto",
        }}
      >
        {/* Decorative images */}
        {!isTablet && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hackathon2.jpg"
              alt="해커톤 사진 1"
              style={{
                position: "absolute",
                top: "50%",
                width: "16vw",
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/ot_2024_1.jpeg"
              alt="2024년 1학기 OT"
              style={{
                position: "absolute",
                right: 20,
                bottom: "20%",
                width: "16vw",
                height: "auto",
              }}
            />
          </>
        )}

        {/* Centered content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontSize: "36pt",
              lineHeight: "44pt",
              fontWeight: 700,
              marginTop: 160,
              marginBottom: 80,
            }}
          >
            강렬한 <span style={{ color: PRIMARY }}>FORIF</span>의 역사
          </h2>

          <HistoryTimeline />

          <h2
            style={{
              fontSize: "36pt",
              lineHeight: "44pt",
              fontWeight: 700,
              marginTop: 160,
              marginBottom: 80,
            }}
          >
            <span style={{ color: PRIMARY }}>지식의 선순환</span>이 일어날 수
            있도록.
          </h2>
        </div>
      </div>
    </div>
  );
}
