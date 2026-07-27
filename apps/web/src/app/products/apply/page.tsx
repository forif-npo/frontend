import type { Metadata } from "next";
import { ProductApplyView } from "@/features/products/ProductApplyView";

export const metadata: Metadata = {
  title: "프로덕트 등록 신청 | FORIF",
  description:
    "직접 만든 서비스를 신청하고 forif.org 서브도메인으로 소개하세요.",
};

export default function ProductApplyPage() {
  return (
    <div className="min-h-viewport">
      <ProductApplyView />
    </div>
  );
}
