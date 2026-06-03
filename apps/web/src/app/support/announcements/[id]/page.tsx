"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

import { ShareIcon } from "@repo/assets/icons/krds";
import { Breadcrumb } from "@ui/components/server";

import { useAnnouncementDetail } from "@/features/support/announcements/hooks/useAnnouncementDetail";
import { Button } from "@ui/components/client";
import { AnnouncementDetailSkeleton } from "@/components/skeleton/AnnouncementDetailSkeleton";

export default function AnnouncementDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
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
    <main className="max-w-main mx-auto w-full px-6 py-10">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "홈", href: "/" },
            { label: "지원", href: "/support" },
            { label: "공지사항", href: "/support/announcements" },
            { label: item?.title ?? "상세" },
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
              className="inline-flex items-center rounded-md p-1 hover:bg-gray-50"
              aria-label="링크 복사"
            >
              <ShareIcon className="h-5 w-5 text-gray-600" aria-hidden />
            </button>
          </div>

          {/* Content */}
          <div className="mt-10 space-y-6 text-[18px] leading-8 text-gray-900">
            <div className="whitespace-pre-wrap">{item.content}</div>
          </div>

          {/* Images */}
          {item.imageUrls?.length > 0 && (
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {item.imageUrls.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="overflow-hidden rounded-sm"
                >
                  <div className="flex justify-center">
                    <Image
                      src={url}
                      alt={`announcement-image-${idx + 1}`}
                      width={1200}
                      height={800}
                      className="h-auto w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Back button */}
          <div className="mt-14">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => router.push("/support/announcements")}
            >
              목록으로 돌아가기
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
