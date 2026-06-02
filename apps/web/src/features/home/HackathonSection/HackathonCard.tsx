import { ArrowRight } from "@repo/assets/icons/lucide";
import { Body, Label } from "@ui/components/server";
import type { Hackathon } from "@core/types/hackathon";
import Image from "next/image";
import Link from "next/link";

interface HackathonCardProps {
  hackathon: Hackathon;
  bgColor?: string;
}

function getSemesterLabel(hackathon: Hackathon) {
  return `${hackathon.held_year}-${hackathon.held_semester} / ${hackathon.event_round}회`;
}

function getDateRangeLabel(hackathon: Hackathon) {
  const startsAt = new Date(hackathon.starts_at);
  const endsAt = new Date(hackathon.ends_at);

  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
    return "아카이브 보기";
  }

  return `${startsAt.toLocaleDateString("ko-KR", {
    month: "numeric",
    day: "numeric",
  })} - ${endsAt.toLocaleDateString("ko-KR", {
    month: "numeric",
    day: "numeric",
  })}`;
}

export function HackathonCard({
  hackathon,
  bgColor = "#e5e2ef",
}: HackathonCardProps) {
  return (
    <Link href="/hackathon/archive" className="group flex flex-col gap-6">
      <div
        className="rounded-3 relative h-[196px] w-full overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        <Image
          src="/cutie.svg"
          alt={hackathon.title}
          fill
          className="object-contain p-4"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label size="s" className="text-text-primary font-bold">
          {getSemesterLabel(hackathon)}
        </Label>
        <Body size="m" className="text-text-basic line-clamp-1 font-bold">
          {hackathon.title}
        </Body>
        <Body size="m" className="text-text-subtle line-clamp-2">
          {hackathon.description ?? "FORIF 해커톤 아카이브를 확인해보세요."}
        </Body>
      </div>
      <div className="inline-flex items-center gap-1">
        <Label size="m" className="text-text-basic group-hover:underline">
          {getDateRangeLabel(hackathon)}
        </Label>
        <ArrowRight size={20} className="text-text-basic" />
      </div>
    </Link>
  );
}
