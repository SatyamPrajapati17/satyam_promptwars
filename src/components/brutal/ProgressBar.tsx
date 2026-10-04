"use client";

import React from "react";
import clsx from "clsx";

export interface ProgressBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
  color?: "red" | "green" | "black" | "yellow";
  className?: string;
}

export function ProgressBar({
  value,
  label,
  showValue = true,
  color = "red",
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));

  const colorStyles = {
    red: "bg-[#E10600]",
    green: "bg-[#6EE7A8]",
    black: "bg-black",
    yellow: "bg-[#FFE600]",
  };

  return (
    <div className={clsx("w-full space-y-1.5", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs font-mono font-bold uppercase">
          {label && <span>{label}</span>}
          {showValue && <span>{clamped}%</span>}
        </div>
      )}
      <div className="w-full h-4 bg-white border-[2.5px] border-black shadow-[2px_2px_0_#000] overflow-hidden p-0.5">
        <div
          className={clsx(
            "h-full transition-all duration-500 ease-out border-r-2 border-black",
            colorStyles[color]
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
