import Image from "next/image";
import { Award } from "lucide-react";
import type { HallOfFameFormState } from "./form";

interface HallOfFamePreviewProps {
  form: HallOfFameFormState;
  imageUrl?: string | null;
}

export function HallOfFamePreview({ form, imageUrl }: HallOfFamePreviewProps) {
  const achievements = form.achievements.filter((item) => item.title.trim());
  const badges = form.badges.map((badge) => badge.trim()).filter(Boolean);

  return (
    <section
      aria-label="명예의 전당 미리보기"
      className="bg-muted/30 overflow-hidden rounded-xl border"
    >
      <div className="grid gap-6 p-5 md:grid-cols-[220px_1fr] md:p-8">
        <div className="bg-muted relative aspect-[4/5] overflow-hidden rounded-xl">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${form.memberName || "전시 인물"} 미리보기`}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 text-sm">
              <Award className="h-10 w-10" />
              <span>등록된 사진이 없습니다</span>
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-5">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">
              {form.actYear || "연도"}-{form.actSemester} · 명예의 전당
            </p>
            <h2 className="break-words text-2xl font-bold">
              {form.memberName || "회원 이름"}
            </h2>
            <p className="break-words text-lg font-semibold">
              {form.title || "전시 제목"}
            </p>
          </div>

          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2" aria-label="배지">
              {badges.map((badge, index) => (
                <span
                  key={`${badge}-${index}`}
                  className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          <p className="text-muted-foreground whitespace-pre-wrap break-words leading-7">
            {form.introduction || "소개가 여기에 표시됩니다."}
          </p>

          {achievements.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">주요 성취</h3>
              <ol className="space-y-3">
                {achievements.map((achievement, index) => (
                  <li
                    key={`${achievement.title}-${index}`}
                    className="rounded-lg border bg-white p-4"
                  >
                    <p className="break-words font-medium">
                      {achievement.title}
                    </p>
                    {achievement.description.trim() && (
                      <p className="text-muted-foreground mt-1 whitespace-pre-wrap break-words text-sm">
                        {achievement.description}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
