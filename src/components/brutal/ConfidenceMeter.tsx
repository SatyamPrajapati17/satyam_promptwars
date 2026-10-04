"use client";

import React from "react";
import clsx from "clsx";

export interface ConfidenceMeterProps {
  value: number;
  label?: string;
  className?: string;
}

export function ConfidenceMeter({
  value,
  label = "STATED CONFIDENCE",
  className,
}: ConfidenceMeterProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));

  const getTone = (val: number) => {
    if (val >= 80) return { bg: "bg-emerald-400", label: "HIGH" };
    if (val >= 50) return { bg: "bg-[#FFE600]", label: "MODERATE" };
    return { bg: "bg-[#FF6B6B]", label: "CAUTIOUS" };
  };

  const tone = getTone(clamped);

  return (
    <div
      className={clsx(
        "bg-white border-[3px] border-black shadow-[4px_4px_0_#000] p-4 select-none",
        className
      )}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-mono font-bold uppercase text-gray-700">
          {label}
        </span>
        <span className="font-mono text-xs font-bold px-2 py-0.5 border border-black bg-black text-[#FFE600]">
          {tone.label} ({clamped}%)
        </span>
      </div>
      <div className="w-full h-4 bg-gray-100 border-2 border-black overflow-hidden relative">
        <div
          className={clsx("h-full border-r-2 border-black transition-all duration-500", tone.bg)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
