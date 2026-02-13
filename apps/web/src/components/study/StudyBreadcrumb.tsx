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
        const detailPath = pathname.split("/apply")[0]; // Get path before /apply

        // If we're on the apply page
        if (pathname.includes("/apply")) {
          items.push({ label: "스터디 정보 확인", href: detailPath });
          items.push({ label: "스터디 신청", href: pathname });
        } else {
          items.push({ label: "스터디 정보 확인", href: pathname });
        }
      }
    }

    return items;
  };

  return (
    <div className="mx-auto mb-3 mt-4 flex max-w-[1200px] items-center md:mb-10 md:mt-6">
      <div className="flex items-center px-1">
        <BreadHomeIcon className="mb-1 h-4 w-4" />
        <Breadcrumb items={getBreadcrumbItems()} />
      </div>
    </div>
  );
}
