"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Body, Heading } from "@ui/components/server";
import { PRODUCT_SOURCE_FILTERS, type ProductSourceFilter } from "./constants";
import type { ProductSummary } from "./types";
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
    <div className="max-w-main mx-auto px-4 py-10 sm:px-6 md:py-16">
      {/* 헤더 */}
      <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <Heading size="l" className="text-text-bolder">
            프로덕트
          </Heading>
          <Body size="l" className="text-text-basic">
            FORIF 부원들이 스터디와 해커톤에서 만들어 실제로 서비스 중인
            프로덕트를 소개합니다.
          </Body>
        </div>
        <Link
          href="/products/apply"
          className="flex h-12 w-fit shrink-0 items-center justify-center rounded-[8px] bg-[#0b50d0] px-6 text-[17px] font-bold text-white transition-colors hover:bg-[#063a74]"
        >
          프로덕트 등록 신청
        </Link>
      </div>

      {/* 출처 필터 탭 */}
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
          <p className="text-lg">해당하는 프로덕트가 아직 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
