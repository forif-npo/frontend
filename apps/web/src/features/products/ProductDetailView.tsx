import Link from "next/link";
import { Badge, Body, Heading, Label } from "@ui/components/server";
import {
  PRODUCT_SOURCE_LABELS,
  PRODUCT_OPERATION_STATUS_BADGE_VARIANTS,
} from "./constants";
import { PRODUCT_OPERATION_STATUS_LABELS } from "@core/products";
import type { ProductDetail } from "./api";
import { ProductThumbnail } from "./ProductThumbnail";

interface ProductDetailViewProps {
  product: ProductDetail;
}

/** 링크 주입 방지: http(s) URL만 렌더링한다 */
function safeExternalUrl(url: string | null): string | null {
  return url && /^https?:\/\//i.test(url) ? url : null;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const serviceUrl = safeExternalUrl(product.service_url);
  const githubUrl = safeExternalUrl(product.github_url);
  const isVisitable = product.operation_status === "LIVE" && !!serviceUrl;

  return (
    <div className="mx-auto max-w-[900px]">
      {/* 뒤로가기 */}
      <Link
        href="/products"
        className="text-text-subtle mb-6 inline-flex items-center gap-1 text-[15px] hover:underline"
      >
        ← 서비스 목록
      </Link>

      {/* 히어로 */}
      <ProductThumbnail
        slug={product.slug}
        name={product.name}
        thumbnailUrl={product.thumbnail_url}
        className="rounded-3 mb-8 h-[220px] w-full md:h-[320px]"
      />

      {/* 타이틀 영역 */}
      <div className="mb-8 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            label={PRODUCT_OPERATION_STATUS_LABELS[product.operation_status]}
            variant={
              PRODUCT_OPERATION_STATUS_BADGE_VARIANTS[product.operation_status]
            }
            appearance="solid-pastel"
            size="small"
          />
          <Badge
            label={PRODUCT_SOURCE_LABELS[product.source_type]}
            variant="info"
            appearance="solid-pastel"
            size="small"
          />
          {product.tags.map((tag) => (
            <Badge
              key={tag}
              label={tag}
              variant="primary"
              appearance="outline"
              size="small"
            />
          ))}
        </div>

        <Heading size="l" className="text-text-bolder">
          {product.name}
        </Heading>
        <Body size="l" className="text-text-basic">
          {product.one_liner}
        </Body>
        {product.source_label && (
          <Label size="s" className="text-text-subtle">
            {product.source_label}
          </Label>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="mb-10 flex flex-wrap gap-3">
        {isVisitable && serviceUrl && (
          <a
            href={serviceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-button-primary-fill hover:bg-button-primary-fill-hover text-text-inverse-static flex h-12 items-center justify-center rounded-[8px] px-6 text-[17px] font-bold transition-colors"
          >
            방문하기
          </a>
        )}
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border-button-secondary-border bg-button-secondary-fill hover:bg-button-secondary-fill-hover text-text-primary flex h-12 items-center justify-center rounded-[8px] border px-6 text-[17px] font-bold transition-colors"
          >
            GitHub
          </a>
        )}
      </div>

      {/* 소개 */}
      <section className="mb-10">
        <Heading size="xs" className="text-text-bolder mb-4">
          소개
        </Heading>
        <Body size="m" className="text-text-basic whitespace-pre-line">
          {product.description}
        </Body>
      </section>

      {/* 기술 스택 */}
      <section className="mb-10">
        <Heading size="xs" className="text-text-bolder mb-4">
          기술 스택
        </Heading>
        <div className="flex flex-wrap gap-2">
          {product.tech_stack.map((tech) => (
            <span
              key={tech}
              className="bg-surface-primary-subtler text-text-primary rounded-[6px] px-3 py-1.5 text-[15px] font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* 팀원 */}
      <section>
        <Heading size="xs" className="text-text-bolder mb-4">
          만든 사람들
        </Heading>
        <ul className="flex flex-col gap-2">
          {product.members.map((member) => (
            <li
              key={`${member.user_name}-${member.role_label}`}
              className="flex items-baseline gap-3"
            >
              <span className="text-text-bolder text-[17px] font-bold">
                {member.user_name}
              </span>
              <span className="text-text-subtle text-[15px]">
                {member.role_label}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
