import { Heading } from "@ui/components/server";
import { ArrowRight } from "@repo/assets/icons/lucide";
import Link from "next/link";
import { ctaData } from "@/constants/home";

export function CTASection() {
  return (
    <section className="w-full bg-gradient-to-r from-[#052561] to-[#86aff9] py-12 md:py-20">
      <div className="max-w-main mx-auto flex flex-col items-center px-6 py-6 text-center lg:px-0">
        <Heading size="l" className="mb-4 text-white">
          {ctaData.title}
        </Heading>
        <p className="text-body-m mb-6 w-full bg-gradient-to-r from-[rgba(255,255,255,0.5)] to-white bg-clip-text leading-[1.5] text-transparent">
          {ctaData.description}
        </p>
        <div className="pt-2">
          <Link
            href={ctaData.ctaLink}
            className="text-label-m inline-flex items-center gap-1 text-white transition-colors duration-200 hover:opacity-80"
          >
            {ctaData.ctaText}
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
