import { Body, Heading } from "@ui/components/server";

interface LegalDocumentProps {
  title: string;
  content: string;
  effectiveDate?: string;
}

/**
 * 약관/방침 등 긴 본문 텍스트를 보여주는 공통 레이아웃.
 * 원본은 줄바꿈이 의미를 가지므로 whitespace-pre-line으로 그대로 렌더한다.
 */
export function LegalDocument({
  title,
  content,
  effectiveDate,
}: LegalDocumentProps) {
  return (
    <main className="mx-auto w-full max-w-[800px] px-5 py-12 sm:px-6 lg:px-0 lg:py-16">
      <Heading size="l" className="text-text-basic mb-2">
        {title}
      </Heading>
      {effectiveDate && (
        <Body size="s" className="text-text-subtle mb-8">
          시행일: {effectiveDate}
        </Body>
      )}
      <Body
        size="s"
        className="text-text-subtle whitespace-pre-line leading-relaxed"
      >
        {content}
      </Body>
    </main>
  );
}
