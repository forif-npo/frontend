import { Bone } from "./Bone";

/**
 * FAQ 아코디언 목록 스켈레톤
 * - Accordion 컴포넌트 구조와 동일: border-t 위, 각 아이템 border-b, px-6 py-6
 */
export function FaqListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="border-divider-gray-light mt-6 border-t">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="border-divider-gray-light flex w-full items-center justify-between border-b px-6 py-6"
        >
          {/* 제목 */}
          <Bone className="h-5 w-2/3" />
          {/* 태그 + chevron */}
          <div className="ml-6 flex items-center gap-2">
            <Bone className="h-6 w-14 rounded-full" />
            <Bone className="h-6 w-6 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * 공지사항 목록 스켈레톤
 * - AnnouncementListItem 구조와 동일: border-t, py-6, 제목+날짜 좌측, 화살표 우측
 */
export function AnnouncementListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="mt-4 space-y-0">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="border-divider-gray-light flex w-full items-center justify-between gap-6 border-t py-6"
        >
          <div className="flex min-w-0 flex-col gap-2">
            <Bone className="h-5 w-64" />
            <Bone className="h-4 w-24" />
          </div>
          <Bone className="h-5 w-5 shrink-0" />
        </div>
      ))}
    </div>
  );
}

/**
 * @deprecated 이전 호환용. FaqListSkeleton 또는 AnnouncementListSkeleton 사용 권장
 */
export const SupportListSkeleton = FaqListSkeleton;
