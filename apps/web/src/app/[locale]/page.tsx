import { CriticalAlert } from "@repo/ui/components/client";
import { Button, Carousel } from "@ui/components/client";
import { CarouselItem } from "@ui/components/client/Carousel";
import { getTranslations } from "next-intl/server";
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
        <section className="mb-10 mt-20 flex w-full max-w-[1200px] flex-col items-center gap-4">
          <CriticalAlert
            variant="information"
            link="/studies"
            text={t("alert.label")}
            title={t("alert.title")}
            detailText={t("alert.detail")}
          />
        </section>
        <section className="flex w-full max-w-[1400px] flex-col items-center gap-4">
          <Carousel carouselItems={carouselItems} />
        </section>
      </main>
    </div>
  );
}
