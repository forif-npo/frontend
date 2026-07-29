import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/features/products/api";
import { ProductDetailView } from "@/features/products/ProductDetailView";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "서비스 | FORIF" };

  return {
    title: `${product.name} | FORIF 서비스`,
    description: product.one_liner,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-viewport">
      <ProductDetailView product={product} />
    </div>
  );
}
