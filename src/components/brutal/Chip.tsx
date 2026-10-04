"use client";

import React from "react";
import clsx from "clsx";

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "yellow"
    | "red"
    | "green"
    | "blue"
    | "amber"
    | "dark";
  size?: "sm" | "md";
}

export function Chip({
  children,
  variant = "default",
  size = "md",
  className,
  ...props
}: ChipProps) {
  const variantStyles = {
    default: "bg-white text-black",
    yellow: "bg-[#FFE600] text-black",
    red: "bg-[#FF6B6B] text-black",
    green: "bg-[#6EE7A8] text-black",
    blue: "bg-[#7DD3FC] text-black",
    amber: "bg-[#FFD166] text-black",
    dark: "bg-black text-[#FFE600]",
  };

  const sizeStyles = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  return (
    <span
      className={clsx(
        "brutal-chip select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

