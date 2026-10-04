"use client";

import React from "react";
import clsx from "clsx";

export interface SliderProps {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  helperText?: string;
  className?: string;
}

export function Slider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  formatValue = (v) => `${v}%`,
  helperText,
  className,
}: SliderProps) {
  return (
    <div className={clsx("w-full space-y-2 select-none", className)}>
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-xs font-bold font-mono uppercase tracking-wider text-black">
            {label}
          </label>
        )}
        <span className="font-mono font-bold text-sm bg-black text-[#FFE600] px-2 py-0.5 border-2 border-black shadow-[2px_2px_0_#000]">
          {formatValue(value)}
        </span>
      </div>
      <div className="relative py-2 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-3 bg-white border-[2.5px] border-black rounded-none appearance-none cursor-pointer accent-[#E10600] shadow-[2px_2px_0_#000]"
        />
      </div>
      {helperText && (
        <p className="text-xs text-gray-700 font-medium">{helperText}</p>
      )}
    </div>
  );
}

