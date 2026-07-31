import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@ui/components/server";
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
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "홈", href: "/" },
            { label: "서비스", href: "/products" },
            { label: product.name },
          ]}
        />
      </div>
      <ProductDetailView product={product} />
    </main>
  );
}
