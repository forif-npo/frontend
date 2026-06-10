import { CTASection } from "@/features/home/CTASection";
import { HackathonSection } from "@/features/home/HackathonSection";
import { NewsSection } from "@/features/home/NewsSection";
import { QuickMenu } from "@/features/home/QuickMenu";
import { ServiceSection } from "@/features/home/ServiceSection";
import { StudySection } from "@/features/home/StudySection";
import { CriticalAlert } from "@repo/ui/components/client";
import { Button, Carousel } from "@ui/components/client";
import { CarouselItem } from "@ui/components/client/Carousel";
import { Heading } from "@ui/components/server";
import Image from "next/image";
import Link from "next/link";

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
        <div className="flex flex-row gap-3 max-sm:flex-col sm:gap-4">
          <Link href="/club/" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">자세히 보러가기</Button>
          </Link>
          <Link href="/club/recruit" className="w-full sm:w-auto">
            <Button variant="tertiary" className="w-full sm:w-auto">
              운영진 지원하기
            </Button>
          </Link>
        </div>
      ),
    },
  ];
  return (
    <div className="min-h-viewport overflow-x-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7faff_42%,#ffffff_100%)] md:bg-none">
      <main className="main-gap flex flex-col items-center">
        <section className="alert-section max-w-main flex w-full flex-col items-center gap-4">
          <CriticalAlert
            variant="information"
            link="/studies/list"
            text="스터디 신청 절차를 자세히 알고 싶으신가요?"
            title="스터디 신청 절차 안내 페이지로 이동"
            detailText="자세히 보기"
            className="shadow-sm"
          />
        </section>

        <section className="mx-auto w-full max-w-[1400px] px-4 py-6 md:my-10 md:flex md:flex-col md:items-center md:gap-4 md:px-0 md:py-0">
          <Carousel carouselItems={carouselItems} />
        </section>

        {/* Supported By */}
        <div className="mb-6 w-full bg-gradient-to-br from-[#0b50d0] via-[#4f86ea] to-white py-10 md:mb-16 md:h-[240px] md:bg-gradient-to-r md:py-0">
          <div className="max-w-main mx-auto flex h-full flex-col justify-center gap-6 px-4 md:gap-0 md:px-8 lg:px-0">
            <Heading size="m" className="mb-6 text-left text-white">
              Supported by
            </Heading>
            <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center md:gap-20">
              <Image
                src="hyu.svg"
                alt="Hanyang University Logo"
                width={296}
                height={64}
                className="h-auto w-[220px] md:w-[296px]"
              />
              <Image
                src="elice.svg"
                alt="Elice company Logo"
                width={191}
                height={32}
                className="h-auto w-[150px] md:w-[191px]"
              />
            </div>
          </div>
        </div>

        {/* QuickMenu */}
        <section className="max-w-main mx-auto w-full px-4">
          <QuickMenu />
        </section>

        {/* HackathonSection */}
        <section className="w-full">
          <HackathonSection />
        </section>

        {/* StudySection */}
        <section className="w-full">
          <StudySection />
        </section>

        {/* NewsSection */}
        <section className="w-full">
          <NewsSection />
        </section>

        {/* ServiceSection */}
        <section className="w-full">
          <ServiceSection />
        </section>

        {/* CTASection */}
        <div className="w-full">
          <CTASection />
        </div>
      </main>
    </div>
  );
}
