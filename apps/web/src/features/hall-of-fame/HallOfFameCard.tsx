import Image from "next/image";
import Link from "next/link";
import { Award } from "lucide-react";
import type { HallOfFameEntry } from "@core/types/hall-of-fame";

export function HallOfFameCard({ entry }: { entry: HallOfFameEntry }) {
  return (
    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="bg-surface-secondary-subtler relative aspect-[4/3] overflow-hidden">
        {entry.image_url ? (
          <Image
            src={entry.image_url}
            alt={`${entry.member_name} 대표 이미지`}
            fill
            unoptimized
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="text-text-subtle flex h-full flex-col items-center justify-center gap-2">
            <Award className="h-10 w-10" />
            <span className="text-sm">사진 준비 중</span>
          </div>
        )}
      </div>
      <div className="space-y-3 p-5">
        <p className="text-text-subtle text-sm">{entry.semester_label}</p>
        <div>
          <h2 className="break-words text-xl font-bold">{entry.member_name}</h2>
          {entry.headline && (
            <p className="mt-1 break-words font-medium">{entry.headline}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {entry.badges.slice(0, 4).map((badge, index) => (
            <span
              key={`${badge}-${index}`}
              className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold"
            >
              {badge}
            </span>
          ))}
        </div>
        {entry.introduction && (
          <p className="text-text-secondary line-clamp-3 whitespace-pre-wrap break-words text-sm leading-6">
            {entry.introduction}
          </p>
        )}
        <Link
          href={`/hall-of-fame/${encodeURIComponent(entry.slug)}`}
          className="focus-visible:ring-primary inline-flex rounded-sm text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2"
        >
          자세히 보기
          <span className="sr-only">: {entry.member_name}</span>
        </Link>
      </div>
    </article>
  );
}
