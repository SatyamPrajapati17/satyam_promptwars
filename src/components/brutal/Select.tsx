"use client";

import React, { forwardRef } from "react";
import clsx from "clsx";
import { AlertCircle, ChevronDown } from "lucide-react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, children, className, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-bold font-mono uppercase tracking-wider text-black"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={clsx(
              "brutal-input appearance-none pr-10 cursor-pointer font-bold",
              error && "border-[#E10600] bg-red-50",
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-black">
            <ChevronDown className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
        {helperText && !error && (
          <p className="text-xs text-gray-700 font-medium">{helperText}</p>
        )}
        {error && (
          <p className="text-xs font-bold text-[#E10600] flex items-center gap-1.5 pt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
