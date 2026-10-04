"use client";

import React, { forwardRef } from "react";
import clsx from "clsx";
import { AlertCircle } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold font-mono uppercase tracking-wider text-black"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={clsx(
            "brutal-input",
            error && "border-[#E10600] bg-red-50 focus:bg-red-50",
            className
          )}
          {...props}
        />
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

Input.displayName = "Input";
