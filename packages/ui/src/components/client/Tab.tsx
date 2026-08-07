"use client";
import React, { useState } from "react";
import { Label } from "../server/Label";

export interface TabProps {
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabProps[];
}

const Tab: React.FC<{
  label: string;
  isSelected: boolean;
  onClick: () => void;
  id: string;
  panelId: string;
  disabled?: boolean;
}> = ({ label, isSelected, onClick, id, panelId, disabled }) => {
  return (
    <button
      role="tab"
      aria-selected={isSelected}
      aria-controls={panelId}
      id={id}
      onClick={onClick}
      disabled={disabled}
      className={`focus-visible:ring-border-gray-dark relative flex h-12 min-w-16 items-center justify-center whitespace-nowrap border-b-[3px] px-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 ${
        isSelected ? "border-border-secondary" : "border-transparent"
      } ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : "hover:border-border-secondary/30 cursor-pointer"
      }`}
    >
      <Label
        className={
          disabled
            ? "text-disabled-on cursor-not-allowed"
            : isSelected
              ? "text-text-secondary cursor-pointer"
              : "text-text-secondary hover:text-text-subtle cursor-pointer"
        }
        size="m"
        weight="bold"
      >
        {label}
      </Label>
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
      className={`pt-6 md:pt-8 ${isSelected ? "" : "hidden"}`}
    >
      {children}
    </div>
  );
};

export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="w-full">
      <div
        role="tablist"
        aria-label="Tab Navigation"
        className="border-gray-20 flex border-b"
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            isSelected={index === selectedTab}
            onClick={() => setSelectedTab(index)}
            id={`tab-${index}`}
            panelId={`panel-${index}`}
            disabled={tab.disabled}
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
