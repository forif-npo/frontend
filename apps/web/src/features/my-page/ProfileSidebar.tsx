"use client";

import { Body, Label } from "@ui/components/server";
import {
  CircleUser,
  ClipboardCheck,
  Package,
  Settings,
  UsersRound,
} from "@repo/assets/icons/lucide";
import Image from "next/image";
import { safeImageSrc } from "@/utils/image";

interface ProfileSidebarProps {
  profile: {
    user_name: string;
    department: string;
    user_id: number;
    role: string;
    img_url?: string | null;
  };
  activeNav: string;
  onNavChange: (nav: string) => void;
  /** 승인된 스터디를 운영하거나 개설 신청 이력이 있는 경우 활성화 */
  canManageStudyWorkspace?: boolean;
  /** 서비스 등록 신청 이력 또는 보유 서비스가 있는 경우 활성화 */
  canManageServiceWorkspace?: boolean;
}

export function ProfileSidebar({
  profile,
  activeNav,
  onNavChange,
  canManageStudyWorkspace = false,
  canManageServiceWorkspace = false,
}: ProfileSidebarProps) {
  const navItems = [
    {
      id: "my-studies",
      label: "내 스터디",
      Icon: ClipboardCheck,
      disabled: false,
    },
    ...(canManageStudyWorkspace
      ? [
          {
            id: "study-manage",
            label: "멘토 관리",
            Icon: UsersRound,
            disabled: false,
          },
        ]
      : []),
    ...(canManageServiceWorkspace
      ? [
          {
            id: "service-manage",
            label: "서비스 관리",
            Icon: Package,
            disabled: false,
          },
        ]
      : []),
    { id: "settings", label: "설정", Icon: Settings, disabled: false },
  ];

  return (
    <>
      <nav
        aria-label="마이페이지 메뉴"
        className="border-border-gray-light flex w-full gap-1 overflow-x-auto border-y px-4 md:hidden"
      >
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => !item.disabled && onNavChange(item.id)}
              disabled={item.disabled}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-4 text-left transition-colors ${
                isActive
                  ? "border-text-primary text-text-primary"
                  : item.disabled
                    ? "text-text-disabled cursor-not-allowed border-transparent"
                    : "text-text-subtle hover:text-text-basic border-transparent"
              }`}
            >
              <item.Icon className="h-5 w-5" strokeWidth={1.5} />
              <Body size="m">{item.label}</Body>
            </button>
          );
        })}
      </nav>

      <aside className="border-border-gray-light hidden w-[224px] shrink-0 flex-col items-center border-r px-6 py-10 md:flex">
        {/* Profile Picture */}
        <div className="relative mb-4">
          {safeImageSrc(profile.img_url) ? (
            <Image
              src={safeImageSrc(profile.img_url)!}
              alt={profile.user_name}
              width={120}
              height={120}
              unoptimized
              className="h-[120px] w-[120px] rounded-full object-cover"
            />
          ) : (
            <CircleUser
              className="text-gray-10 h-[120px] w-[120px]"
              strokeWidth={0.8}
            />
          )}
        </div>

        {/* User Info */}
        <div className="mb-4 flex flex-col items-center gap-0.5">
          <Label size="l" weight="bold" className="text-black">
            {profile.user_name}
          </Label>
          <Label size="xs" className="text-black">
            {profile.department}
          </Label>
          <Label size="xs" className="text-black">
            {profile.user_id}
          </Label>
        </div>

        <hr className="border-border-gray-light mb-4 w-full" />

        {/* Navigation */}
        <nav
          className="flex w-full flex-col gap-2"
          aria-label="마이페이지 메뉴"
        >
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => !item.disabled && onNavChange(item.id)}
                disabled={item.disabled}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-left transition-colors ${
                  isActive
                    ? "text-text-primary"
                    : item.disabled
                      ? "text-text-disabled cursor-not-allowed"
                      : "text-text-subtle hover:text-text-basic"
                }`}
              >
                <item.Icon className="h-6 w-6" strokeWidth={1.5} />
                <Body size="m">{item.label}</Body>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
