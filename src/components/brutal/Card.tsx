"use client";

import React from "react";
import clsx from "clsx";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "dark" | "yellow";
  hover?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
}

export function Card({
  children,
  variant = "default",
  hover = false,
  padding = "md",
  className,
  ...props
}: CardProps) {
  const paddingClasses = {
    none: "p-0",
    sm: "p-3 sm:p-4",
    md: "p-5 sm:p-6",
    lg: "p-6 sm:p-8",
  };

  const variantClasses = {
    default: "brutal-card",
    dark: "brutal-card-dark",
    yellow:
      "bg-[#FFE600] text-black border-[3px] border-black shadow-[6px_6px_0_#000]",
  };

  return (
    <div
      className={clsx(
        variantClasses[variant],
        paddingClasses[padding],
        hover && "brutal-card-hover",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

