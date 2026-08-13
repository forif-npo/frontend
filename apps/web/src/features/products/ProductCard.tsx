import Link from "next/link";
import { Badge, Body, Heading, Label } from "@ui/components/server";
import {
  PRODUCT_SOURCE_LABELS,
  PRODUCT_STATUS_BADGE_VARIANTS,
  PRODUCT_STATUS_LABELS,
} from "./constants";
import type { ProductSummary } from "./api";
import { ProductThumbnail } from "./ProductThumbnail";

interface ProductCardProps {
  product: ProductSummary;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="rounded-3 border-border-gray-light bg-surface-white group flex flex-col overflow-hidden border transition-shadow hover:shadow-md"
    >
      <ProductThumbnail
        slug={product.slug}
        name={product.name}
        thumbnailUrl={product.thumbnail_url}
        className="h-[176px] w-full md:h-[196px]"
      />

      <div className="flex flex-1 flex-col gap-2 p-4 md:gap-3 md:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            label={PRODUCT_STATUS_LABELS[product.status]}
            variant={PRODUCT_STATUS_BADGE_VARIANTS[product.status]}
            appearance="solid-pastel"
            size="small"
          />
          <Badge
            label={PRODUCT_SOURCE_LABELS[product.source_type]}
            variant="info"
            appearance="solid-pastel"
            size="small"
          />
          {product.tags.slice(0, 2).map((tag) => (
            <Badge
              key={tag}
              label={tag}
              variant="primary"
              appearance="outline"
              size="small"
            />
          ))}
        </div>

        <Heading size="xs" className="text-text-bolder">
          {product.name}
        </Heading>
        <Body size="m" className="text-text-basic line-clamp-2">
          {product.one_liner}
        </Body>

        {product.source_label && (
          <Label size="s" className="text-text-subtle mt-auto">
            {product.source_label}
          </Label>
        )}
      </div>
    </Link>
  );
}
