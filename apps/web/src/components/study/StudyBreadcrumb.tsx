"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb } from "@ui/components/server";

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
    <div className="mb-6">
      <Breadcrumb items={getBreadcrumbItems()} />
    </div>
  );
}
