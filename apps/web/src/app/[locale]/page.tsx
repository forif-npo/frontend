"use client";
import { CriticalAlert } from "@repo/ui/components/client";
import { Button, Carousel } from "@ui/components";
import { CarouselItem } from "@ui/components/Carousel";
export default function Page() {
  return (
    <div className="min-h-screen">
      <main className="flex flex-col items-center gap-8 sm:items-start">
        <section className="mb-10 mt-20 flex w-full max-w-[1200px] flex-col items-center gap-4">
          <CriticalAlert
            variant="information"
            link="/studies"
            text="스터디 신청 절차를 자세히 알고 싶으신가요?"
            title="스터디 신청 절차 안내 페이지로 이동"
          />
        </section>
        <section className="flex w-full max-w-[1400px] flex-col items-center gap-4">
          <Carousel carouselItems={carouselItems} />
        </section>
      </main>
    </div>
  );
}

const carouselItems: CarouselItem[] = [
  {
    imageSrc: "/images/carousel/carousel-img-1.png",
    title: "한양대학교 중앙 프로그래밍 동아리, 포리프에 대해 알아보세요.",
    description:
      "전공과 무관하게 프로그래밍에 관심 있는 모든 학생을 환영합니다.",
    footer: (
      <div className="flex flex-row gap-4">
        <Button>자세히 보러가기</Button>
        <Button variant="tertiary">운영진 지원하기</Button>
      </div>
    ),
  },
];
