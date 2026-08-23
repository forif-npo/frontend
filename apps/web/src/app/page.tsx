import { CTASection } from "@/features/home/CTASection";
import { HackathonSection } from "@/features/home/HackathonSection";
import { NewsSection } from "@/features/home/NewsSection";
import { QuickMenu } from "@/features/home/QuickMenu";
import { StudySection } from "@/features/home/StudySection";
import { ForifIntroBanner } from "@/features/home/banners/ForifIntroBanner";
import { HOME_CAROUSEL_BANNERS } from "@/constants/home-carousel";
import { Carousel } from "@ui/components/client";
import { CarouselItem } from "@ui/components/client/Carousel";
import { Heading } from "@ui/components/server";
import Image from "next/image";

export default async function Page() {
  const carouselItems: CarouselItem[] = HOME_CAROUSEL_BANNERS.map((banner) => {
    if (banner.type === "tsx") {
      const BannerComponent = banner.component;
      return {
        id: banner.id,
        content: <BannerComponent />,
        mobileAspect: banner.mobileAspect,
      };
    }

    const BannerComponent = banner.component;
    return {
      id: banner.id,
      content: <BannerComponent href={banner.href} image={banner.image} />,
      mobileAspect: banner.mobileAspect,
    };
  });
  const mobileCarouselItems = carouselItems.filter(
    (banner) => banner.id !== "forif-intro",
  );

  return (
    <div className="min-h-viewport overflow-x-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7faff_42%,#ffffff_100%)] md:bg-none">
      <main className="flex flex-col items-center gap-5 md:gap-8">
        <section className="hidden w-full md:flex md:flex-col md:items-center md:gap-4">
          <Carousel
            carouselItems={carouselItems}
            bannerClassName="max-w-none rounded-none"
          />
        </section>
        <section className="mb-2 w-full md:hidden">
          <Carousel
            carouselItems={mobileCarouselItems}
            bannerClassName="max-w-none rounded-none"
          />
        </section>
        <section className="-mb-5 w-full md:hidden">
          <ForifIntroBanner variant="mobile-section" />
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
