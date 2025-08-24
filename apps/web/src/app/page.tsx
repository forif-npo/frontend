import { CriticalAlert } from "@repo/ui/components/client";
import { Button, Carousel } from "@ui/components/client";
import { CarouselItem } from "@ui/components/client/Carousel";
import { Heading } from "@ui/components/server";
import Image from "next/image";

export default async function Page() {
  const todos = await fetch("https://api.forif.org/posts")
    .then((res) => res.json())
    .catch((reason) => console.error("Failed to fetch posts:", reason));
  console.log(todos);
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
  return (
    <div className="min-h-screen">
      <main className="flex flex-col items-center gap-8 sm:items-start">
        <section className="mt-20 flex w-full max-w-[1200px] flex-col items-center gap-4">
          <CriticalAlert
            variant="information"
            link="/studies"
            text="스터디 신청 절차를 자세히 알고 싶으신가요?"
            title="스터디 신청 절차 안내 페이지로 이동"
            detailText="자세히보기"
          />
        </section>
        <section className="my-10 flex w-full max-w-[1400px] flex-col items-center gap-4">
          <Carousel carouselItems={carouselItems} />
        </section>
        <div className="mb-16 h-[240px] w-full bg-gradient-to-r from-[#0b50d0] to-white">
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
