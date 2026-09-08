import Image from "next/image";
import type { AlimTalkTemplate } from "./types";

interface AlimTalkPreviewProps {
  template: AlimTalkTemplate | undefined;
  variables: Record<string, string>;
}

function renderMessage(content: string, variables: Record<string, string>) {
  return content.split(/(#\{[^}]+\})/g).map((part, index) => {
    const value = variables[part]?.trim();

    if (part.match(/^#\{[^}]+\}$/) && value) {
      return <strong key={`${part}-${index}`}>{value}</strong>;
    }

    return part;
  });
}

function getPreviewLinkHref(link: string, variables: Record<string, string>) {
  const hasMissingVariable = (link.match(/#\{[^}]+\}/g) ?? []).some(
    (variable) => !variables[variable]?.trim(),
  );
  if (hasMissingVariable) return null;

  const resolvedLink = link
    .replace(/#\{[^}]+\}/g, (variable) => variables[variable]?.trim() ?? "")
    .trim();

  try {
    const url = new URL(resolvedLink);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export function AlimTalkPreview({ template, variables }: AlimTalkPreviewProps) {
  return (
    <section className="rounded-md border p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">알림톡 미리보기</h2>
        {template && (
          <span className="text-muted-foreground text-xs">미리보기</span>
        )}
      </div>

      <div className="bg-secondary-20 mx-auto max-w-sm overflow-hidden rounded-xl p-4 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl">
            <Image
              src="/images/forif-circle.svg"
              alt="FORIF"
              width={48}
              height={48}
              className="size-full"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-foreground text-lg font-medium">FORIF</p>
            </div>
            <p className="text-muted-foreground truncate text-sm">
              한양대학교 성동구 왕십리로 222 대운동장 B214
            </p>
          </div>
        </div>

        <div className="relative max-w-[92%] overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="bg-warning-20 text-warning-90 px-4 py-2 text-sm font-semibold">
            알림톡 도착
          </div>
          <p className="text-foreground whitespace-pre-wrap break-words px-4 py-5 text-sm leading-6">
            {template
              ? renderMessage(template.content, variables)
              : "템플릿을 선택하면 알림톡 내용을 미리 볼 수 있습니다."}
          </p>
          {template?.buttonLinks.length ? (
            <div className="space-y-2 px-4 pb-4">
              {template.buttonLinks.map((link, index) => {
                const href = getPreviewLinkHref(link, variables);
                const label =
                  template.buttonLinks.length === 1
                    ? "링크 바로가기"
                    : `링크 ${index + 1} 바로가기`;
                const className =
                  "border-border bg-muted/40 text-foreground flex min-h-11 w-full items-center justify-center rounded-md border px-3 py-2 text-sm font-medium";

                return href ? (
                  <a
                    key={`${link}-${index}`}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className={className}
                  >
                    {label}
                  </a>
                ) : (
                  <span
                    key={`${link}-${index}`}
                    aria-disabled="true"
                    className={`${className} text-muted-foreground cursor-not-allowed`}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          ) : null}
        </div>
        <p className="text-muted-foreground mt-1 text-right text-xs">방금</p>
      </div>

      <p className="text-muted-foreground mt-4 text-center text-xs">
        미리보기는 실제 카카오톡 화면과 다를 수 있습니다.
      </p>
    </section>
  );
}
