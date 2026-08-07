import { Button } from "@ui/components/client";
import { Body, Display } from "@ui/components/server";
import Image from "next/image";
import Link from "next/link";

export function ForifIntroBanner() {
  return (
    <div className="bg-surface-white/85 border-border-gray-light flex h-full w-full flex-col justify-center gap-2 overflow-hidden rounded-[28px] border p-2 shadow-[0_18px_50px_rgba(11,80,208,0.12)] backdrop-blur md:flex-row md:items-center md:justify-between md:gap-0 md:rounded-[28px] md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none">
      <div className="max-w-[800px]">
        <Display
          size="s"
          className="text-text-basic mb-1 max-md:text-[16px] max-md:leading-tight md:mb-6"
        >
          한양대학교 최대 규모의 중앙 프로그래밍 동아리,
          <br />
          <span className="text-text-primary">포리프</span>에 대해 알아보세요.
        </Display>
        <Body
          size="l"
          className="text-text-basic mb-2 max-md:text-[13px] max-md:leading-snug md:mb-6"
        >
          전공과 관계없이 프로그래밍을 배우고 경험을 쌓으며 함께 성장해요.
        </Body>
        <div className="flex flex-row gap-2 sm:gap-4">
          <Link href="/club/" className="min-w-0 flex-1 sm:w-auto sm:flex-none">
            <Button className="max-md:[&>label]:text-label-m-mobile !min-h-[40px] w-full px-2 sm:w-auto md:!min-h-[56px] md:px-5">
              자세히 보러가기
            </Button>
          </Link>
          <Link
            href="/club/recruit"
            className="min-w-0 flex-1 sm:w-auto sm:flex-none"
          >
            <Button
              variant="tertiary"
              className="max-md:[&>label]:text-label-m-mobile !min-h-[40px] w-full px-2 sm:w-auto md:!min-h-[56px] md:px-5"
            >
              운영진 지원하기
            </Button>
          </Link>
        </div>
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
