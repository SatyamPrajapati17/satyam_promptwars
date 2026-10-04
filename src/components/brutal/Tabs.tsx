"use client";

import React from "react";
import clsx from "clsx";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  badge?: string;
  hasDot?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div
      className={clsx(
        "flex flex-wrap gap-2 border-b-2 border-black pb-2 select-none",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              "px-3.5 py-1.5 font-bold text-xs uppercase tracking-wider border-2 border-black transition-all flex items-center gap-2 cursor-pointer",
              isActive
                ? "bg-black text-[#FFE600] shadow-[3px_3px_0_#000] translate-x-[-1px] translate-y-[-1px]"
                : "bg-white text-black hover:bg-yellow-100 shadow-[2px_2px_0_#000]"
            )}
          >
            {tab.hasDot && (
              <span className="w-2 h-2 rounded-full bg-[#E10600] border border-black" />
            )}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={clsx(
                  "px-1.5 py-0.2 text-[10px] font-mono border border-current",
                  isActive ? "bg-white text-black" : "bg-black text-white"
                )}
              >
                {tab.count}
              </span>
            )}
            {tab.badge && (
              <span className="text-[10px] font-mono px-1 bg-yellow-300 text-black border border-black">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

