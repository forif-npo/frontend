"use client";

import { useState, useEffect } from "react";
import { Button } from "@ui/components/client";

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
  { id: "process", label: "신청 방법 및 절차" },
  { id: "criteria", label: "지원 대상 선정 기준" },
  { id: "location", label: "부가 정보" },
  { id: "resources", label: "관련 자료" },
];

export function StudyDetailNavigation({
  studyName,
  onApply,
  isApplyDisabled = false,
}: StudyDetailNavigationProps) {
  const [activeSection, setActiveSection] = useState<string>("overview");

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map((item) => ({
        id: item.id,
        element: document.getElementById(item.id),
      }));

      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element) {
          const offsetTop = section.element.offsetTop;
          if (scrollPosition >= offsetTop) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="sticky top-[120px] hidden h-fit w-[160px] shrink-0 gap-4 md:flex md:flex-col">
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
                ? "bg-[#eef2f7] font-bold text-[#052b57]"
                : "text-text-subtle hover:bg-[#f4f5f6]"
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
