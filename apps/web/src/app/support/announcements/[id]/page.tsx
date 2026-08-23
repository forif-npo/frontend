"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useMemo } from "react";

import { ShareIcon } from "@repo/assets/icons/krds";
import { Breadcrumb } from "@ui/components/server";

import { useAnnouncementDetail } from "@/features/support/announcements/hooks/useAnnouncementDetail";
import { AnnouncementDetailSkeleton } from "@/components/skeleton/AnnouncementDetailSkeleton";
import { MarkdownContent } from "@/components/MarkdownContent";
import { safeImageSrc } from "@/utils/image";

export default function AnnouncementDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const { item, isLoading, errorMessage } = useAnnouncementDetail(id);

  const dateOnly = useMemo(() => {
    if (!item?.createdAt) return "";
    const d = new Date(item.createdAt);
    return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
  }, [item?.createdAt]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // clipboard 실패해도 조용히 무시
    }
  };

  return (
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "홈", href: "/" },
            { label: "공지", href: "/support" },
            { label: "공지사항", href: "/support/announcements" },
            { label: "자세히 보기" },
          ]}
        />
      </div>

      {isLoading && <AnnouncementDetailSkeleton />}
      {errorMessage && !isLoading && (
        <div className="py-12 text-center text-sm text-red-600">
          {errorMessage}
        </div>
      )}
      {!isLoading && !errorMessage && !item && (
        <div className="py-12 text-center text-sm text-gray-500">
          공지사항을 찾을 수 없습니다.
        </div>
      )}

      {item && (
        <div>
          {/* Title */}
          <h1 className="text-[34px] font-semibold leading-tight text-gray-900">
            {item.title}
          </h1>

          {/* Meta row + link icon */}
          <div className="border-divider-gray-light mt-4 flex items-center justify-between border-b pb-4">
            <div className="text-[16px] text-gray-600">
              {dateOnly} {item.authorName}
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className="hover:bg-surface-gray-subtler active:bg-surface-gray-subtle inline-flex items-center rounded-md p-1 transition-colors"
              aria-label="링크 복사"
            >
              <ShareIcon className="h-5 w-5 text-gray-600" aria-hidden />
            </button>
          </div>

          {/* Content */}
          <div className="mt-10">
            <MarkdownContent content={item.content} />
          </div>

          {/* Images */}
          {item.imageUrls?.length > 0 && (
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {item.imageUrls.map((url, idx) => {
                const src = safeImageSrc(url);
                if (!src) return null;
                return (
                  <div
                    key={`${url}-${idx}`}
                    className="overflow-hidden rounded-sm"
                  >
                    <div className="flex justify-center">
                      <Image
                        src={src}
                        alt={`announcement-image-${idx + 1}`}
                        width={1200}
                        height={800}
                        className="h-auto w-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
