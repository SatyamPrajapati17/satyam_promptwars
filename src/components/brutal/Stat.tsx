"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";

export interface StatProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  helper?: string;
  icon?: React.ReactNode;
  variant?: "default" | "yellow" | "dark";
  className?: string;
}

export function Stat({
  label,
  value,
  suffix = "",
  prefix = "",
  helper,
  icon,
  variant = "default",
  className,
}: StatProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 900;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current =
        progress === 1
          ? value
          : Math.round(start + (value - start) * (1 - Math.pow(2, -10 * progress)));
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }, [value]);

  const bgStyles = {
    default: "bg-white text-black",
    yellow: "bg-[#FFE600] text-black",
    dark: "bg-black text-[#FFE600]",
  };

  return (
    <div
      className={clsx(
        "border-[3px] border-black shadow-[4px_4px_0_#000] p-4 sm:p-5 select-none relative overflow-hidden",
        bgStyles[variant],
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-black/80">
          {label}
        </span>
        {icon && <span className="shrink-0">{icon}</span>}
      </div>
      <div
        className="text-3xl sm:text-4xl font-black tracking-tight"
        style={{ fontFamily: "var(--font-archivo-black)" }}
      >
        {prefix}
        {displayValue}
        {suffix}
      </div>
      {helper && (
        <p className="mt-1 text-xs font-medium text-black/70">{helper}</p>
      )}
    </div>
  );
}

