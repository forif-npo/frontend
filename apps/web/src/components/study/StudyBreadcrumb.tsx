"use client";

import { usePathname } from "next/navigation";
import { BreadHomeIcon } from "@repo/assets/icons/krds";
import { Breadcrumb } from "@ui/components/server/Breadcrumb";

export function StudyBreadcrumb() {
  const pathname = usePathname();

  const getBreadcrumbItems = () => {
    const items = [{ label: "홈", href: "/" }];

    if (pathname.startsWith("/studies")) {
      items.push({ label: "스터디 목록", href: "/studies/list" });

      if (pathname.includes("/detail/")) {
        const detailPath = pathname.split("/apply")[0]; // Get path before /apply

        if (pathname.includes("/apply")) {
          items.push({ label: "스터디 자세히 보기", href: detailPath });
          items.push({ label: "스터디 지원", href: pathname });
        } else {
          items.push({ label: "스터디 자세히 보기", href: pathname });
        }
      }
    }

    return items;
  };

  return (
    <div className="max-w-main mx-auto mb-3 mt-4 flex items-center md:mb-10 md:mt-6">
      <div className="flex items-center px-1">
        <BreadHomeIcon className="mb-0.5 h-4 w-4" />
        <Breadcrumb items={getBreadcrumbItems()} />
      </div>
    </div>
  );
}
