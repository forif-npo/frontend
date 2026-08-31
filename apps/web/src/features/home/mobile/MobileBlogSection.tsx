import { CalendarDays } from "@repo/assets/icons/lucide";
import { FORIF_EXTERNAL_LINKS } from "@/constants/external-links";
import { MobileContentCard } from "./MobileContentCard";

export function MobileBlogSection() {
  return (
    <MobileContentCard
      icon={CalendarDays}
      title="기술 블로그"
      moreHref={FORIF_EXTERNAL_LINKS.medium}
      moreTarget="_blank"
      moreRel="noopener noreferrer"
      description="포리프는 자체 기술 블로그를 운영하고 있습니다. 미디움을 통해 확인할 수 있습니다."
      className="mb-6"
    />
  );
}
