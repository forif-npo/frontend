import { CTASection } from "@/features/home/CTASection";
import { HackathonSection } from "@/features/home/HackathonSection";
import { NewsSection } from "@/features/home/NewsSection";
import { QuickMenu } from "@/features/home/QuickMenu";
import { ServiceSection } from "@/features/home/ServiceSection";
import { StudySection } from "@/features/home/StudySection";
import {
  MobileBlogSection,
  MobileFAQSection,
  MobileLoginSection,
  MobileNoticeSection,
  MobileStudySection,
} from "@/features/home/mobile";
import { CriticalAlert } from "@repo/ui/components/client";
import { Button, Carousel } from "@ui/components/client";
import { CarouselItem } from "@ui/components/client/Carousel";
import { Heading } from "@ui/components/server";
import Image from "next/image";

export default async function Page() {
  const carouselItems: CarouselItem[] = [
    {
      imageSrc: "/images/carousel/carousel-img-1.png",
      title: (
        <>
          한양대학교 최대 규모의 중앙 프로그래밍 <br /> 동아리,
          <span style={{ color: "var(--krds-color-primary-60)" }}> 포리프</span>
          에 대해 알아보세요.
        </>
      ),
      description:
        "전공과 관계없이 프로그래밍을 배우고 경험을 쌓으며 함께 성장해요.",
      footer: (
        <div className="flex flex-row gap-4">
          <Button>자세히 보러가기</Button>
          <Button variant="tertiary">운영진 지원하기</Button>
        </div>
      ),
    },
  ];
  return (
    <div className="min-h-screen overflow-x-hidden">
      <main className="main-gap flex flex-col items-center sm:items-start">
        {/* Critical Alert - 모든 화면 */}
        <section className="alert-section flex w-full max-w-[1200px] flex-col items-center gap-4">
          <CriticalAlert
            variant="information"
            link="/studies"
            text="스터디 신청 절차를 자세히 알고 싶으신가요?"
            title="스터디 신청 절차 안내 페이지로 이동"
            detailText="자세히보기"
            className="shadow-sm"
          />
        </section>

        {/* Hero Carousel - 데스크탑만 */}
        <section className="my-10 hidden w-full max-w-[1400px] flex-col items-center gap-4 md:flex">
          <Carousel carouselItems={carouselItems} />
        </section>

        {/* Hero Placeholder - 모바일만 */}
        {/* <section className="w-full px-4 md:hidden">
          <div className="h-[200px] w-full rounded-xl bg-[#d6e0eb]" />
        </section> */}

        {/* Mobile Sections - 모바일만 */}
        <section className="flex w-full flex-col gap-2.5 px-4 md:hidden">
          <MobileLoginSection />
          <MobileStudySection />
          <MobileNoticeSection />
          <MobileFAQSection />
          <MobileBlogSection />
        </section>

        {/* Supported By - 데스크탑만 */}
        <div className="mb-16 hidden h-[240px] w-full bg-gradient-to-r from-[#0b50d0] to-white md:block">
          <div className="mx-auto flex h-full max-w-[1200px] justify-center px-8 sm:flex-col lg:px-0">
            <Heading size="m" className="mb-6 text-left text-white">
              Supported by
            </Heading>
            <div className="flex items-center gap-20">
              <Image
                src="hyu.svg"
                alt="Hanyang University Logo"
                width={296}
                height={64}
              />
              <Image
                src="elice.svg"
                alt="Elice company Logo"
                width={191}
                height={32}
              />
            </div>
          </div>
        </div>

        {/* QuickMenu - 데스크탑만 */}
        <section className="mx-auto hidden w-full max-w-[1200px] px-4 md:block lg:px-0">
          <QuickMenu />
        </section>

        {/* HackathonSection - 데스크탑만 */}
        <section className="hidden w-full md:block">
          <HackathonSection />
        </section>

        {/* StudySection - 데스크탑만 */}
        <section className="hidden w-full md:block">
          <StudySection />
        </section>

        {/* NewsSection - 데스크탑만 */}
        <section className="hidden w-full md:block">
          <NewsSection />
        </section>

        {/* ServiceSection - 데스크탑만 */}
        <section className="hidden w-full md:block">
          <ServiceSection />
        </section>

        {/* CTASection - 데스크탑만 */}
        <div className="hidden w-full md:block">
          <CTASection />
        </div>
      </main>
    </div>
  );
}
