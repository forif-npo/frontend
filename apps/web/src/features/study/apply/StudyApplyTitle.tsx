import { Badge } from "@ui/components/server";

type BadgeTag = {
  label: string;
  variant: "primary" | "success" | "warning" | "danger" | "disabled";
};

interface StudyApplyTitleProps {
  studyName: string;
  tags: BadgeTag[];
}

export function StudyApplyTitle({ studyName, tags }: StudyApplyTitleProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:gap-6">
      <h1 className="text-[28px] font-bold leading-[1.5] tracking-[1px] sm:text-[40px]">
        <span className="text-secondary line-clamp-2">{studyName}</span>
        <span className="text-text-basic">스터디 신청</span>
      </h1>

      <div className="flex items-center gap-1">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            label={tag.label}
            variant={tag.variant}
            appearance="solid-pastel"
            size="large"
          />
        ))}
      </div>
    </div>
  );
}
