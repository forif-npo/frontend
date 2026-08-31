"use client";

import Link from "next/link";
import { Tabs, Button } from "@ui/components/client";
import { Badge, EmptyState } from "@ui/components/server";
import { ProductCard } from "@/features/products/ProductCard";
import { ProductThumbnail } from "@/features/products/ProductThumbnail";
import { PRODUCT_SOURCE_LABELS } from "@/features/products/constants";
import { PRODUCT_APPLICATION_STATUS_LABELS } from "@core/products";
import type {
  ProductApplication,
  ProductSummary,
} from "@/features/products/api";

interface ServiceManageSectionProps {
  applications: ProductApplication[];
  products: ProductSummary[];
}

const APPLICATION_STATUS_VARIANTS = {
  PENDING: "warning",
  ACCEPTED: "success",
  REJECTED: "danger",
} as const;

function ApplicationCard({ application }: { application: ProductApplication }) {
  const content = (
    <article className="rounded-3 border-border-gray-light bg-surface-white flex min-w-[240px] flex-col overflow-hidden border transition-shadow hover:shadow-md">
      <ProductThumbnail
        slug={application.slug}
        name={application.name}
        thumbnailUrl={application.thumbnail_url}
        className="h-[196px] w-full"
      />
      <div className="flex flex-1 flex-col gap-4 px-8 py-8">
        <div className="flex flex-wrap gap-2">
          <Badge
            label={PRODUCT_APPLICATION_STATUS_LABELS[application.status]}
            variant={APPLICATION_STATUS_VARIANTS[application.status]}
            appearance="solid-pastel"
            size="small"
          />
          <Badge
            label={PRODUCT_SOURCE_LABELS[application.source_type]}
            variant="info"
            appearance="solid-pastel"
            size="small"
          />
          {application.tech_stack.slice(0, 2).map((tech) => (
            <Badge
              key={tech}
              label={tech}
              variant="primary"
              appearance="outline"
              size="small"
            />
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-text-basic line-clamp-1 text-[17px] font-bold leading-[1.5]">
            {application.name}
          </p>
          <p className="text-text-subtle line-clamp-2 text-[17px] leading-[1.5]">
            {application.one_liner}
          </p>
          <p className="text-text-subtle mt-auto text-[15px]">
            {application.slug}.forif.org · {application.applied_at} 신청
          </p>
        </div>
        {application.status === "REJECTED" && application.reject_reason && (
          <div className="bg-surface-danger-subtler text-text-danger rounded-2 p-3 text-[14px] leading-[1.6]">
            <span className="font-bold">반려 사유</span> ·{" "}
            {application.reject_reason}
          </div>
        )}
      </div>
    </article>
  );

  return application.status === "PENDING" ? (
    <Link
      href={`/products/applications/${application.application_id}/edit`}
      className="focus-visible:ring-primary block focus-visible:outline-none focus-visible:ring-2"
    >
      {content}
    </Link>
  ) : (
    content
  );
}

function ApplicationList({
  applications,
}: {
  applications: ProductApplication[];
}) {
  const sortedApplications = [...applications].sort(
    (first, second) =>
      new Date(second.applied_at).getTime() -
      new Date(first.applied_at).getTime(),
  );

  if (sortedApplications.length === 0) {
    return (
      <EmptyState
        title="신청한 서비스가 없습니다."
        className="py-20"
        titleClassName="text-lg"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {sortedApplications.map((application) => (
        <ApplicationCard
          key={application.application_id}
          application={application}
        />
      ))}
    </div>
  );
}

function MyServices({ applications, products }: ServiceManageSectionProps) {
  const productBySlug = new Map(
    products.map((product) => [product.slug, product]),
  );
  const myProducts = applications
    .filter((application) => application.status === "ACCEPTED")
    .map((application) => productBySlug.get(application.slug))
    .filter((product): product is ProductSummary => Boolean(product));

  if (myProducts.length === 0) {
    return (
      <EmptyState
        title="아직 승인된 서비스가 없습니다."
        className="py-20"
        titleClassName="text-lg"
        actions={
          <Link href="/products/apply">
            <Button variant="primary" size="medium">
              서비스 등록 신청
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {myProducts.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}

export function ServiceManageSection({
  applications,
  products,
}: ServiceManageSectionProps) {
  return (
    <Tabs
      tabs={[
        {
          label: "서비스 신청내역",
          content: <ApplicationList applications={applications} />,
        },
        {
          label: "내 서비스",
          content: (
            <MyServices applications={applications} products={products} />
          ),
        },
      ]}
    />
  );
}
