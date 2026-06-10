import { TERMS_OF_SERVICE } from "@/constants/legal";
import { LegalDocument } from "@/features/legal/LegalDocument";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "서비스 이용약관",
  description: "FORIF 서비스 이용약관입니다.",
};

export default function TermsPage() {
  return (
    <LegalDocument
      title="서비스 이용약관"
      content={TERMS_OF_SERVICE}
      effectiveDate="2024년 1월 1일"
    />
  );
}
