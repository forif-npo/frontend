import type { Metadata } from "next";
import { ProductApplyView } from "@/features/products/ProductApplyView";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "서비스 등록 신청 | FORIF",
  description:
    "직접 만든 서비스를 신청하고 forif.org 서브도메인으로 소개하세요.",
};

export default function ProductApplyPage() {
  return (
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      <PageHeader
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "서비스", href: "/products" },
          { label: "서비스 등록 신청" },
        ]}
        title="서비스 등록 신청"
        description={
          <>
            직접 만든 서비스를 신청하면 운영진 검토 후{" "}
            <span className="font-bold">서브도메인(이름.forif.org)</span>과 함께
            목록에 소개됩니다.
          </>
        }
      />

      <ProductApplyView />
    </main>
  );
}
