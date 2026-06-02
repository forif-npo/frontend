import { ArrowRight } from "@repo/assets/icons/lucide";
import { Badge, Body, Heading, Label } from "@ui/components/server";
import Link from "next/link";
import type { ServiceData } from "@/constants/home";

interface ServiceCardProps {
  service: ServiceData;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link
      href={service.link}
      className="rounded-3 border-border-gray bg-surface-white group flex min-w-[240px] flex-1 flex-col gap-4 border p-5 transition-shadow hover:shadow-md md:p-8"
    >
      <div>
        <Badge
          label={service.badge}
          variant="primary"
          appearance="solid-pastel"
        />
      </div>

      <div className="flex flex-col gap-3">
        <Heading size="s" className="text-text-basic">
          {service.title}
        </Heading>
        <Body size="m" className="text-text-subtle line-clamp-3">
          {service.description}
        </Body>
      </div>

      <div className="flex justify-end pt-2">
        <span className="flex items-center gap-1">
          <Label size="m" className="text-text-basic">
            바로가기
          </Label>
          <ArrowRight className="text-text-basic" size={20} />
        </span>
      </div>
    </Link>
  );
}
