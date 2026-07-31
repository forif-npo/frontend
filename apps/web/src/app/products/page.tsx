import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@ui/components/client";
import { Body, Breadcrumb, Heading } from "@ui/components/server";
import { getProducts } from "@/features/products/api";
import { ProductsView } from "@/features/products/ProductsView";

export const metadata: Metadata = {
  title: "서비스 | FORIF",
  description: "FORIF 부원들이 만들어 운영 중인 서비스를 소개합니다.",
};

export default async function ProductsPage() {
  const products = await getProducts().catch(() => []);

  return (
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      <div className="mb-6">
        <Breadcrumb items={[{ label: "홈", href: "/" }, { label: "서비스" }]} />
      </div>

      <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <Heading size="l" className="text-text-bolder">
            서비스
          </Heading>
          <Body size="l" className="text-text-basic">
            FORIF 부원들이 스터디와 해커톤에서 만들어 실제로 운영 중인 서비스를
            소개합니다.
          </Body>
        </div>
        <Link href="/products/apply" className="w-fit shrink-0">
          <Button variant="primary" size="medium">
            서비스 등록 신청
          </Button>
        </Link>
      </div>

      <ProductsView products={products} />
    </main>
  );
}
