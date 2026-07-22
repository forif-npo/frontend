import type { Metadata } from "next";
import { getProducts } from "@/features/products/api";
import { ProductsView } from "@/features/products/ProductsView";

export const metadata: Metadata = {
  title: "프로덕트 | FORIF",
  description: "FORIF 부원들이 만들어 서비스 중인 프로덕트를 소개합니다.",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-viewport">
      <ProductsView products={products} />
    </div>
  );
}
