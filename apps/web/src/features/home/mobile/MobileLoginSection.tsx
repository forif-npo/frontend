import { CalendarDays } from "@repo/assets/icons/lucide";
import Link from "next/link";

const SERVICES = [
  { icon: CalendarDays, label: "스터디 신청" },
  { icon: CalendarDays, label: "스터디 개설" },
  { icon: CalendarDays, label: "회계 공시" },
] as const;

export function MobileLoginSection() {
  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-[#cdd1d5] p-6 shadow-[0px_0px_2px_0px_rgba(0,0,0,0.05),0px_4px_8px_0px_rgba(0,0,0,0.08)]">
      {/* Title */}
      <div className="text-[19px] leading-[1.5] text-black">
        <Link href="/signup" className="font-bold text-[#0b50d0] underline">
          회원가입
        </Link>
        <span className="font-bold">하고 아래 서비스를</span>
        <br />
        <span className="font-bold">이용하세요.</span>
      </div>

      {/* Service List */}
      <div className="flex flex-col gap-4">
        {SERVICES.map((service) => (
          <div key={service.label} className="flex items-center gap-2">
            <service.icon
              size={24}
              strokeWidth={1.5}
              className="text-text-basic"
            />
            <span className="text-[17px] font-bold leading-[1.5] text-black">
              {service.label}
            </span>
          </div>
        ))}
      </div>

      {/* Login Button */}
      <Link
        href="/login"
        className="flex h-12 w-full items-center justify-center rounded-md bg-[#256ef4] text-[17px] leading-[1.5] text-white"
      >
        로그인
      </Link>
    </div>
  );
}
