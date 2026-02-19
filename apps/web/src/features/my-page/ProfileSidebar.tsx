"use client";

import { Body, Label, Divider } from "@ui/components/server";
import { LayoutGrid, FileText } from "lucide-react";

interface ProfileSidebarProps {
  profile: {
    user_name: string;
    department: string;
    user_id: number;
    role: "USER" | "MENTOR" | "ADMIN";
  };
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function ProfileSidebar({
  profile,
  activeTab,
  onTabChange,
}: ProfileSidebarProps) {
  const menuItems = [
    { id: "my-studies", label: "내 스터디", icon: LayoutGrid },
    { id: "applications", label: "신청서 목록", icon: FileText },
  ];

  // Convert role to Korean
  const roleLabel = profile.role === "USER" ? "부원" : "멘토";

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 px-8 py-8">
      {/* Profile Section */}
      <div className="mb-6 flex flex-col items-center gap-4">
        {/* User Info */}
        <div className="flex flex-col items-center gap-1">
          <Label size="l" className="font-bold">
            {profile.user_name}
          </Label>
          <Body size="s" className="text-gray-600">
            {roleLabel}
          </Body>
          <Body size="s" className="text-gray-600">
            {profile.department}
          </Body>
          <Body size="s" className="text-gray-600">
            {profile.user_id}
          </Body>
        </div>
      </div>

      <Divider className="my-6" />

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-3 rounded px-2 py-1 transition-colors ${
                isActive
                  ? "font-semibold text-blue-600"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              <Icon className="h-5 w-5" />
              <Label size="m">{item.label}</Label>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
