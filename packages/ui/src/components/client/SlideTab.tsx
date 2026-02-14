"use client";
import React, { useState } from "react";
import { Heading } from "../server";

export interface SlideTabProps {
  label: string;
  content: React.ReactNode;
}

interface SlideTabsProps {
  tabs: SlideTabProps[];
}

const SlideTab: React.FC<{
  label: string;
  isSelected: boolean;
  onClick: () => void;
  id: string;
  panelId: string;
  isFirst?: boolean;
  isLast?: boolean;
}> = ({ label, isSelected, onClick, id, panelId, isFirst, isLast }) => {
  return (
    <button
      role="tab"
      aria-selected={isSelected}
      aria-controls={panelId}
      id={id}
      onClick={onClick}
      className={`relative flex-1 cursor-pointer px-6 py-3 transition-all duration-200 ease-in-out focus:outline-none ${
        isSelected
          ? "bg-secondary-70 hover:bg-secondary-80 active:bg-secondary-90"
          : "bg-surface-white hover:bg-surface-gray-subtler active:bg-surface-gray-subtle border-border-gray border"
      } ${
        isFirst && isLast
          ? "rounded-2"
          : isFirst
            ? "rounded-l-2 border-r-0"
            : isLast
              ? "rounded-r-2 border-l-0"
              : "border-l-0 border-r-0"
      }`}
    >
      <Heading
        className={`${
          isSelected ? "text-text-inverse-static" : "text-text-basic"
        }`}
        size="s"
      >
        {label}
      </Heading>
      {isSelected && <span className="sr-only">선택됨</span>}
    </button>
  );
};

const TabPanel: React.FC<{
  children: React.ReactNode;
  id: string;
  tabId: string;
  isSelected: boolean;
}> = ({ children, id, tabId, isSelected }) => {
  return (
    <div
      role="tabpanel"
      id={id}
      aria-labelledby={tabId}
      className={`${isSelected ? "" : "hidden"}`}
    >
      {children}
    </div>
  );
};

export const SlideTabs: React.FC<SlideTabsProps> = ({ tabs }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="w-full">
      <div
        role="tablist"
        aria-label="Tab Navigation"
        className="rounded-2 flex w-full overflow-hidden"
      >
        {tabs.map((tab, index) => (
          <SlideTab
            key={index}
            label={tab.label}
            isSelected={index === selectedTab}
            onClick={() => setSelectedTab(index)}
            id={`tab-${index}`}
            panelId={`panel-${index}`}
            isFirst={index === 0}
            isLast={index === tabs.length - 1}
          />
        ))}
      </div>
      {tabs.map((tab, index) => (
        <TabPanel
          key={index}
          id={`panel-${index}`}
          tabId={`tab-${index}`}
          isSelected={index === selectedTab}
        >
          {tab.content}
        </TabPanel>
      ))}
    </div>
  );
};
