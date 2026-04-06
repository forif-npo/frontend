"use client";

import { Body, Label } from "@ui/components/server";
import Image from "next/image";
import { CircleUser, Pencil } from "lucide-react";

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
}

function TaskSquareIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.37 8.88H17.62"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.38 8.88L7.13 9.63L9.38 7.38"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.37 15.88H17.62"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.38 15.88L7.13 16.63L9.38 14.38"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProfileUsersIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.16 10.87C9.06 10.86 8.94 10.86 8.83 10.87C6.45 10.79 4.56 8.84 4.56 6.44C4.56 3.99 6.54 2 9 2C11.45 2 13.44 3.99 13.44 6.44C13.43 8.84 11.54 10.79 9.16 10.87Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.41 4C18.35 4 19.91 5.57 19.91 7.5C19.91 9.39 18.41 10.93 16.54 11C16.46 10.99 16.37 10.99 16.28 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.16 14.56C1.74 16.18 1.74 18.82 4.16 20.43C6.91 22.27 11.42 22.27 14.17 20.43C16.59 18.81 16.59 16.17 14.17 14.56C11.43 12.73 6.92 12.73 4.16 14.56Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.34 20C19.06 19.85 19.74 19.56 20.3 19.13C21.86 17.96 21.86 16.03 20.3 14.86C19.75 14.44 19.08 14.16 18.37 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SettingIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12.88V11.12C2 10.08 2.85 9.22 3.9 9.22C5.71 9.22 6.45 7.94 5.54 6.37C5.02 5.47 5.33 4.3 6.24 3.78L7.97 2.79C8.76 2.32 9.78 2.6 10.25 3.39L10.36 3.58C11.26 5.15 12.74 5.15 13.65 3.58L13.76 3.39C14.23 2.6 15.25 2.32 16.04 2.79L17.77 3.78C18.68 4.3 18.99 5.47 18.47 6.37C17.56 7.94 18.3 9.22 20.11 9.22C21.15 9.22 22.01 10.07 22.01 11.12V12.88C22.01 13.92 21.16 14.78 20.11 14.78C18.3 14.78 17.56 16.06 18.47 17.63C18.99 18.54 18.68 19.7 17.77 20.22L16.04 21.21C15.25 21.68 14.23 21.4 13.76 20.61L13.65 20.42C12.75 18.85 11.27 18.85 10.36 20.42L10.25 20.61C9.78 21.4 8.76 21.68 7.97 21.21L6.24 20.22C5.33 19.7 5.02 18.53 5.54 17.63C6.45 16.06 5.71 14.78 3.9 14.78C2.85 14.78 2 13.92 2 12.88Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const navItems = [
  {
    id: "my-studies",
    label: "내 스터디",
    Icon: TaskSquareIcon,
    disabled: false,
  },
  {
    id: "study-manage",
    label: "스터디 관리",
    Icon: ProfileUsersIcon,
    disabled: true,
  },
  { id: "settings", label: "설정", Icon: SettingIcon, disabled: true },
];

export function ProfileSidebar({
  profile,
  activeNav,
  onNavChange,
}: ProfileSidebarProps) {
  return (
    <aside className="hidden w-[224px] shrink-0 flex-col items-center border-r border-[#cdd1d5] px-6 py-10 md:flex">
      {/* Profile Picture */}
      <div className="relative mb-4">
        {profile.img_url ? (
          <Image
            src={profile.img_url}
            alt={profile.user_name}
            width={120}
            height={120}
            className="h-[120px] w-[120px] rounded-full object-cover"
          />
        ) : (
          <CircleUser
            className="h-[120px] w-[120px] text-[#E6E8EA]"
            strokeWidth={0.8}
          />
        )}
        <button className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-black p-2 shadow-sm">
          <Pencil className="h-full w-full text-white" />
        </button>
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

      <hr className="mb-4 w-full border-[#cdd1d5]" />

      {/* Navigation */}
      <nav className="flex w-full flex-col gap-2">
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
              <item.Icon className="h-6 w-6" />
              <Body size="m">{item.label}</Body>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
