import { Body, Display } from "@ui/components/server";
import Image from "next/image";

export function ForifIntroBanner() {
  return (
    <div className="flex h-full w-full flex-row items-center justify-center gap-3 overflow-hidden bg-[radial-gradient(circle_at_18%_50%,rgba(219,234,254,0.72),transparent_36%),radial-gradient(circle_at_82%_50%,rgba(191,219,254,0.68),transparent_30%),linear-gradient(90deg,#f8fbff_0%,#ffffff_52%,#f7faff_100%)] px-5 py-4 md:gap-9 md:px-0 md:py-0">
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
