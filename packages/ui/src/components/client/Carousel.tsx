import { ArrowLeft, ArrowRight } from "@repo/assets/icons/lucide";
import Image from "next/image";
import { Body } from "../server/Body";
import { Display } from "../server/Display";
import { Button } from "./Button";

interface CarouselProps {
  carouselItems: CarouselItem[];
}
export interface CarouselItem {
  imageSrc: string;
  title: string;
  description: string;
  footer?: React.ReactNode;
  onClick?: () => void;
}

export function Carousel({ carouselItems }: CarouselProps) {
  if (carouselItems.length === 0) {
    return <div className="text-center">No items to display</div>;
  }
  return (
    <div className="flex w-full items-center justify-between">
      <CarouselArrow align="left" title="이전" />
      <div className="flex w-full max-w-[1200px] flex-row items-center justify-between">
        <div className="max-w-[600px]">
          <Display size="s" className="text-text-basic mb-6">
            {carouselItems[0].title}
          </Display>
          <Body size="l" className="text-text-basic mb-6">
            {carouselItems[0].description}
          </Body>
          {carouselItems[0].footer ? (
            <CarouselFooter>{carouselItems[0].footer}</CarouselFooter>
          ) : (
            <div className="flex flex-row gap-4">
              <Button>자세히 보러가기</Button>
            </div>
          )}
        </div>
        <Image
          src={carouselItems[0].imageSrc}
          alt="Carousel Image"
          width={344}
          height={300}
          className="rounded-2"
        />
      </div>
      <CarouselArrow align="right" title="다음" />
    </div>
  );
}

export function CarouselArrow({
  onClick,
  title,
  align = "left",
}: {
  onClick?: () => void;
  title?: string;
  align?: "left" | "right";
}) {
  return (
    <button
      onClick={onClick}
      className="bg-surface-white hover:bg-surface-white-subtler border-border-gray-light flex cursor-pointer items-center gap-2 rounded-full border p-2"
    >
      {align === "left" ? (
        <ArrowLeft className="text-text-basic" />
      ) : (
        <ArrowRight className="text-text-basic" />
      )}
      <span className="sr-only">{title}</span>
    </button>
  );
}

export function CarouselContent({
  imageSrc,
  title,
  description,
}: {
  imageSrc?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-[600px]">
      <Display size="s" className="mb-6">
        한양대학교 최대 규모의 중앙 프로그래밍 동아리, 포리프에 대해 알아보세요.
      </Display>
      <Body size="l" className="mb-6">
        전공과 무관하게 프로그래밍에 관심 있는 모든 학생을 환영합니다.
      </Body>
      <div className="flex flex-row gap-4">
        <Button>자세히 보러가기</Button>
        <Button variant="tertiary">운영진 지원하기</Button>
      </div>
    </div>
  );
}

export function CarouselFooter({ children }: { children?: React.ReactNode }) {
  return <div>{children}</div>;
}
