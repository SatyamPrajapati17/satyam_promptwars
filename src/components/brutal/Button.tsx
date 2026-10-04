"use client";

import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "dark" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  href?: string;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  href,
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: "min-h-[40px] px-3.5 py-1.5 text-xs",
    md: "min-h-[48px] px-5 py-2.5 text-sm",
    lg: "min-h-[56px] px-8 py-3.5 text-base",
  };

  const variantClasses = {
    primary: "brutal-btn",
    secondary: "brutal-btn-secondary",
    dark: "brutal-btn-dark",
    danger: "brutal-btn bg-red-700 hover:bg-red-800",
  };

  const combinedClass = clsx(
    "brutal-btn-base font-bold tracking-wider",
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  const inner = (
    <>
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={combinedClass}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      className={combinedClass}
      disabled={disabled || isLoading}
      {...props}
    >
      {inner}
    </button>
  );
}

