"use client";

import React, { forwardRef } from "react";
import clsx from "clsx";
import { AlertCircle } from "lucide-react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, id, rows = 4, ...props }, ref) => {
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
        <textarea
          id={inputId}
          ref={ref}
          rows={rows}
          className={clsx(
            "w-full bg-white text-black border-[3px] border-black shadow-[3px_3px_0_#000] p-3 font-sans text-base transition-all focus:outline-none focus:shadow-[5px_5px_0_#000] focus:bg-yellow-50",
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

Textarea.displayName = "Textarea";
