import { Body, Display } from "@ui/components/server";
import Image from "next/image";

export function ForifIntroBanner() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 overflow-hidden md:flex-row md:items-center md:justify-center md:gap-9">
      <div className="max-w-[800px]">
        <Display
          size="s"
          className="text-text-basic mb-2 max-md:text-[18px] max-md:leading-[1.3] md:mb-6"
        >
          한양대학교 최대 규모의 중앙 프로그래밍 동아리,
          <br />
          <span className="text-text-primary">포리프</span>에 대해 알아보세요.
        </Display>
        <Body
          size="l"
          className="text-text-basic mb-0 max-md:text-[16px] max-md:leading-snug md:mb-6"
        >
          전공과 관계없이 프로그래밍을 배우고 경험을 쌓으며 함께 성장해요.
        </Body>
      </div>
      <Image
        src="/images/carousel-img.png"
        alt="FORIF 소개 이미지"
        width={344}
        height={300}
        className="rounded-2 order-first mx-auto h-auto w-full max-w-[150px] md:order-none md:hidden"
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
