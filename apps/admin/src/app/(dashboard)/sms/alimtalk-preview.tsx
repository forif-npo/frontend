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

export function AlimTalkPreview({ template, variables }: AlimTalkPreviewProps) {
  return (
    <section className="rounded-md border p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">알림톡 미리보기</h2>
        {template && (
          <span className="text-muted-foreground text-xs">미리보기</span>
        )}
      </div>

      <div className="mx-auto max-w-sm overflow-hidden rounded-xl bg-[#b8ccdc] p-4 shadow-sm">
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
              <p className="text-lg font-medium text-slate-950">FORIF</p>
            </div>
            <p className="truncate text-sm text-slate-700">
              한양대학교 성동구 왕십리로 222 대운동장 B214
            </p>
          </div>
        </div>

        <div className="relative max-w-[92%] overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="bg-[#fee500] px-4 py-2 text-sm font-semibold text-[#3b2f00]">
            알림톡 도착
          </div>
          <p className="whitespace-pre-wrap break-words px-4 py-5 text-sm leading-6 text-slate-800">
            {template
              ? renderMessage(template.content, variables)
              : "템플릿을 선택하면 알림톡 내용을 미리 볼 수 있습니다."}
          </p>
        </div>
        <p className="mt-1 text-right text-xs text-slate-600">방금</p>
      </div>

      <p className="text-muted-foreground mt-4 text-center text-xs">
        미리보기는 실제 카카오톡 화면과 다를 수 있습니다.
      </p>
    </section>
  );
}
