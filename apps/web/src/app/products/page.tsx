import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@ui/components/client";
import { getProducts } from "@/features/products/api";
import { ProductsView } from "@/features/products/ProductsView";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "서비스 | FORIF",
  description: "FORIF 부원들이 만들어 운영 중인 서비스를 소개합니다.",
};

export default async function ProductsPage() {
  const products = await getProducts().catch(() => []);

  return (
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      <PageHeader
        breadcrumbs={[{ label: "홈", href: "/" }, { label: "서비스" }]}
        title="서비스"
        description="FORIF 부원들이 스터디와 해커톤에서 만들어 실제로 운영 중인 서비스를 소개합니다."
        action={
          <Link href="/products/apply" className="w-fit shrink-0">
            <Button variant="primary" size="medium">
              서비스 등록 신청
            </Button>
          </Link>
        }
      />

      <ProductsView products={products} />
    </main>
  );
}
