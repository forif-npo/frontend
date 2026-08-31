"use client";

import { Tabs } from "@ui/components/client";
import { EmptyState } from "@ui/components/server";
import { PRODUCT_SOURCE_FILTERS, type ProductSourceFilter } from "./constants";
import type { ProductSummary } from "./api";
import { ProductCard } from "./ProductCard";

interface ProductsViewProps {
  products: ProductSummary[];
}

function ProductGrid({ products }: { products: ProductSummary[] }) {
  if (products.length === 0) {
    return (
      <EmptyState
        className="py-24"
        title="해당하는 서비스가 아직 없습니다"
        titleClassName="text-lg"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}

export function ProductsView({ products }: ProductsViewProps) {
  const tabs = PRODUCT_SOURCE_FILTERS.map((filter) => {
    const filteredProducts =
      filter.value === "ALL"
        ? products
        : products.filter(
            (product) =>
              product.source_type === (filter.value as ProductSourceFilter),
          );

    return {
      label: filter.label,
      content: <ProductGrid products={filteredProducts} />,
    };
  });

  return (
    <section aria-label="서비스 목록">
      <Tabs tabs={tabs} />
    </section>
  );
}
