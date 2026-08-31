import { Body, Display } from "@ui/components/server";
import Image from "next/image";

interface ForifIntroBannerProps {
  variant?: "carousel" | "mobile-section";
}

export function ForifIntroBanner({
  variant = "carousel",
}: ForifIntroBannerProps) {
  if (variant === "mobile-section") {
    return (
      <div className="from-primary-5 via-surface-white to-primary-5 flex w-full flex-col items-start gap-4 overflow-hidden bg-gradient-to-r px-5 py-9">
        <Image
          src="/images/carousel-img.png"
          alt="FORIF 소개 이미지"
          width={344}
          height={300}
          className="mx-auto h-auto w-full max-w-[150px]"
        />
        <div className="max-w-[800px]">
          <Display
            size="s"
            className="text-text-basic mb-3 text-[18px] leading-[1.35]"
          >
            한양대학교 최대 규모의 중앙 프로그래밍 동아리,
            <br />
            <span className="text-text-primary">포리프</span>에 대해 알아보세요.
          </Display>
          <Body
            size="l"
            className="text-text-basic mb-0 text-[16px] leading-snug"
          >
            전공과 관계없이 프로그래밍을 배우고 경험을 쌓으며 함께 성장해요.
          </Body>
        </div>
      </div>
    );
  }

  return (
    <div className="from-primary-5 via-surface-white to-primary-5 flex h-full w-full flex-row items-center justify-center gap-3 overflow-hidden bg-gradient-to-r px-5 py-4 md:gap-9 md:px-0 md:py-0">
      <div className="max-w-[800px]">
        <Display
          size="s"
          className="text-text-basic mb-0 max-md:text-[15px] max-md:leading-tight md:mb-6"
        >
          <span className="md:hidden">
            한양대학교 최대 규모의
            <br />
            프로그래밍 동아리, <span className="text-text-primary">포리프</span>
          </span>
          <span className="hidden md:inline">
            한양대학교 최대 규모의 중앙 프로그래밍 동아리,
            <br />
            <span className="text-text-primary">포리프</span>에 대해 알아보세요.
          </span>
        </Display>
        <Body size="l" className="text-text-basic mb-0 hidden md:mb-6 md:block">
          전공과 관계없이 프로그래밍을 배우고 경험을 쌓으며 함께 성장해요.
        </Body>
      </div>
      <Image
        src="/images/carousel-img.png"
        alt="FORIF 소개 이미지"
        width={344}
        height={300}
        className="order-none mx-auto h-auto w-[76px] shrink-0 md:hidden"
      />
      <Image
        src="/images/carousel-img.png"
        alt="FORIF 소개 이미지"
        width={344}
        height={300}
        className="rounded-2 hidden h-auto w-full max-w-[344px] md:block"
      />
    </div>
  );
}
