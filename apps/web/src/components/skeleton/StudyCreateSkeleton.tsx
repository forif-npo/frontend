import { Bone } from "./Bone";

/**
 * 스터디 생성 폼 스켈레톤
 */
export function StudyCreateSkeleton() {
  return (
    <div className="mx-auto flex max-w-[792px] justify-center px-4 py-10 sm:px-6">
      <div className="w-full space-y-8">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Bone key={i} className="h-2 w-12 rounded-full" />
          ))}
        </div>

        {/* Title */}
        <Bone className="h-8 w-48" />

        {/* Form fields */}
        <div className="space-y-6">
          <div>
            <Bone className="mb-2 h-4 w-24" />
            <Bone className="rounded-2 h-12 w-full" />
          </div>
          <div>
            <Bone className="mb-2 h-4 w-32" />
            <Bone className="rounded-2 h-12 w-full" />
          </div>
          <div>
            <Bone className="mb-2 h-4 w-28" />
            <Bone className="rounded-2 h-12 w-full" />
          </div>
          <div>
            <Bone className="mb-2 h-4 w-20" />
            <Bone className="rounded-2 h-12 w-2/3" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Bone className="rounded-3 h-12 w-24" />
          <Bone className="rounded-3 h-12 w-24" />
        </div>
      </div>
    </div>
  );
}
