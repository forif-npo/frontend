import type { Metadata } from "next";
import { auth } from "@/auth";
import { PageHeader } from "@/components/PageHeader";
import { ProductApplyView } from "@/features/products/ProductApplyView";
import { getMyProductApplications } from "@/features/products/api";
import { HTTPError } from "ky";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "서비스 등록 신청 수정 | FORIF",
};

interface ProductApplicationEditPageProps {
  params: Promise<{ applicationId: string }>;
}

export default async function ProductApplicationEditPage({
  params,
}: ProductApplicationEditPageProps) {
  const session = await auth();
  if (!session?.accessToken) {
    redirect("/signin");
  }

  const { applicationId } = await params;
  const id = Number(applicationId);
  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const applications = await getMyProductApplications(
    session.accessToken,
  ).catch((error: unknown) => {
    if (error instanceof HTTPError && error.response.status === 401) {
      redirect("/signin");
    }
    throw error;
  });
  const application = applications.find(
    (item) =>
      item.application_id === id &&
      (item.status === "PENDING" || item.status === "REJECTED"),
  );
  if (!application) {
    notFound();
  }

  return (
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      <PageHeader
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "마이페이지", href: "/my" },
          { label: "서비스 관리", href: "/my?section=service-manage" },
          { label: "서비스 등록 신청 수정" },
        ]}
        title="서비스 등록 신청 수정"
      />
      <ProductApplyView application={application} />
    </main>
  );
}
