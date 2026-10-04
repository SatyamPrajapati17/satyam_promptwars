"use client";

import React from "react";
import clsx from "clsx";

export interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

export function ProgressRing({
  value,
  size = 72,
  strokeWidth = 8,
  label,
  className,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={clsx(
        "inline-flex flex-col items-center justify-center select-none",
        className
      )}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E10600"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="square"
            fill="none"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-sm">
          {clamped}%
        </div>
      </div>
      {label && (
        <span className="mt-1 text-[11px] font-bold font-mono uppercase tracking-wider text-black text-center">
          {label}
        </span>
      )}
    </div>
  );
}

