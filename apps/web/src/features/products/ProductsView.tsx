"use client";

import { useMemo, useState } from "react";
import { PRODUCT_SOURCE_FILTERS, type ProductSourceFilter } from "./constants";
import type { ProductSummary } from "./api";
import { ProductCard } from "./ProductCard";

interface ProductsViewProps {
  products: ProductSummary[];
}

export function ProductsView({ products }: ProductsViewProps) {
  const [sourceFilter, setSourceFilter] = useState<ProductSourceFilter>("ALL");

  const filtered = useMemo(() => {
    if (sourceFilter === "ALL") return products;
    return products.filter((product) => product.source_type === sourceFilter);
  }, [products, sourceFilter]);

  return (
    <section aria-label="서비스 목록">
      <div className="mb-6 flex gap-4 border-b border-[#cdd1d5] md:mb-8">
        {PRODUCT_SOURCE_FILTERS.map((filter) => {
          const isActive = sourceFilter === filter.value;
          return (
            <button
              key={filter.value}
              onClick={() => setSourceFilter(filter.value)}
              className={`flex h-[48px] min-w-[64px] items-center justify-center whitespace-nowrap border-b-[3px] px-2 text-[17px] font-bold leading-[1.5] transition-colors ${
                isActive
                  ? "border-[#063a74] text-[#052b57]"
                  : "border-transparent text-[#052b57] hover:border-[#063a74]/30"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* 카드 그리드 */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-500">
          <p className="text-lg">해당하는 서비스가 아직 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
