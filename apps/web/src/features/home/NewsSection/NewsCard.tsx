import { Body } from "@ui/components/server";
import Link from "next/link";
import type { NewsData } from "@core/types/api";
import { ImageWithFallback } from "@/components/ImageWithFallback";

interface NewsCardProps {
  news: NewsData;
}

function getCtaLabel(category: NewsData["category"]): string {
  if (category === "faq") return "자주 묻는 질문 더 보기";
  return "자세히 보기";
}

export function NewsCard({ news }: NewsCardProps) {
  const ctaLabel = getCtaLabel(news.category);

  return (
    <Link
      href={news.link}
      className="border-border-gray bg-surface-white-subtle group flex h-[240px] min-h-[240px] gap-6 rounded-xl border p-8 transition-shadow hover:shadow-md"
    >
      {/* 썸네일 (로드 실패/부재 시 기본 이미지로 폴백) */}
      <div className="relative h-[176px] w-[200px] shrink-0 overflow-hidden rounded-lg max-sm:hidden">
        <ImageWithFallback
          src={news.thumbnail}
          alt={news.title}
          fill
          sizes="200px"
          className="object-cover"
        />
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex flex-1 flex-col justify-between overflow-hidden">
        <div>
          <Body
            size="l"
            className="text-text-basic mb-3 line-clamp-2 font-bold"
          >
            {news.title}
          </Body>
          <Body size="m" className="text-text-subtle line-clamp-2">
            {news.summary}
          </Body>
        </div>

        {/* CTA */}
        <div>
          <span className="text-text-basic inline-flex items-center gap-1 text-[17px] group-hover:underline">
            {ctaLabel}
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
