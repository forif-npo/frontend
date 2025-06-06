import { CriticalAlert } from "@repo/ui/components/client";
import { Button, Carousel } from "@ui/components/client";
import { CarouselItem } from "@ui/components/client/Carousel";
import { Heading } from "@ui/components/server";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
export default async function Page() {
  const t = await getTranslations("HomePage");
  const carouselItems: CarouselItem[] = [
    {
      imageSrc: "/images/carousel/carousel-img-1.png",
      title: t("carousel.item_0.title"),
      description: t("carousel.item_0.description"),
      footer: (
        <div className="flex flex-row gap-4">
          <Button>{t("carousel.item_0.footer.detail")}</Button>
          <Button variant="tertiary">
            {t("carousel.item_0.footer.apply_operator")}
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className="min-h-screen">
      <main className="flex flex-col items-center gap-8 sm:items-start">
        <section className="mt-20 flex w-full max-w-[1200px] flex-col items-center gap-4">
          <CriticalAlert
            variant="information"
            link="/studies"
            text={t("alert.label")}
            title={t("alert.title")}
            detailText={t("alert.detail")}
          />
        </section>
        <section className="my-10 flex w-full max-w-[1400px] flex-col items-center gap-4">
          <Carousel carouselItems={carouselItems} />
        </section>
        <div className="mb-16 h-[240px] w-full bg-gradient-to-r from-[#0b50d0] to-white">
          <div className="mx-auto flex h-full max-w-[1200px] justify-center sm:flex-col">
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
        <section className="w-full max-w-[1200px]">
          <Heading size="l" className="text-text-basic mb-6">
            자주찾는 메뉴
          </Heading>
          <div className="flex flex-col items-start gap-4">
            <Button>포리프 소개</Button>
            <Button variant="secondary">포리프 운영진 지원하기</Button>
          </div>
        </section>
      </main>
    </div>
  );
}
