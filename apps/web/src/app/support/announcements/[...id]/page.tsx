"use client";

import { Breadcrumb } from "../../../../../../../packages/ui/src/components/server/Breadcrumb";
import { useParams } from "next/navigation";
import { useAnnouncementDetail } from "@/features/support/announcements/hooks/useAnnouncementDetail";
import Image from "next/image";

export default function AnnouncementDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const { item, isLoading, errorMessage } = useAnnouncementDetail(id);

  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-10">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "홈", href: "/" },
            { label: "지원", href: "/support" },
            { label: "공지사항", href: "/support/announcement" },
            { label: item?.title ?? "상세" },
          ]}
        />
      </div>

      {isLoading && (
        <div className="py-12 text-center text-sm text-gray-500">
          불러오는 중...
        </div>
      )}

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
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {new Date(item.created_at).toLocaleString()}
            </span>
          </div>

          <h1 className="text-xl font-semibold text-gray-900">{item.title}</h1>

          <div className="mt-6">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-gray-800">
              {item.content}
            </pre>
          </div>

          {item.image_urls?.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {item.image_urls.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="overflow-hidden rounded-lg border border-gray-200"
                >
                  <Image
                    src={url}
                    alt={`announcement-image-${idx + 1}`}
                    width={1200}
                    height={800}
                    className="h-auto w-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
