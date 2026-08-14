import type { Metadata } from "next";
import { ProductApplyComplete } from "@/features/products/ProductApplyComplete";

export const metadata: Metadata = {
  title: "서비스 등록 신청 완료 | FORIF",
};

export default function ProductApplyCompletePage() {
  return (
    <main className="max-w-main mx-auto w-full px-4 pt-10 lg:px-0">
      <ProductApplyComplete />
    </main>
  );
}
