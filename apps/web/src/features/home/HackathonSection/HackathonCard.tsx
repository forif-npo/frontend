import { Body, Label } from "@ui/components/server";
import { cn } from "@ui/utils/cn";
import type { Submission } from "@core/types/hackathon";
import Image from "next/image";
import Link from "next/link";
import { safeImageSrc } from "@/utils/image";

interface HackathonCardProps {
  submission: Submission;
  imageBackgroundClassName?: string;
}

export function HackathonCard({
  submission,
  imageBackgroundClassName = "bg-graphic-10",
}: HackathonCardProps) {
  return (
    <Link
      href={`/hackathon/archive/submissions/${submission.submission_id}`}
      className="rounded-3 border-border-gray-light bg-surface-white focus-visible:outline-primary-50 group flex h-full flex-col overflow-hidden border transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <div
        className={cn(
          "relative h-[196px] w-full shrink-0 overflow-hidden",
          imageBackgroundClassName,
        )}
      >
        {safeImageSrc(submission.image_url) ? (
          <Image
            src={safeImageSrc(submission.image_url)!}
            alt={submission.project_name}
            fill
            unoptimized
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
      <div className="flex flex-1 flex-col gap-2 p-6">
        <Label size="s" className="text-text-primary font-bold">
          {submission.team_name}
        </Label>
        <Body size="m" className="text-text-basic line-clamp-1 font-bold">
          {submission.project_name}
        </Body>
        <Body size="m" className="text-text-subtle line-clamp-3">
          {submission.summary}
        </Body>
      </div>
    </Link>
  );
}
