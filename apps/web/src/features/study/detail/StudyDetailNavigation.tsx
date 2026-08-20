"use client";

import { Button } from "@ui/components/client";

import { useScrollSpy } from "@/hooks/useScrollSpy";

interface NavItem {
  id: string;
  label: string;
}

interface StudyDetailNavigationProps {
  studyName: string;
  onApply: () => void;
  isApplyDisabled?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "스터디 개요" },
  { id: "intro", label: "스터디 상세 소개" },
  { id: "curriculum", label: "커리큘럼" },
  { id: "process", label: "신청 방법" },
  { id: "location", label: "부가 정보" },
];

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

export function StudyDetailNavigation({
  studyName,
  onApply,
  isApplyDisabled = false,
}: StudyDetailNavigationProps) {
  const activeSection = useScrollSpy(SECTION_IDS, { offset: 150 });

  // 각 섹션에 scroll-mt가 지정되어 있어 scrollIntoView가 여백까지 처리한다.
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="sticky top-[120px] hidden h-fit w-[160px] shrink-0 gap-4 self-start md:flex md:flex-col">
      <div className="flex flex-col gap-1">
        <p className="text-text-basic text-[13px] leading-[1.5]">스터디 정보</p>
        <p className="text-text-bolder text-[17px] font-bold leading-[1.5]">
          {studyName}
        </p>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`cursor-pointer rounded-[4px] px-2 py-1 text-left text-[15px] leading-[1.5] transition-colors ${
              activeSection === item.id
                ? "bg-surface-secondary-subtler text-text-secondary font-bold"
                : "text-text-subtle hover:bg-surface-gray-subtler"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex flex-col gap-2">
        <Button
          variant="primary"
          size="medium"
          onClick={onApply}
          disabled={isApplyDisabled}
          className="h-10 w-full cursor-pointer"
        >
          신청하기
        </Button>
      </div>
    </div>
  );
}
