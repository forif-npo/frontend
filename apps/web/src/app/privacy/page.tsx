import { PRIVACY_POLICY } from "@/constants/legal";
import { LegalDocument } from "@/features/legal/LegalDocument";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description: "FORIF 개인정보 처리방침입니다.",
};

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="개인정보 처리방침"
      content={PRIVACY_POLICY}
      effectiveDate="2024년 1월 1일"
    />
  );
}
