import Image from "next/image";
import Link from "next/link";
import { Award, ExternalLink } from "lucide-react";
import type { HallOfFameEntry } from "@core/types/hall-of-fame";

function safeExternalUrl(url: string | null) {
  return url && /^https?:\/\//i.test(url) ? url : null;
}

export function HallOfFameDetailView({ entry }: { entry: HallOfFameEntry }) {
  const achievements = [...entry.achievements].sort(
    (a, b) => a.display_order - b.display_order,
  );

  return (
    <article className="mx-auto max-w-[960px]">
      <Link
        href="/hall-of-fame"
        className="text-text-subtle focus-visible:ring-primary mb-6 inline-flex rounded-sm text-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2"
      >
        ← 명예의 전당 목록
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="min-w-0 space-y-10">
          <header>
            <p className="text-primary-60 text-sm font-bold">
              {entry.semester_label}
            </p>
            <h1 className="text-text-basic text-title-xxl-mobile sm:text-title-xxl mt-2 break-words font-bold">
              {entry.member_name}
            </h1>
            {entry.headline && (
              <p className="text-text-secondary mt-3 break-words text-lg font-semibold leading-7">
                {entry.headline}
              </p>
            )}
            {entry.badges.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2" aria-label="주요 활동">
                {entry.badges.map((badge, index) => (
                  <span
                    key={`${badge}-${index}`}
                    className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-semibold"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </header>

          {entry.introduction && (
            <section aria-labelledby="hall-of-fame-introduction">
              <h2
                id="hall-of-fame-introduction"
                className="text-title-l-mobile sm:text-title-l text-text-basic font-bold"
              >
                이야기
              </h2>
              <p className="text-text-basic mt-4 whitespace-pre-wrap break-words text-base leading-8">
                {entry.introduction}
              </p>
            </section>
          )}

          {achievements.length > 0 && (
            <section aria-labelledby="hall-of-fame-achievements">
              <h2
                id="hall-of-fame-achievements"
                className="text-title-l-mobile sm:text-title-l text-text-basic font-bold"
              >
                주요 활동과 성취
              </h2>
              <ol className="mt-4 space-y-4">
                {achievements.map((achievement) => {
                  const linkUrl = safeExternalUrl(achievement.link_url);
                  return (
                    <li
                      key={achievement.achievement_id}
                      className="border-border-gray rounded-2xl border bg-white p-5"
                    >
                      <h3 className="text-text-basic break-words font-bold">
                        {achievement.title}
                      </h3>
                      {achievement.description && (
                        <p className="text-text-secondary mt-2 whitespace-pre-wrap break-words text-sm leading-6">
                          {achievement.description}
                        </p>
                      )}
                      {linkUrl && (
                        <a
                          href={linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-60 focus-visible:ring-primary mt-3 inline-flex items-center gap-1 rounded-sm text-sm font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2"
                        >
                          관련 내용 보기
                          <ExternalLink className="h-4 w-4" aria-hidden />
                        </a>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          )}
        </div>

        <aside className="border-border-gray overflow-hidden rounded-2xl border bg-white lg:sticky lg:top-24">
          <div className="bg-surface-secondary-subtler relative aspect-[4/3] overflow-hidden">
            {entry.image_url ? (
              <Image
                src={entry.image_url}
                alt={`${entry.member_name} 대표 이미지`}
                fill
                priority
                unoptimized
                sizes="(max-width: 1023px) 100vw, 320px"
                className="object-cover"
              />
            ) : (
              <div className="text-text-subtle flex h-full flex-col items-center justify-center gap-2">
                <Award className="h-12 w-12" aria-hidden />
                <span className="text-sm">사진 준비 중</span>
              </div>
            )}
          </div>
          <div className="p-5">
            <p className="text-text-subtle text-sm">FORIF 활동 학기</p>
            <p className="text-text-basic mt-1 font-bold">
              {entry.semester_label}
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}
