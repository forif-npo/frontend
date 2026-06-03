import { ArrowRight } from "@repo/assets/icons/lucide";
import { Body, Label } from "@ui/components/server";
import type { Submission } from "@core/types/hackathon";
import Image from "next/image";
import Link from "next/link";

interface HackathonCardProps {
  submission: Submission;
  bgColor?: string;
}

export function HackathonCard({
  submission,
  bgColor = "#e5e2ef",
}: HackathonCardProps) {
  return (
    <Link
      href={`/hackathon/archive/submissions/${submission.submission_id}`}
      className="group flex flex-col gap-6"
    >
      <div
        className="rounded-3 relative h-[196px] w-full overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        {submission.image_url ? (
          <Image
            src={submission.image_url}
            alt={submission.project_name}
            fill
            className="object-cover"
          />
        ) : (
          <Image
            src="/cutie.svg"
            alt={submission.project_name}
            fill
            className="object-contain p-4"
          />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label size="s" className="text-text-primary font-bold">
          {submission.team_name}
        </Label>
        <Body size="m" className="text-text-basic line-clamp-1 font-bold">
          {submission.project_name}
        </Body>
        <Body size="m" className="text-text-subtle line-clamp-2">
          {submission.summary}
        </Body>
      </div>
      <div className="inline-flex items-center gap-1">
        <Label size="m" className="text-text-basic group-hover:underline">
          자세히 보기
        </Label>
        <ArrowRight size={20} className="text-text-basic" />
      </div>
    </Link>
  );
}
