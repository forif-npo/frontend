import React from "react";

export const StudyCardSkeleton: React.FC = () => {
  return (
    <div className="flex w-full animate-pulse flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Image Skeleton */}
      <div className="h-[196px] w-full bg-gray-200" />

      {/* Content Section */}
      <div className="flex flex-col gap-4 p-8">
        {/* Badges Skeleton */}
        <div className="flex gap-1">
          <div className="h-6 w-16 rounded bg-gray-200" />
          <div className="h-6 w-20 rounded bg-gray-200" />
          <div className="h-6 w-24 rounded bg-gray-200" />
        </div>

        {/* Title Skeleton */}
        <div className="h-7 w-3/4 rounded bg-gray-200" />

        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
        </div>

        {/* Schedule Skeleton */}
        <div className="h-5 w-1/2 rounded bg-gray-200" />

        {/* Buttons Skeleton */}
        <div className="mt-2 flex justify-end gap-4">
          <div className="h-12 w-24 rounded-md bg-gray-200" />
          <div className="h-12 w-24 rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

export const StudyListSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, index) => (
        <StudyCardSkeleton key={index} />
      ))}
    </div>
  );
};
