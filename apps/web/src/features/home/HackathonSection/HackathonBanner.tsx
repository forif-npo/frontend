import { ArrowRight } from "@repo/assets/icons/lucide";
import { Body, Heading, Label } from "@ui/components/server";
import Image from "next/image";
import Link from "next/link";
import { hackathonBanner } from "@/constants/home";

export function HackathonBanner() {
  return (
    <div className="rounded-3 bg-secondary-5 flex h-full flex-col gap-10 p-8">
      <div className="flex flex-1 flex-col gap-4">
        <Heading size="m" className="text-text-basic">
          {hackathonBanner.title}
        </Heading>
        <Body size="m" className="text-text-subtle">
          {hackathonBanner.description}
        </Body>
        <Link
          href={hackathonBanner.ctaLink}
          className="inline-flex items-center gap-1"
        >
          <Label size="m" className="text-text-basic hover:underline">
            {hackathonBanner.ctaText}
          </Label>
          <ArrowRight size={20} className="text-text-basic" />
        </Link>
      </div>
      <div className="flex justify-end">
        <Image
          src="/images/default-study-img.png"
          alt="해커톤 배너 이미지"
          width={183}
          height={117}
          className="object-contain"
        />
      </div>
    </div>
  );
}
