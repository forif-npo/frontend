import { CalendarDays } from "@repo/assets/icons/lucide";
import Link from "next/link";
import { MobileContentCard } from "./MobileContentCard";

const SERVICES = [
  { icon: CalendarDays, label: "스터디 신청" },
  { icon: CalendarDays, label: "스터디 개설" },
  { icon: CalendarDays, label: "회계 공시" },
] as const;

export function MobileLoginSection() {
  return (
    <MobileContentCard className="gap-6">
      <div className="text-body-l text-text-basic leading-[1.5]">
        <Link href="/signup" className="text-text-primary font-bold underline">
          회원가입
        </Link>
        <span className="font-bold">하고 아래 서비스를</span>
        <br />
        <span className="font-bold">이용하세요.</span>
      </div>

      <div className="flex flex-col gap-4">
        {SERVICES.map((service) => (
          <div key={service.label} className="flex items-center gap-2">
            <service.icon
              size={24}
              strokeWidth={1.5}
              className="text-text-basic"
            />
            <span className="text-text-basic text-body-m font-bold leading-[1.5]">
              {service.label}
            </span>
          </div>
        ))}
      </div>

      <Link
        href="/login"
        className="text-text-inverse-static bg-button-primary-fill hover:bg-button-primary-fill-hover text-body-m flex h-12 w-full items-center justify-center rounded-md leading-[1.5] transition-colors"
      >
        로그인
      </Link>
    </MobileContentCard>
  );
}
