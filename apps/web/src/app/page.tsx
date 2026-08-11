import { CTASection } from "@/features/home/CTASection";
import { HackathonSection } from "@/features/home/HackathonSection";
import { NewsSection } from "@/features/home/NewsSection";
import { QuickMenu } from "@/features/home/QuickMenu";
import { StudySection } from "@/features/home/StudySection";
import { HOME_CAROUSEL_BANNERS } from "@/constants/home-carousel";
import { CriticalAlert } from "@repo/ui/components/client";
import { Carousel } from "@ui/components/client";
import { CarouselItem } from "@ui/components/client/Carousel";
import { Heading } from "@ui/components/server";
import Image from "next/image";

export default async function Page() {
  const carouselItems: CarouselItem[] = HOME_CAROUSEL_BANNERS.map((banner) => {
    if (banner.type === "tsx") {
      const BannerComponent = banner.component;
      return { id: banner.id, content: <BannerComponent /> };
    }

    const BannerComponent = banner.component;
    return {
      id: banner.id,
      content: <BannerComponent href={banner.href} image={banner.image} />,
    };
  });
  return (
    <div className="min-h-viewport overflow-x-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7faff_42%,#ffffff_100%)] md:bg-none">
      <main className="flex flex-col items-center gap-5 md:gap-8">
        <section className="max-w-main mb-2 mt-4 hidden w-full flex-col items-center gap-4 px-4 md:mb-0 md:mt-12 md:flex md:px-0">
          <CriticalAlert
            variant="information"
            link="/studies/list"
            text="매 학기 어떤 스터디가 열리는지 궁금하신가요?"
            title="스터디 목록으로 이동"
            detailText="자세히 보기"
            showArrow={false}
            className="shadow-sm"
          />
        </section>

        <section className="mx-auto w-full max-w-[1400px] px-4 py-4 md:my-6 md:flex md:flex-col md:items-center md:gap-4 md:px-0 md:py-0">
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

        <div className="flex w-full flex-col gap-9 md:gap-[90px]">
          {/* QuickMenu */}
          <section className="max-w-main mx-auto w-full px-4 lg:px-0">
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
        </div>

        {/* CTASection */}
        <div className="w-full">
          <CTASection />
        </div>
      </main>
    </div>
  );
}
