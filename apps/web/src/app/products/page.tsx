import type { Metadata } from "next";
import { getProducts } from "@/features/products/api";
import { ProductsView } from "@/features/products/ProductsView";

export const metadata: Metadata = {
  title: "서비스 | FORIF",
  description: "FORIF 부원들이 만들어 운영 중인 서비스를 소개합니다.",
};

export default async function ProductsPage() {
  const products = await getProducts().catch(() => []);

  return (
    <div className="min-h-viewport">
      <ProductsView products={products} />
    </div>
  );
}
