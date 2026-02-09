import { SignInForm } from "@/features/auth/signin/signin-form";
import { Body, Heading } from "@ui/components/server";
import Image from "next/image";
export default async function Page() {
  return (
    <main className="min-h-screen">
      <div className="flex h-screen">
        <section className="relative hidden w-1/2 flex-col items-start justify-center bg-gradient-to-br from-blue-500 to-blue-900 p-16 text-white md:flex">
          <Image
            src={"/star.svg"}
            width={90}
            height={90}
            alt="stars"
            className="mb-8"
          />
          <h1 className="mb-4 text-3xl font-bold leading-snug">
            반가워요
            <br />
            FORIF 운영진 여러분! 👋🏻
          </h1>
          <p className="mb-auto text-base">
            한양대학교 중앙 프로그래밍 동아리 FORIF의 운영진이 되신 것을
            축하드려요.
          </p>
          <footer className="absolute bottom-8 text-sm opacity-70">
            © 2025 FORIF. All rights reserved
          </footer>
        </section>
        <section className="flex flex-col justify-center bg-white p-24 md:w-1/2">
          <Heading size="l" className="mb-2 text-2xl font-semibold">
            Hello Operators!
          </Heading>
          <Body size="s" className="mb-6 text-sm text-gray-600">
            FORIF 운영진을 위한 관리자 페이지입니다. 계정이 존재하지 않는다면
            해당 학기 회장단/SW팀에게 계정 생성을 문의해주세요.
          </Body>
          <SignInForm />
        </section>
      </div>
    </main>
  );
}
