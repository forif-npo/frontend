import { ArrowRight } from "@repo/assets/icons/lucide";
import { Body, Label } from "@ui/components/server";
import Image from "next/image";
import Link from "next/link";
import type { HackathonData } from "@/mocks/data/home";

interface HackathonCardProps {
  hackathon: HackathonData;
  bgColor?: string;
}

export function HackathonCard({
  hackathon,
  bgColor = "#e5e2ef",
}: HackathonCardProps) {
  return (
    <Link href={hackathon.link} className="group flex flex-col gap-6">
      <div
        className="rounded-3 relative h-[196px] w-full overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        <Image
          src={hackathon.thumbnail}
          alt={hackathon.title}
          fill
          className="object-contain p-4"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Body size="m" className="text-text-basic line-clamp-1 font-bold">
          {hackathon.title}
        </Body>
        <Body size="m" className="text-text-subtle line-clamp-2">
          {hackathon.description}
        </Body>
      </div>
      <div className="inline-flex items-center gap-1">
        <Label size="m" className="text-text-basic group-hover:underline">
          {hackathon.date}
        </Label>
        <ArrowRight size={20} className="text-text-basic" />
      </div>
    </Link>
  );
}
