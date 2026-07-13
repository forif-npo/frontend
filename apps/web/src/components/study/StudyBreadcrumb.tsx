"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb } from "@ui/components/server";

type StudyBreadcrumbItem = {
  label: string;
  href?: string;
};

export function StudyBreadcrumb() {
  const pathname = usePathname();

  const getBreadcrumbItems = () => {
    const items: StudyBreadcrumbItem[] = [
      { label: "홈", href: "/" },
      { label: "스터디" },
    ];

    if (pathname.startsWith("/studies/list")) {
      items.push({ label: "스터디 목록", href: "/studies/list" });
    }

    if (pathname.startsWith("/studies/guide")) {
      items.push({ label: "스터디 가이드", href: "/studies/guide" });
    }

    if (pathname.startsWith("/studies/create")) {
      items.push({ label: "스터디 개설", href: "/studies/create" });
    }

    if (pathname.includes("/detail/")) {
      const detailPath = pathname.split("/apply")[0]; // Get path before /apply

      items.push({ label: "스터디 목록", href: "/studies/list" });

      if (pathname.includes("/apply")) {
        items.push({ label: "스터디 자세히 보기", href: detailPath });
        items.push({ label: "스터디 지원", href: pathname });
      } else {
        items.push({ label: "스터디 자세히 보기", href: pathname });
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
