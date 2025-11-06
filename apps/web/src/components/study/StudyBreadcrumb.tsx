"use client";

import { usePathname } from "next/navigation";
import { BreadHomeIcon } from "@repo/assets/icons/krds";
import { Breadcrumb } from "@ui/components/server/Breadcrumb";

export function StudyBreadcrumb() {
  const pathname = usePathname();

  // Build breadcrumb items based on current path
  const getBreadcrumbItems = () => {
    const items = [{ label: "홈", href: "/" }];

    if (pathname.startsWith("/study")) {
      // Add "스터디 목록" for all study routes
      items.push({ label: "스터디 목록", href: "/study/list" });

      // If we're on a detail page, add "스터디 상세"
      if (pathname.includes("/detail/")) {
        items.push({ label: "스터디 상세 정보", href: pathname });
      }
    }

    return items;
  };

  return (
    <div className="mx-auto mb-10 mt-6 flex max-w-[1200px] items-center px-4">
      <BreadHomeIcon className="h-4 w-4" />
      <Breadcrumb items={getBreadcrumbItems()} />
    </div>
  );
}
