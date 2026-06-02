import { Bone } from "./Bone";

/**
 * 공지사항 상세 페이지 스켈레톤
 */
export function AnnouncementDetailSkeleton() {
  return (
    <div>
      {/* Title */}
      <Bone className="mb-4 h-10 w-3/4" />

      {/* Meta row */}
      <div className="border-divider-gray-light mt-4 flex items-center justify-between border-b pb-4">
        <Bone className="h-4 w-40" />
        <Bone className="h-5 w-5 rounded-full" />
      </div>

      {/* Content */}
      <div className="mt-10 space-y-4">
        <Bone className="h-4 w-full" />
        <Bone className="h-4 w-full" />
        <Bone className="h-4 w-5/6" />
        <Bone className="h-4 w-full" />
        <Bone className="h-4 w-3/4" />
        <Bone className="h-4 w-full" />
        <Bone className="h-4 w-2/3" />
      </div>

      {/* Image placeholders */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Bone className="rounded-2 h-48 w-full" />
        <Bone className="rounded-2 h-48 w-full" />
      </div>

      {/* Back button */}
      <Bone className="rounded-3 mt-14 h-14 w-full" />
    </div>
  );
}
